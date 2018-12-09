const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const requireBidorBooHost = require('../middleware/requireBidorBooHost');
const requirePaymentChecks = require('../middleware/requirePaymentChecks');
const userDataAccess = require('../data-access/userDataAccess');

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
        const { stripeTransactionToken, bidderId, chargeAmount } = req.body.data;
        const BIDORBOO_COMMISSION_RATE = 0.12;

        const bidOrBooCommission = 10000 * BIDORBOO_COMMISSION_RATE;

        const userMongoDBId = req.user._id;

        const stripeAccDetails = await userDataAccess.getUserStripeAccount(bidderId);
        if (stripeAccDetails.accId) {
          const charge = await stripe.charges.create({
            amount: 10000,
            currency: 'CAD',
            description: 'BidOrBoo - Service Charge',
            source: stripeTransactionToken,
            destination: {
              amount: chargeAmount - bidOrBooCommission, // the final # sent to awarded bidder
              account: stripeAccDetails.accId,
            },
          });
          if (charge) {
            res.send({ success: true });
          }
        } else {
          return res.status(400).send({
            errorMsg: 'Bad Request. missing payment details ',
          });
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

  app.post(ROUTES.API.PAYMENT.POST.myaccountWebhook, async (req, res) => {
    try {
      return res.status(200).send();
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To create charge', details: e });
    }
  });
  app.post(ROUTES.API.PAYMENT.POST.connectedAccountsWebhook, async (req, res) => {
    try {
      return res.status(200).send();
    } catch (e) {
      return res.status(500).send({ errorMsg: 'Failed To create charge', details: e });
    }
  });
};
