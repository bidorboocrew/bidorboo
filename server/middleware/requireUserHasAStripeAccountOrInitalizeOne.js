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
        let initialUserAccDetails = {
          user_id: currentUser._id.toString(),
          userId: currentUser.userId,
          displayName: currentUser.displayName,
          tosAcceptance: {
            date: currentUser.tos_acceptance.date,
            ip: currentUser.tos_acceptance.ip,
          },
        };
        if (currentUser.email && currentUser.email.isVerified) {
          initialUserAccDetails = {
            ...initialUserAccDetails,
            email: currentUser.email.emailAddress,
          };
        }
        if (currentUser.phone && currentUser.phone.isVerified) {
          initialUserAccDetails = {
            ...initialUserAccDetails,
            phone: currentUser.phone.phoneNumber,
          };
        }

        const newStripeConnectAcc = await stripeServiceUtil.initializeConnectedAccount(initialUserAccDetails);
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
            safeMsg:
              'we could not create a stripe accoutn fo you. Please email us at bidorboo@bidorboo.ca',
          });
        }
      }
    } else {
      return res.status(401).send({ safeMsg: 'you gotta sign in first.' });
    }
  } catch (e) {
    e.safeMsg = 'failed to check for existing stripe account';
    return next(e);
  }
};
