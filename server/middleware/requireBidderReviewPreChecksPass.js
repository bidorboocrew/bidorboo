const { jobDataAccess } = require('../data-access/jobDataAccess');
const { bidDataAccess } = require('../data-access/bidDataAccess');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      const bidderId = req.user._id;
      const {
        proposerId,
        bidId,
        accuracyOfPostRating,
        punctualityRating,
        communicationRating,
        mannerRating,
        personalComment,
      } = req.body.data;

      if (
        !proposerId ||
        !bidderId ||
        !bidId ||
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

      const bid = await bidDataAccess.getAwardedBidDetails(bidderId, bidId);
      if (!bid || !bid._id || !bid._jobRef) {
        return res.status(403).send({ errorMsg: 'Could not find the specified bid.' });
      }

      const jobId = bid._jobRef;

      const job = await jobDataAccess.getJobWithReviewModel(jobId._id, proposerId);

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
          await jobDataAccess.kickStartReviewModel({
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
