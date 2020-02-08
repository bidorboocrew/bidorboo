const userDataAccess = require('../data-access/userDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page

      const userId = req.user.userId;
      const ourNewUser = await userDataAccess.findOneByUserId(userId);
      if (
        !ourNewUser ||
        !ourNewUser.email ||
        !ourNewUser.email.emailAddress ||
        !ourNewUser.displayName
      ) {
        return res.status(200).send({
          safeMsg: "We couldn't setup a your customer account.",
        });
      }

      if (ourNewUser.stripeCustomerAccId) {
        await stripeServiceUtil.updateCustomer(ourNewUser.stripeCustomerAccId, {
          email: ourNewUser.email.emailAddress,
          name: ourNewUser.displayName,
        });
        next();
        return;
      }

      const { id } = await stripeServiceUtil.initializeCustomer({
        email: ourNewUser.email.emailAddress,
        name: ourNewUser.displayName,
      });

      userDataAccess.findByUserIdAndUpdate(userId, {
        stripeCustomerAccId: id,
      });
      next();
      return;
    } else {
      return res.status(401).send({ safeMsg: 'you gotta sign in first.' });
    }
  } catch (e) {
    e.safeMsg = "We couldn't setup a your customer account.";
    return next(e);
  }
};
