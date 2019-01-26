const userDataAccess = require('../data-access/userDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const mongodbUserId = req.user._id;
      const stripeConnect = await userDataAccess.getUserStripeAccount(mongodbUserId);
      if (stripeConnect && stripeConnect.accId && stripeConnect.accId.length > 0) {
        res.locals.bidOrBoo = {
          stripeConnectAccId: stripeConnect.accId,
        };
        next();
      } else {
        const currentUser = await userDataAccess.findOneByUserId(req.user.userId);
        // user does not have a stripe account , we must establish one
        const newStripeConnectAcc = await stripeServiceUtil.initializeConnectedAccount({
          user_id: currentUser._id.toString(),
          userId: currentUser.userId,
          displayName: currentUser.displayName,
          email: currentUser.email.emailAddress,
        });
        if (newStripeConnectAcc.id) {
          const updateUser = await userDataAccess.findByUserIdAndUpdate(currentUser.userId, {
            stripeConnect: {
              accId: newStripeConnectAcc.id,
            },
          });
          res.locals.bidOrBoo = {
            stripeConnectAccId: newStripeConnectAcc.id,
          };
          next();
        } else {
          return res.status(400).send({
            errorMsg:
              'we could not create a stripe accoutn fo you. Please email us at bidorboocrew@gmail.com',
          });
        }
      }
    } else {
      return res.status(401).send({ errorMsg: 'you gotta sign in first.' });
    }
  } catch (e) {
    return res
      .status(500)
      .send({ errorMsg: 'failed to check for existing account', details: `${e}` });
  }
};
