const _ = require("lodash");
const routeUtils = require("./utils.route.js");
const User = require("../../models/user.js");

module.exports = [
  // Read self
  {
    method: "GET",
    path: "/users/self",
    config: {
      description: "Read a user",
      tags: ["Users"],
    },
    handler: async (request, h) => {
      try {
        const { user } = request.auth.credentials;
        return routeUtils.replyWith.found(user.get(), h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },
];
