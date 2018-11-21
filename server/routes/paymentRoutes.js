const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requirePaymentChecks = require('../middleware/requirePaymentChecks');

const { paymentDataAccess } = require('../data-access/paymentDataAccess');

const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

module.exports = (app) => {
  app.post(
    ROUTES.API.PAYMENT.POST.payment,
    requireBidorBooHost,
    requireLogin,
    requirePaymentChecks,
    async (req, res) => {
      try {
        const { stripeTransactionToken, jobId, bidderId, chargeAmount } = req.body.data;

        const userMongoDBId = req.user._id;

        const charge = await stripe.charges.create({
          amount: chargeAmount,
          currency: 'CAD',
          description: 'BidOrBoo - Service Charge',
          source: stripeTransactionToken,
        });

        const { amount, id, currency, status } = charge;
        paymentDataAccess.logPaymentInfo({
          userMongoDBId,
          jobId,
          awardedBidderId: bidderId,
          amount,
          stripeConfirmationId: id,
          currency: currency,
        });
        if (status === 'succeeded') {
          res.send({ success: true });
        }
      } catch (e) {
        return res.status(500).send({ errorMsg: 'Failed To create charge', details: e });
      }
    }
  );

  app.get(ROUTES.API.PAYMENT.GET.payment, requireBidorBooHost, requireLogin, async (req, res) => {
    try {
      const paymentsDetails = await paymentDataAccess.getAllPaymentsDetails();

      res.send({ paymentsDetails: paymentsDetails });
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To create charge', details: e });
    }
  });
};
