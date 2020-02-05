const userDataAccess = require('../data-access/userDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const currentUser = await userDataAccess.findOneByUserId(req.user.userId, { virtuals: true });

      if (currentUser && currentUser._id && currentUser.canBid) {
        next();
      } else {
        return res.status(401).send({
          errorMsg:
            'You are not allowed to Bid yet. You can Chat with our customer support for further help',
        });
      }
    } else {
      return res.status(401).send({ errorMsg: 'You must be logged in to perform this action' });
    }
  } catch (e) {
    e.safeMsg = 'failed to validate is uesr ability to bid';
    return next(e);
  }
};
