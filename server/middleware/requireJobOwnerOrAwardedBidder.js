const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const { jobId } = req.body.data;
      if (!jobId) {
        return res.status(403).send({
          errorMsg: 'Bad Request. missing params',
        });
      }

      const userId = req.user._id.toString();
      const jobOwner = await jobDataAccess.isJobOwner(userId, jobId);
      const awardedBidder = await jobDataAccess.isAwardedBidder(userId, jobId);
      if ((jobOwner && jobOwner._id) || (awardedBidder && awardedBidder._id)) {
        next();
      } else {
        return res
          .status(403)
          .send({ errorMsg: 'only users relevant to the job can change its state.' });
      }
    } else {
      return res
        .status(403)
        .send({ errorMsg: 'only users relevant to the job can change its state' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg: "failed to verify that you are relevant to the job. Couldn't change state",
      details: `${e}`,
    });
  }
};
