"use strict";

const _ = require("lodash");
const Boom = require("boom");
// const Joi = require("@hapi/joi");
// const utils = require("../../models/utils.js");
const fns = {};

fns.prefix = "v0";

fns.replyWith = {
  forbidden: (h) => Boom.forbidden(),
  unauthorized: (h) => Boom.unauthorized(),
  found: (record, h) => (record ? h.response(record) : Boom.notFound()),
  notFound: (h) => fns.replyWith.found(null, h),
  deleted: (record, h) => h.response({ message: "deleted", ...record }),
};

fns.handleErr = (err = {}, h) => {
  if (typeof err !== "object") err = { message: err };
  if (err.message === "Not Found") return Boom.notFound();
  if (err.message === "Unauthorized") return Boom.unauthorized();
  if (err.message === "Forbidden") return fns.replyWith.forbidden(h);
  if (err.message === "Usage Limit Exceeded")
    return Boom.tooManyRequests("Usage Limit Exceeded");

  const firstError = err.errors && err.errors[0];

  if (err.name === "SequelizeValidationError") {
    err.message = err.message.replace(/Validation error: /gi, "");

    if (
      err.message.startsWith("Validation is") &&
      firstError &&
      firstError.path === "username"
    ) {
      err.message =
        "Username must consist of letters, numbers, hyphens, or underscores";
    }
    if (
      err.message.startsWith("Validation not") &&
      firstError &&
      firstError.path === "username"
    ) {
      err.message = "Username not allowed, please choose another";
    }
    return Boom.badRequest(err.message);
  }

  if (err.name === "SequelizeUniqueConstraintError" && firstError) {
    if (firstError.path === "username") {
      return Boom.badRequest("Username exists");
    }
    if (err.message === "Validation error" && err.errors) {
      for (let i = 0; i < err.errors.length; i++) {
        switch (err.errors[i].message) {
          case "username must be unique":
            return Boom.badRequest("Username exists");
          case "email must be unique":
            return Boom.badRequest("Email exists");
          default:
            break;
        }
      }
    }
  }

  if (/^Sequelize/gi.test(err.name)) {
    err.message = "Problem with request";
  }

  return Boom.badRequest(err.message);
};

fns.atob = (str) => Buffer.from(str, "base64").toString();
// fns.btoa = str => Buffer.from(str).toString('base64')

module.exports = fns;
