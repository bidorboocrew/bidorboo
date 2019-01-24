const userDataAccess = require('../data-access/userDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const currentUser = await userDataAccess.findOneByUserId(req.user.userId);

      if (currentUser && currentUser._id && currentUser.canBid) {
        next();
      } else {
        return res.status(401).send({ errorMsg: 'you are not allowed to bid.' });
      }
    } else {
      return res.status(401).send({ errorMsg: 'You must be logged in to perform this action' });
    }
  } catch (e) {
    return res
      .status(500)
      .send({ errorMsg: 'failed to validate is uesr ability to bid', details: `${e}` });
  }
};
