const userDataAccess = require('../data-access/userDataAccess');
const { bugsnagClient } = require('../index');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const currentUser = await userDataAccess.findOneByUserId(req.user.userId, { virtuals: true });

      if (currentUser && currentUser._id && currentUser.canPost) {
        next();
      } else {
        return res.status(401).send({
          safeMsg:
            'You are not allowed to Post. You must verify your email and phone before posting a request. You can Chat with our customer support for further help',
        });
      }
    } else {
      return res.status(401).send({ errorMsg: 'You must be logged in to perform this action' });
    }
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg =
      'You are not allowed to Post. You must verify your email and phone before posting a request. You can Chat with our customer support for further help';
    return next(e);
  }
};
