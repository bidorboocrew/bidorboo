const userDataAccess = require('../data-access/userDataAccess');
const { bugsnagClient } = require('../utils/utilities');
const stripeServiceUtil = require('../services/stripeService').util;

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const currentUser = await userDataAccess.findOneByUserId(req.user.userId, { virtuals: true });

      if (currentUser && currentUser._id && currentUser.canBid) {
        next();
      } else {
        // fetc
        const userStripeAccountDetail = currentUser.stripeConnect;

        if (userStripeAccountDetail && userStripeAccountDetail.accId) {
          accDetails = await stripeServiceUtil.getConnectedAccountDetails(
            userStripeAccountDetail.accId
          );
          if (accDetails) {
            const {
              id: accId,
              payouts_enabled,
              charges_enabled,
              requirements: accRequirements,
              metadata,
              capabilities: { transfers, card_payments },
            } = accDetails;

            const { userId } = metadata;
            if (userId.toString() === req.user.userId.toString()) {
              await userDataAccess.updateStripeAccountRequirementsDetails({
                userId,
                accId,
                chargesEnabled: charges_enabled,
                payoutsEnabled: payouts_enabled,
                capabilities: {
                  card_payments,
                  transfers,
                },
                accRequirements,
              });

              const updatedUser = await userDataAccess.findOneByUserId(req.user.userId, {
                virtuals: true,
              });
              if (updatedUser && updatedUser._id && updatedUser.canBid) {
                next();
              }
            }
          }
        }

        return res.status(401).send({
          errorMsg:
            'You are not allowed to Bid yet. You can Chat with our customer support for further help',
        });
      }
    } else {
      return res.status(401).send({ errorMsg: 'You must be logged in to perform this action' });
    }
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = 'failed to validate is uesr ability to bid';
    return next(e);
  }
};
