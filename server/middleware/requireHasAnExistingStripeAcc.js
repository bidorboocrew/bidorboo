const userDataAccess = require('../data-access/userDataAccess');

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
        return res.status(200).send({
          safeMsg:
            'you do not hasve an existing stripe account with us. Setup your account or email us at bidorboo@bidorboo.ca',
        });
      }
    } else {
      return res.status(401).send({ safeMsg: 'you gotta sign in first.' });
    }
  } catch (e) {
    e.safeMsg = 'failed to check for existing account';
    return next(e);
  }
};
