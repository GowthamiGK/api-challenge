const User = require("../../models/pg/user.js");

/**
 * Check that a decoded JWT has values matching its user's token.
 * This method is used by Hapi JWT auth https://github.com/dwyl/hapi-auth-jwt2#documentation
 * @param {Object} decodedToken
 */
const validateJwt = async (decodedToken, request) => {
  try {
    // Look up the user based on the decoded token
    let where = {
      eid: decodedToken.userId,
    };
    const user = await User.findOne({ where });

    // If there is not a matching user, fail validation
    if (!user || !user.id) {
      return { isValid: false };
    }

    return {
      isValid: true,
      credentials: {
        decodedToken,
        user,
      },
    };
  } catch (err) {
    return { isValid: false };
  }
};

module.exports = {
  validateJwt,
};
