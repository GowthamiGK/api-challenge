"use strict";

const _ = require("lodash");
const { expect } = require("chai");
const { server } = require("./config/test.server.js");
const sequelize = require("../config/sequelize/setup.js");
const Test = require("./config/test.utils.js");

const uri = `${server.info.uri}/v0`;
const scope = {};

describe("User CRUD operations -", () => {
  before(async () => {
    await Test.setupDb();

    // Create a user and a JWT access token for that user
    scope.user = await sequelize.models.User.create({
      email: `user@example.com`,
    });
    scope.accessToken = await scope.user.generateAccessToken();

    // Add the admin role for the user
    await Test.assignRoleForUser({ user: scope.user, roleName: "admin" });

    return Promise.resolve();
  });

  it("should read own information", async () => {
    const { statusCode, result } = await server.inject({
      method: "get",
      url: `${uri}/users/self`,
      headers: {
        authorization: `Bearer ${scope.accessToken}`,
      },
    });
    expect(statusCode).to.equal(200);

    expect(result.id).to.equal(scope.user.id);
    expect(result.uuid).to.equal(scope.user.uuid);
    expect(result.email).to.equal(scope.user.email);

    return Promise.resolve();
  });
});
