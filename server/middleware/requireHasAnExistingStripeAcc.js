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
        return res.status(400).send({
          errorMsg:
            'you do not have an existing stripe account with us. Please email us at bidorboocrew@gmail.com',
        });
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
