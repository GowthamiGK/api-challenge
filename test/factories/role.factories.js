const _ = require("lodash");
const Role = require("../../models/role.js");

const factories = {};

factories.buildBasic = (data = {}) => {
  return Role.build({
    data: data.data || {},
    ...data,
  });
};

factories.createBasic = (data) => factories.buildBasic(data).save();

factories.createBasics = (n = 1) => {
  deferreds = [];
  _.times(n, () => deferreds.push(factories.createBasic()));
  return Promise.all(deferreds);
};

module.exports = factories;
