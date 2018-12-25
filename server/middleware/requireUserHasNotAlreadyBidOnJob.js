const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId || !req.user._id) {
      return res.status(401).send({ errorMsg: 'you must be logged in to perform this action.' });
    }
    //in the future redirect to login page
    const { jobIdToUpdate } = req.body.data;
    if (!jobIdToUpdate) {
      return res.status(403).send({ errorMsg: 'missing paramerters . can not validate the job.' });
    }

    const job = await jobDataAccess.getJobById(jobIdToUpdate);
    if (!job || !job._id) {
      return res.status(403).send({ errorMsg: 'We could not locate the job.' });
    }

    if (!job._bidsListRef || !job._bidsListRef.length > 0) {
      next();
    } else {
      let hasUserAlreadyBid = job._bidsListRef.some((bid) => {
        return bid._bidderRef.toString() === req.user._id.toString();
      });
      if (hasUserAlreadyBid) {
        return res.status(403).send({ errorMsg: 'You Already Bid on this job.' });
      } else {
        next();
      }
    }
  } catch (e) {
    return res
      .status(500)
      .send({ errorMsg: 'failed to validate requireUserHasNotAlreadyBidOnJob ', details: e });
  }
};
