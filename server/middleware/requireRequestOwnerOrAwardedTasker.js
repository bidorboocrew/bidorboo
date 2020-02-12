const { requestDataAccess } = require('../data-access/requestDataAccess');
const { bugsnagClient } = require('../index');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const { requestId } = req.body.data;
      if (!requestId) {
        return res.status(403).send({
          safeMsg: 'Bad Request. missing params',
        });
      }

      const userId = req.user._id.toString();
      const requestOwner = await requestDataAccess.isRequestOwner(userId, requestId);
      const awardedTasker = await requestDataAccess.isAwardedTasker(userId, requestId);
      if ((requestOwner && requestOwner._id) || (awardedTasker && awardedTasker._id)) {
        next();
      } else {
        return res
          .status(403)
          .send({ safeMsg: 'only users relevant to the request can change its state.' });
      }
    } else {
      return res
        .status(403)
        .send({ safeMsg: 'only users relevant to the request can change its state' });
    }
  } catch (e) {
    bugsnagClient.notify(e);

    e.safeMsg = `failed to verify that you are relevant to the request. Couldn't change state`;
    return next(e);
  }
};
