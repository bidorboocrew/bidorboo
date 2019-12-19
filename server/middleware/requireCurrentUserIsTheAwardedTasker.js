const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const { requestId } = req.body.data;
      if (!requestId) {
        return res.status(403).send({
          errorMsg: 'missing paramerters . can not confirm that you are the awarded Tasker.',
        });
      }

      const mongoUser_id = req.user._id.toString();
      const request = await requestDataAccess.isAwardedTasker(mongoUser_id, requestId);

      if (request._awardedBidRef && request._awardedBidRef._taskerRef._id.toString() === mongoUser_id) {
        res.locals.bidOrBoo = {
          bidId: request._awardedBidRef._id,
        };
        next();
      } else {
        return res
          .status(403)
          .send({ errorMsg: 'only the awarded Tasker can perform this operation.' });
      }
    } else {
      return res.status(403).send({ errorMsg: 'only logged in users can perform this operation.' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate is awarded Tasker', details: `${e}` });
  }
};
