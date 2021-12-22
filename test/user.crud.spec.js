"use strict";

const _ = require("lodash");
const { expect } = require("chai");
const { server } = require("./config/test.server.js");
const Test = require("./config/test.utils.js");

const uri = `${server.info.uri}/v0`;
const scope = {};

describe("should do something", () => {
  before(async () => {
    await Test.setupDb();

    // Create a user and a JWT access token for that user
    scope.adminUser = await Test.factories.user.createBasic({
      email: `admin@example.com`,
    });
    scope.adminAccessToken = await scope.adminUser.generateAccessToken();

    // Add the admin role for the user
    await Test.assignRoleForUser({ user: scope.adminUser, roleName: "admin" });

    return Promise.resolve();
  });

  it("should read own information", async () => {
    const { statusCode, result } = await server.inject({
      method: "get",
      url: `${uri}/users/self`,
      headers: {
        authorization: `Bearer ${scope.adminAccessToken}`,
      },
    });
    expect(statusCode).to.equal(200);

    expect(result.id).to.equal(scope.adminUser.id);
    expect(result.uuid).to.equal(scope.adminUser.uuid);
    expect(result.email).to.equal(scope.adminUser.email);

    return Promise.resolve();
  });
});
