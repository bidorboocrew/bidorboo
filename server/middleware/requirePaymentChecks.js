const { jobDataAccess } = require('../data-access/jobDataAccess');
/**
 * bunch of confirmation checks to ensure that we do not charge until all details match up
 */
module.exports = async (req, res, next) => {
  try {
    const { stripeTransactionToken, jobId, bidderId, chargeAmount } = req.body.data;

    const mongoDbUserId = req.user._id;

    if (!stripeTransactionToken) {
      return res
        .status(403)
        .send({ errorMsg: 'We did NOT process the payment. no payment token recieved' });
    }
    const finishedJob = await jobDataAccess.getAwardedJobDetails(jobId);

    const ownerRefId = finishedJob._ownerRef.toString();
    if (mongoDbUserId.toString() !== ownerRefId) {
      return res.status(403).send({
        errorMsg: 'We did NOT process the payment. You are NOT authorized to pay for this job',
      });
    }
    const {_awardedBidRef} = finishedJob;
    if (!_awardedBidRef || !_awardedBidRef._bidderRef || !_awardedBidRef._bidderRef._id) {
      return res
        .status(403)
        .send({ errorMsg: 'We did NOT process the payment. no awarded bidder found!' });
    }
    if (_awardedBidRef._bidderRef._id.toString() !== bidderId) {
      return res.status(403).send({
        errorMsg:
          'We did NOT process the payment. The bidder Id does not match the winning BidderId!',
      });
    }

    if (!_awardedBidRef || !_awardedBidRef.bidAmount) {
      return res.status(403).send({
        errorMsg:
          'We did NOT process the payment. no bid amount found!',
      });
    }
    const { bidAmount } = _awardedBidRef;

    if (!chargeAmount || !bidAmount.value) {
      return res
        .status(403)
        .send({ errorMsg: 'We did NOT process the payment. no charge or bid value found' });
    }

    if (bidAmount.value !== chargeAmount) {
      return res
        .status(403)
        .send({ errorMsg: 'We did NOT process the payment. bid value does not match charge amount' });
    }
    next();
  } catch (e) {
    return res.status(500).send({
      errorMsg: 'We did NOT process the payment. failed to meet requirements to process payment',
      details: e,
    });
  }
};
