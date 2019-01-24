const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      //in the future redirect to login page
      const { jobId } = req.body.data;
      if (!jobId) {
        return res
          .status(403)
          .send({
            errorMsg: 'missing paramerters jobId . can not confirm that you are the Job Owner.',
          });
      }

      const userId = req.user._id.toString();
      const jobOwner = await jobDataAccess.isJobOwner(userId, jobId);
      if (jobOwner && jobOwner._id) {
        next();
      } else {
        return res.status(403).send({ errorMsg: 'only the Job Owner can perform this operation.' });
      }
    } else {
      return res.status(403).send({ errorMsg: 'only the Job Owner can perform this operation.' });
    }
  } catch (e) {
    return res.status(500).send({ errorMsg: 'failed to validate is jobOwner', details: `${e}` });
  }
};
