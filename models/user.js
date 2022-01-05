"use strict";

const _ = require("lodash");
const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize/setup.js");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

const User = sequelize.define("User", {
  uuid: {
    type: Sequelize.UUID,
    unique: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail(email, next) {
        try {
          if (email.length < 6 || email.length > 254)
            return next(new Error("Email must be between 6-254 characters"));

          const result = Joi.string().email().validate(email);

          if (_.has(result, "error")) {
            if (result.error.message === '"value" must be a valid email')
              throw new Error("Email format is invalid");

            throw result.error;
          }

          next();
        } catch (error) {
          throw error;
        }
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

/**
 * Omit sensitive values whenever toJSON is called
 */
User.prototype.toJSON = function () {
  return _.omit(this.get(), User.restrictedAttrs);
};

/**
 * Find a user along with its roles
 *
 * @returns {Object}
 */
User.prototype.findComplete = async function () {
  const user = this;
  const userObj = user.get();
  const rolesResult = await sequelize.query(
    `SELECT r.name FROM "Roles" r JOIN "UserRoles" ur ON r.id = ur.role_id WHERE ur.user_id = :userId`,
    { replacements: { userId: user.id } }
  );

  return {
    ...userObj,
    roles: _.map(rolesResult[0], "name"),
  };
};

/**
 * Fetch user details based on userId
 *
 * @returns {Object}
 */
 User.prototype.findUser = async function (userId) {
  const user = this;

  // Check that the user is an admin
  const adminRole = await sequelize.models.UserRole.findOne({
    where: { userId: user.id, roleId: 1 },
  });

  // If not an admin, reject the request
  if (!adminRole) throw new Error("Unauthorized");

  // Query to get user details
  const userObj = await sequelize.query(
    `SELECT u.* FROM "Users" u  WHERE u.id = :userId`,
    { replacements: { userId: userId } }
  );
  const rolesResult = await sequelize.query(
    `SELECT r.name FROM "Roles" r JOIN "UserRoles" ur ON r.id = ur.role_id WHERE ur.user_id = :userId`,
    { replacements: { userId: userId } }
  );

  return {
    ...userObj[0][0],
    roles: _.map(rolesResult[0], "name"),
  };
};

/**
 * Create and return a JWT access token for a user
 */
User.prototype.generateAccessToken = async function () {
  const user = this;

  // Construct access token
  const accessPayload = {
    userId: user.id,
    userUuid: user.uuid,
    iss: "userfront",
  };

  // Sign token
  const accessToken = jwt.sign(
    accessPayload,
    {
      key: process.env.RSA_PRIVATE_KEY,
    },
    {
      expiresIn: 2592000, // 30 days
      algorithm: "RS256",
    }
  );

  return accessToken;
};

User.restrictedAttrs = ["id", "tokens", "updatedAt"];

module.exports = User;
