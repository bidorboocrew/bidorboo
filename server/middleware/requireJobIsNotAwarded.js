const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { jobIdToUpdate } = req.body.data;
    if (!jobIdToUpdate) {
      return res.status(403).send({ errorMsg: 'missing paramerters . can not validate the job.' });
    }

    const job = await jobDataAccess.getJobById(jobIdToUpdate);
    if (!job || !job._id) {
      return res.status(403).send({ errorMsg: 'We could not locate the job.' });
    }

    if (!job._awardedBidRef) {
      next();
    } else {
      return res.status(403).send({ errorMsg: 'This job has already been awarded.' });
    }
  } catch (e) {
    return res
      .status(500)
      .send({ errorMsg: 'failed to validate requireJobIsNotAwarded ', details: e });
  }
};
