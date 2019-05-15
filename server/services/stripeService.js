// emailing services
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

exports.util = {
  partialRefundTransation: ({ chargeId, refundAmount }) => {
    // xxxxxx
    return stripe.refunds.create({
      charge: chargeId,
      amount: refundAmount,
    });
  },
  validateSignature: (reqBody, sig, endpointSecret) => {
    return stripe.webhooks.constructEvent(reqBody, sig, endpointSecret);
  },
  processDestinationCharge: async (chargeDetails) => {
    return stripe.charges.create({ ...chargeDetails });
  },
  payoutToBank: async (connectedAccId, { amount, metadata }) => {
    return stripe.payouts.create(
      {
        amount,
        metadata,
        currency: 'cad',
      },
      {
        stripe_account: connectedAccId,
      }
    );
  },
  getConnectedAccountDetails: async (connectedAccId) => {
    return stripe.accounts.retrieve(connectedAccId);
  },

  getConnectedAccountBalance: async (connectedAccId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const accountBalanceDetails = await Promise.all([
          stripe.balance.retrieve(
            {},
            {
              stripe_account: connectedAccId,
            }
          ),
          stripe.payouts.list(
            {},
            {
              stripe_account: connectedAccId,
            }
          ),
        ]);

        resolve(accountBalanceDetails);
      } catch (e) {
        reject(e);
      }
    });
  },

  deleteAllStripeAccountsInMySystem: async (iKnowWhatIamDoing) => {
    if (iKnowWhatIamDoing) {
      await stripe.accounts.list({ limit: 300 }, function(err, accounts) {
        accounts.data.forEach(async (acc) => {
          console.log('deleting ' + acc.id);
          await stripe.accounts.del(acc.id);
          console.log('deleted \n');
        });
      });
    }
  },
  initializeConnectedAccount: async ({ user_id, userId, displayName, email }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await stripe.accounts.create({
          country: 'CA', //HARD CODED
          type: 'custom', //HARD CODED
          default_currency: 'CAD', //HARD CODED
          email: email || '',
          business_type: 'individual',
          metadata: { user_id, email, userId, displayName },
          settings: {
            payments: {
              statement_descriptor: 'BidOrBoo Charge',
            },
            payouts: {
              schedule: { interval: 'manual' },
              statement_descriptor: 'BidOrBoo Payout',
            },
          },
        });
        resolve(account);
      } catch (e) {
        reject(e);
      }
    });
  },

  updateStripeConnectedAccountDetails: async (stripeConnectAccId, connectedAccountDetails) => {
    try {
      const account = await stripe.accounts.update(stripeConnectAccId, {
        ...connectedAccountDetails,
      });

      // will return something like this
      // {
      //   ...
      //   "id": "acct_12QkqYGSOD4VcegJ",  <--- you wana store this in your DB
      //   "keys": {
      //     "secret": "sk_live_AxSI9q6ieYWjGIeRbURf6EG0",
      //     "publishable": "pk_live_h9xguYGf2GcfytemKs5tHrtg"
      //   },
      //   "type": "custom"
      //   ...
      // }
      return account;
    } catch (error) {
      throw error;
    }
  },
};
