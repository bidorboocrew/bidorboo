const userDataAccess = require('../data-access/userDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const currentUser = await userDataAccess.findOneByUserId(req.user.userId, { virtuals: true });

      if (currentUser && currentUser._id && currentUser.canPost) {
        next();
      } else {
        return res.status(401).send({
          errorMsg:
            'you are not allowed to Post. You must verify your email and phone before posting a request',
        });
      }
    } else {
      return res.status(401).send({ errorMsg: 'You must be logged in to perform this action' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate is uesr ability to post', details: `${e}` });
  }
};
