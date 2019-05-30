const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const { jobId } = req.body.data;
      if (!jobId) {
        return res.status(403).send({
          errorMsg: 'missing paramerters . can not confirm that you are the awarded Bidder.',
        });
      }

      const mongoUser_id = req.user._id.toString();
      const job = await jobDataAccess.isAwardedBidder(mongoUser_id, jobId);

      if (job._awardedBidRef && job._awardedBidRef._bidderRef._id.toString() === mongoUser_id) {
        res.locals.bidOrBoo = {
          bidId: job._awardedBidRef._id,
        };
        next();
      } else {
        return res
          .status(403)
          .send({ errorMsg: 'only the awarded Bidder can perform this operation.' });
      }
    } else {
      return res.status(403).send({ errorMsg: 'only logged in users can perform this operation.' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate is awarded Bidder', details: `${e}` });
  }
};
