const { getUserStripeAccount } = require('../data-access/userDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const mongodbUserId = req.user._id;
      const stripeConnect = await getUserStripeAccount(mongodbUserId);
      if (stripeConnect && stripeConnect.accId && stripeConnect.accId.length > 0) {
        return res.status(403).send({ errorMsg: 'You already have a registered account' });
      } else {
        next();
      }
    } else {
      return res.status(401).send({ errorMsg: 'you gotta sign in first.' });
    }
  } catch (e) {
    return res.status(500).send({ errorMsg: 'failed to check for existing account', details: e });
  }
};
