const { jobDataAccess } = require('../data-access/jobDataAccess');
const { bidDataAccess } = require('../data-access/bidDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const taskerId = req.user._id;
      const {
        jobId,
        accuracyOfPostRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !jobId ||
        !accuracyOfPostRating ||
        !punctualityRating ||
        !communicationRating ||
        !mannerRating ||
        !personalComment
      ) {
        return res.status(403).send({
          errorMsg: 'missing paramerters . can not pass requireTaskerReviewPreChecksPass.',
        });
      }
      const { bidId } = res.locals.bidOrBoo;
      if (!bidId) {
        return res.status(403).send({
          errorMsg: 'could not locate your bid. try again later',
        });
      }
      const bid = await bidDataAccess.getAwardedBidDetails(taskerId, bidId);
      if (!bid || !bid._id || !bid._jobRef) {
        return res.status(403).send({ errorMsg: 'Could not find the specified bid.' });
      }

      const job = await jobDataAccess.getJobWithReviewModel(jobId, bid._jobRef._ownerRef._id);

      if (job && job._id) {
        res.locals.bidOrBoo = res.locals.bidOrBoo || {};
        res.locals.bidOrBoo.proposerId = bid._jobRef._ownerRef._id;
        res.locals.bidOrBoo.taskerId = bid._taskerRef;

        if (job._reviewRef) {
          if (job._reviewRef.taskerReview) {
            return res
              .status(403)
              .send({ errorMsg: 'You have already submit a review on this job.' });
          } else {
            next();
          }
        } else {
          await jobDataAccess.kickStartReviewModel({
            jobId: job._id,
            taskerId: res.locals.bidOrBoo.taskerId,
            proposerId: res.locals.bidOrBoo.proposerId,
          });
          next();
        }
      } else {
        return res.status(403).send({
          errorMsg:
            'failed requireTaskerReviewPreChecksPass cant find the job or the job owner does not correspond to the specified user in this request',
        });
      }
    } else {
      return res.status(403).send({ errorMsg: 'only logged in users can perform this operation.' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg: 'failed to pass requireTaskerReviewPreChecksPass',
      details: `${e}`,
    });
  }
};
