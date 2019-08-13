// emailing services
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

// // XXXXXX RELEASE THE FUNDS
// const payoutConfirmation = await stripeServiceUtil.payoutToBank('acct_1DxRCzFZom4pltNY', {
//   amount: jobDetails.processedPayment.bidderPayout,
//   metadata: { jobId: jobId.toString(), proposerId: req.user._id.toString() },
// });
//stripe.com/docs/api/payouts/create
https: exports.util = {
  retrieveConnectedAccount: (account) => {
    return stripe.accounts.retrieve(account);
  },
  retrieveTaskChargeSessionId: ({
    metadata,
    taskName,
    amount,
    destinationAccId,
    taskId,
    requester,
  }) => {
    const description = `BidOrBoo - Charge for your ${taskName} request was recieved.`;

    const BIDORBOO_SERVICECHARGE = 0.06;

    // confirm award and pay
    const originalCharge = amount.value;
    const bidOrBooServiceFee = Math.ceil(originalCharge * BIDORBOO_SERVICECHARGE);
    const totalAmount = (originalCharge + bidOrBooServiceFee) * 100;
    // const bidderPayoutAmount = chargeAmount - bidOrBooTotalCommission;

    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          name: `BidOrBoo - ${taskName}`,
          amount: totalAmount,
          currency: 'cad',
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: bidOrBooServiceFee,
        description: description,
        statement_descriptor: 'BidOrBoo Charge',
        receipt_email: requester.email.emailAddress,
        metadata: metadata,
        transfer_data: {
          destination: destinationAccId,
        },
      },
      submit_type: 'book',
      client_reference_id: requester._id.toString(),
      billing_address_collection: 'required',
      success_url: `http://localhost:3000/my-request/review-request-details/${taskId}/?success=true`,
      cancel_url: `http://localhost:3000/my-request/review-request-details/${taskId}/?success=false`,
    });
  },
  partialRefundTransation: ({ chargeId, refundAmount, metadata }) => {
    // xxxxxx
    return stripe.refunds.create({
      charge: chargeId,
      amount: refundAmount,
      metadata: {
        ...metadata,
        description: 'BidOrBoo refund due to cancelled agreement by Requester',
      },
      reason: 'requested_by_customer',
      reverse_transfer: true,
      // refund_application_fee: true,
    });
  },
  fullRefundTransaction: ({ chargeId, metadata }) => {
    // xxxxxx
    return stripe.refunds.create({
      charge: chargeId,
      metadata: {
        ...metadata,
        description: 'BidOrBoo refund due to cancelled agreement by Tasker',
      },
      reason: 'requested_by_customer',
      reverse_transfer: true,
      refund_application_fee: true,
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

  sendPayoutToExternalBank: async (connectedAccId, amount) => {
    return stripe.payouts.create(
      {
        amount,
        currency: 'cad',
      },
      {
        stripe_account: connectedAccId,
      }
    );
  },
  sendPayoutToExternalBank: async (payoutId, amount) => {
    return stripe.payouts.retrieve('payoutId');
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
  initializeConnectedAccount: async ({ userId, displayName, email }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await stripe.accounts.create({
          country: 'CA', //HARD CODED
          type: 'custom', //HARD CODED
          default_currency: 'CAD', //HARD CODED
          email: email || '',
          business_type: 'individual',
          metadata: { email, userId, displayName },
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
      // xxxxx important update
      const account = await stripe.accounts.update(
        stripeConnectAccId,
        {
          ...connectedAccountDetails,
        },
        {
          stripe_account: stripeConnectAccId,
        }
      );

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
