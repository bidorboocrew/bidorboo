const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { jobId } = req.body.data;
    if (!jobId) {
      return res.status(403).send({ errorMsg: 'missing paramerters . can not validate the job.' });
    }

    const job = await jobDataAccess.getJobById(jobId);
    if (!job || !job._id) {
      return res.status(403).send({ errorMsg: 'We could not locate the job.' });
    }

    if (!job._awardedBidRef) {
      next();
    } else {
      return res.status(403).send({ errorMsg: 'Sorry , The Requester had already awarded another tasker.' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate requireJobIsNotAwarded ', details: `${e}` });
  }
};
