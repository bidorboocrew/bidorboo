const { jobDataAccess } = require('../data-access/jobDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId && req.user._id) {
      const proposerId = req.user._id;

      const {
        jobId,
        qualityOfWorkRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !proposerId ||
        !jobId ||
        !qualityOfWorkRating ||
        !punctualityRating ||
        !communicationRating ||
        !mannerRating ||
        !personalComment
      ) {
        return res.status(403).send({
          errorMsg: 'missing parameters . can not pass requireProposerReviewPreChecksPass.',
        });
      }

      const jobDetails = await jobDataAccess.getFullJobDetails(jobId);

      const awardedTasker = jobDetails._awardedBidRef && jobDetails._awardedBidRef._taskerRef._id;
      if (!awardedTasker) {
        return res.status(403).send({
          errorMsg: 'Only the Tasker who fulfilled the job can perform this action',
        });
      }
      if (!jobDetails._reviewRef) {
        await jobDataAccess.kickStartReviewModel({
          jobId,
          taskerId: awardedTasker,
          proposerId,
        });
      }

      if (jobDetails._reviewRef && !jobDetails._reviewRef.requiresProposerReview) {
        return res.status(403).send({
          errorMsg: 'You have already submit a review on this job.',
        });
      }

      res.locals.bidOrBoo = res.locals.bidOrBoo || {};
      res.locals.bidOrBoo = {
        jobId,
        qualityOfWorkRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
        awardedTasker,
        proposerId,
      };
      next();
    } else {
      return res.status(403).send({ errorMsg: 'You must be logged in to perform this action.' });
    }
  } catch (e) {
    return res.status(400).send({
      safeMsg:
        'some error occurred, please chat with our customer support using the chat button at the bottom of the page',
      errorMsg: 'failed to pass requireProposerReviewPreChecksPass',
      details: `${e}`,
    });
  }
};
