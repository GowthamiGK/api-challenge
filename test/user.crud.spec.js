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

    // Create a user and their JWT access token
    scope.adminUser = await Test.factories.user.createBasic({
      email: `admin@example.com`,
    });
    scope.adminAccessToken = await Test.getBearerToken(user);

    // Assign admin role to user
    const adminRole = await Test.Role.find({
      where: { name: "admin" },
    });
    await Test.factories.userRole.createBasic({
      userId: scope.adminUser.id,
      roleId: adminRole.id,
    });
  });

  it("should do an API request", async () => {
    const payload = {};
    console.log(Test.basics);
    const { statusCode, result } = await server.inject({
      method: "get",
      url: `${uri}/users/${1}`,
      headers: {
        authorization: await Test.getBearerToken(Test.basics.user),
      },
      payload,
    });
    expect(statusCode).to.equal(201);
  });

  it("Should also do this", () => {
    expect(true).to.equal(false);
  });
});
