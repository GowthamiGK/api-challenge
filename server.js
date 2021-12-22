"use strict";

require("./config/env/dotenv.js");

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const Hapi = require("@hapi/hapi");
const AuthJWT = require("hapi-auth-jwt2");
const { validateJwt } = require("./config/auth/validate.jwt.js");
const Tenant = require("./models/pg/tenant.js");

const serverOptions = {
  port: process.env.PORT,
  address: "0.0.0.0",
  routes: {
    security: true, // Enable HSTS headers
    cors: {
      origin: ["*"],
      credentials: true,
      maxAge: 604800, // 1 week
      additionalHeaders: [
        "x-requested-with",
        "x-application-id",
        "anymod-url",
        "anymod-project",
        "anymod-preview",
      ],
    },
    files: {
      relativeTo: path.join(__dirname, "public"),
    },
  },
};
// Run as http://userfront.test so that we can distinguish between localhost and non-localhost in Page tests
if (process.env.NODE_ENV === "test") serverOptions.host = "userfront.test";
if (process.env.NODE_ENV === "development") serverOptions.host = "localhost";

const server = new Hapi.Server(serverOptions);

async function registerModels() {
  const modelFileNames = fs.readdirSync(path.resolve(__dirname, "./models/pg"));
  modelFileNames.forEach((fileName) => {
    require(`./models/pg/${fileName}`);
  });
}

// Auth
async function registerAuth() {
  // JWT
  await server.register({ plugin: AuthJWT });
  server.auth.strategy("jwt", "jwt", {
    key: Tenant.getJwtKeys,
    cookieKey: "hapi_auth_jwt2_cookie_key",
    validate: validateJwt,
    validateOptions: { payload: true },
    verifyOptions: { algorithms: ["RS256", "HS256"] },
  });

  // Default is JWT
  server.auth.default("jwt");
}

async function registerRoutes() {
  // v0 routes
  await server.register(
    {
      plugin: require("./config/routes/index.js")["plugin"]["v0"],
    },
    { routes: { prefix: "/v0" } }
  );
}

// Start and Stop
server.stopRun = async (cb) => {
  await server.stop();
  if (cb) cb();
  server.log("info", "Server stopped");
};

server.startRun = async (cb) => {
  await server.start();
  if (cb) cb();
  server.log("info", "Server running at: " + server.info.uri);
};

async function start() {
  await registerModels();
  await registerAuth();
  await registerRoutes();
  await server.startRun();
}
start();

module.exports = { server };
