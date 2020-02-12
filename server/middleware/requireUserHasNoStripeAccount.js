const { getUserStripeAccount } = require('../data-access/userDataAccess');
const { bugsnagClient } = require('../index');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const mongoUser_id = req.user._id;
      const stripeConnect = await getUserStripeAccount(mongoUser_id);
      if (stripeConnect && stripeConnect.accId && stripeConnect.accId.length > 0) {
        return res.status(403).send({ safeMsg: 'You already have a registered account' });
      } else {
        next();
      }
    } else {
      return res.status(401).send({ safeMsg: 'you gotta sign in first.' });
    }
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = 'failed to check for existing account';
    return next(e);
  }
};
