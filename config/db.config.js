"use strict";

require("./env/dotenv.js");

module.exports = {
  development: {
    database: "userfront_dev",
    username: process.env.DATABASE_USERNAME || "postgres",
    password: null,
    host: "localhost",
    dialect: "postgres",
    port: 5431,
  },
  test: {
    database: "userfront_test",
    username: process.env.DATABASE_USERNAME || "postgres",
    password: null,
    host: "localhost",
    dialect: "postgres",
    port: 5431,
  },
};
