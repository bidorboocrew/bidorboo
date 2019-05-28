const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId && req.user._id) {
      const proposerId = req.user._id;

      const {
        jobId,
        bidderId,
        qualityOfWorkRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !proposerId ||
        !jobId ||
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
      if (!awardedBidder || !awardedBidder._id) {
        return res.status(403).send({
          errorMsg:
            'the Bidder in this request does not correspond to the appoperiate bidder who fullfilled the job',
        });
      }

      const job = await jobDataAccess.getJobWithReviewModel(jobId, proposerId);
      if (!job || !job._id) {
        return res.status(403).send({
          errorMsg: 'Couldnt find the referenced job. try again later',
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
        await jobDataAccess.kickStartReviewModel({
          jobId,
          bidderId,
          proposerId,
        });
        next();
      }
    } else {
      return res.status(403).send({ errorMsg: 'You must be logged in to perform this action.' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg: 'failed to pass requireProposerReviewPreChecksPass',
      details: `${e}`,
    });
  }
};
