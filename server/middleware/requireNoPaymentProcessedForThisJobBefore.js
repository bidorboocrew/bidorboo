const { jobDataAccess } = require('../data-access/jobDataAccess');
const stripeServiceUtil = require('../services/stripeService').util;

module.exports = async (req, res, next) => {
  try {
    //in the future redirect to login page
    const { jobId } = req.body.data;
    if (!jobId) {
      return res.status(403).send({
        errorMsg: 'missing paramerters jobId . can not confirm that you are the Job Owner.',
      });
    }

    const theJob = await jobDataAccess.getJobById(jobId);
    if (theJob && theJob._id) {
      if (theJob.latestCheckoutSession) {
        const { payment_intent } = await stripeServiceUtil.retrieveSession(
          theJob.latestCheckoutSession
        );
        const { status } = await stripeServiceUtil.getPaymentIntents(payment_intent);
        if (status && status === 'succeeded') {
          return res.status(400).send({
            errorMsg:
              'You have already paid for this service, Your payment will be proccessed and the Task will update to reflect that soon',
          });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      return res.status(403).send({ errorMsg: 'could not locate this job.' });
    }
  } catch (e) {
    return res.status(400).send({
      errorMsg: 'failed to validate if there is a payment already for this job',
      details: `${e}`,
    });
  }
};
