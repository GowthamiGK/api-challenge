const _ = require("lodash");
const Promise = require("bluebird");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const { expect } = require("chai");

const sequelize = require("../../config/sequelize/setup.js");
const factories = require("../factories/index.js");
const utils = require("../../models/utils.js");

const Test = {
  sequelize,
  factories,
  utils,
  basics: {},
  uuid,
};

Test.modelNames = [];
const modelFileNames = fs.readdirSync(path.resolve(__dirname, "../../models"));
modelFileNames.map((fileName) => {
  Test.modelNames.push(
    _.startCase(fileName.replace(".js", "")).replace(/ /g, "")
  );
});
Test.modelNames.map((modelName) => {
  Test[modelName] = sequelize.models[modelName];
});

if (
  process.env.NODE_ENV === "test" &&
  sequelize.config.database === "api_challenge"
) {
  Test.resetTable = (modelName) => {
    if (modelName === "Utils") return;
    if (!modelName) throw new Error("modelName undefined");
    if (!Test[modelName]) throw new Error(`${modelName} not defined`);
    return Test[modelName].sync({ force: true, logging: false });
  };

  Test.setupTable = async (modelName) => {
    if (!modelName) throw new Error("modelName undefined");
    let lower = modelName.toLowerCase();
    if (lower === "activity") lower = "activitie";
    if (lower === "identity") lower = "identitie";
    await Test.resetTable(modelName);
    await Test[modelName].create(
      eval("factories." + lower + "s.basic_" + lower)
    );
  };

  Test.assignRoleForUser = async ({ userId, tenantId, roleName }) => {
    const role = await Test.Role.findOne({
      where: { tenantId, name: roleName },
    });
    return Test.factories.userRole.createBasic({
      userId,
      roleId: role.id,
      tenantId: role.tenantId,
    });
  };

  Test.getBearerToken = async (user, { prependBearerText = true } = {}) => {
    const { tokens } = await user.generateAccessToken();

    return prependBearerText
      ? `Bearer ${tokens.access.value}`
      : tokens.access.value;
  };

  Test.resetDb = async () => {
    let deferreds = [];
    Test.modelNames.map((name) => {
      deferreds.push(Test.resetTable(name));
    });
    await Promise.all(deferreds);
    await Test.sequelize.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
    Test.resetSentEmails();
    return Promise.resolve();
  };

  Test.setupDb = async () => {
    try {
      await Test.resetDb();
    } catch (err) {
      console.error(err);
    }
  };

  Test.assertUserRole = async ({ userId, name }) => {
    const role = await Test.Role.find({ where: { name } });
    const userRole = await Test.UserRole.find({
      where: { roleId: role.id, userId },
    });
    expect(userRole).to.exist;
  };
}

module.exports = Test;
