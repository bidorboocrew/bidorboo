const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const {
        proposerId,
        jobId,
        bidderId,
        qualityOfWorkRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !jobId ||
        !proposerId ||
        !bidderId ||
        !qualityOfWorkRating ||
        !punctualityRating ||
        !communicationRating ||
        !mannerRating ||
        !personalComment
      ) {
        return res.status(403).send({
          errorMsg: 'missing paramerters . can not pass requireProposerReviewPreChecksPass.',
        });
      }

      const awardedBidder = await jobDataAccess.isAwardedBidder(bidderId, jobId);
      if (awardedBidder && awardedBidder._id) {
      } else {
        return res.status(403).send({
          errorMsg:
            'the Bidder in this request does not correspond to the appoperiate bidder who fullfilled the job',
        });
      }

      const job = await jobDataAccess.getJobWithReviewModel(jobId);
      if (job && job._id) {
      } else {
        return res.status(403).send({
          errorMsg:
            'the Bidder in this request does not correspond to the appoperiate bidder who fullfilled the job',
        });
      }

      if (job._reviewRef) {
        if (job._reviewRef.proposerReview) {
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
      return res.status(403).send({ errorMsg: 'only logged in users can perform this operation.' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg: 'failed to pass requireProposerReviewPreChecksPass',
      details: `${e}`,
    });
  }
};
