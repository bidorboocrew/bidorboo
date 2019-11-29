const userDataAccess = require('../data-access/userDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const mongoUser_id = req.user._id;
      const stripeConnect = await userDataAccess.getUserStripeAccount(mongoUser_id);
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
          email:
            currentUser.email && currentUser.email.isVerified ? currentUser.email.emailAddress : '',
          phone:
            currentUser.phone && currentUser.phone.isVerified ? currentUser.phone.phoneNumber : '',
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
              'we could not create a stripe accoutn fo you. Please email us at bidorboo@bidorboo.com',
          });
        }
      }
    } else {
      return res.status(401).send({ errorMsg: 'you gotta sign in first.' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to check for existing account', details: `${e}` });
  }
};
