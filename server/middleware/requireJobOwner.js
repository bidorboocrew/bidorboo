const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { jobId } = req.body.data;
    if (!jobId) {
      return res.status(403).send({
        errorMsg: 'missing paramerters jobId ',
      });
    }

    const userId = req.user._id.toString();
    const jobOwner = await jobDataAccess.isJobOwner(userId, jobId);
    if (jobOwner && jobOwner._id) {
      return res.status(403).send({ errorMsg: "You can't bid on your own request." });
    } else {
      next();
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate request owner details', details: `${e}` });
  }
};
