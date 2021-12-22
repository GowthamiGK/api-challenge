"use strict";

const factories = {};
const models = ["role", "user"];

for (let model of models) {
  factories[model] = require("./" + model + ".factories.js");
}

module.exports = factories;
