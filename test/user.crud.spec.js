"use strict";

const _ = require("lodash");
const { expect } = require("chai");
const { server } = require("./config/test.server.js");
const Test = require("./config/test.utils.js");

const uri = `${server.info.uri}/v0`;

describe("should do something", () => {
  it("should do an API request", async () => {});

  it("Should also do this", () => {
    expect(true).to.equal(false);
  });
});
