const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const {
        proposerId,
        jobId,
        bidderId,
        accuracyOfPostRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !jobId ||
        !proposerId ||
        !bidderId ||
        !accuracyOfPostRating ||
        !punctualityRating ||
        !communicationRating ||
        !mannerRating ||
        !personalComment
      ) {
        return res.status(403).send({
          errorMsg: 'missing paramerters . can not pass requireBidderReviewPreChecksPass.',
        });
      }

      const job = await jobDataAccess.getJobWithReviewModel(jobId);

      if (job && job._id && job._ownerRef._id.toString() === proposerId) {
        if (job._reviewRef) {
          if (job._reviewRef.bidderReview) {
            return res
              .status(403)
              .send({ errorMsg: 'You have already submit a review on this job.' });
          } else {
            next();
          }
        } else {
          const kickstartedTheReview = await jobDataAccess.kickStartReviewModel({
            jobId,
            bidderId,
            proposerId,
          });
          next();
        }
      } else {
        return res.status(403).send({
          errorMsg:
            'failed requireBidderReviewPreChecksPass cant find the job or the job owner does not correspond to the specified user in this request',
        });
      }
    } else {
      return res.status(403).send({ errorMsg: 'only logged in users can perform this operation.' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg: 'failed to pass requireBidderReviewPreChecksPass',
      details: `${e}`,
    });
  }
};
