const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user) {
      //in the future redirect to login page
      const { jobIdToUpdate } = req.body.data;
      const userId = req.user._id;
      const isUserPermitted = await jobDataAccess.isJobOwner(
        userId,
        jobIdToUpdate
      );
      if (isUserPermitted && isUserPermitted._id) {
        next();
      } else {
        return res
          .status(403)
          .send({ errorMsg:'only the Job Owner can perform this operation.' });
      }
    } else {
      return res
        .status(403)
        .send({ errorMsg: 'only the Job Owner can perform this operation.' });
    }
  } catch (e) {
    return res
      .status(500)
      .send({ errorMsg: 'failed to validate is jobOwner', details: e });
  }
};
