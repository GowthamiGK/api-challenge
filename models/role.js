"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize/setup.js");

const Role = sequelize.define("Role", {
  name: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      is: {
        args: /^[a-z0-9\-\_]+[a-z0-9\-\_\s]+[a-z0-9\-\_]$/,
        msg: "Role name characters must only consist of lowercase letters, numbers, -, or _ and must not start or end with a space",
      },
    },
  },
  createdAt: {
    type: Sequelize.DATE,
    field: "created_at",
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: "updated_at",
  },
});

Role.defaultRoles = Object.freeze([
  "owner",
  "admin",
  "author",
  "editor",
  "member",
  "support",
  "contributor",
  "viewer",
  "subscriber",
]);

module.exports = Role;
