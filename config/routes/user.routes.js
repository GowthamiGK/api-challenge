const _ = require("lodash");
const routeUtils = require("./utils.route.js");
const User = require("../../models/pg/user.js");

module.exports = [
  // Read
  {
    method: "GET",
    path: "/users/{userId}",
    config: {
      description: "Read a user",
      tags: ["Users"],
      // validate: {
      //   params: Joi.object({ tenantId: joiUtils.tenantId }),
      //   payload: joiModels.user.create.payload,
      //   headers: joiModels.utils.headers,
      //   failAction: joiUtils.returnValidationErrorMessage,
      // },
      // response: {
      //   schema: joiModels.user.create.responses[200],
      //   failAction: joiUtils.logValidationErrorAndContinue,
      // }
    },
    handler: async (request, h) => {
      try {
        // const { token } = request.auth.credentials;
        // const user = await User.createWithPermission({
        //   token,
        //   tenantEid: request.params.tenantId,
        //   payload: request.payload,
        // });
        const user = {
          foo: "bar",
        };
        return routeUtils.replyWith.found(user, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },
];
