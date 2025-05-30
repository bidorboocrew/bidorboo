// emailing services
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const moment = require('moment');
const { bugsnagClient } = require('../utils/utilities');
// // XXXXXX RELEASE THE FUNDS
// const payoutConfirmation = await stripeServiceUtil.payoutToBank('acct_1DxRCzFZom4pltNY', {
//   amount: requestDetails.processedPayment.taskerPayout,
//   metadata: { requestId: requestId.toString(), requesterId: req.user._id.toString() },
// });
//stripe.com/docs/api/payouts/create

let websiteUrl = 'http://localhost:3000';
if (process.env.NODE_ENV === 'production') {
  websiteUrl = 'https://www.bidorboo.ca';
}

exports.util = {
  retrieveConnectedAccount: (account) => {
    return stripe.accounts.retrieve(account);
  },
  retrieveSession: (sessionId) => {
    return stripe.checkout.sessions.retrieve(sessionId);
  },
  // createPaymentIntent: ({ metadata, taskName, amount, destinationAccId, taskId, requester }) => {
  //   const description = `BidOrBoo - Charge for your ${taskName} request was recieved.`;

  //   const BIDORBOO_SERVICECHARGE = 0.06;

  //   // confirm award and pay
  //   const originalCharge = amount.value;
  //   const bidOrBooServiceFee = Math.ceil(originalCharge * BIDORBOO_SERVICECHARGE);
  //   const totalAmount = (originalCharge + bidOrBooServiceFee) * 100;
  //   //stripe.com/docs/api/payment_intents/create
  //   https: return stripe.paymentIntents.create({
  //     amount: totalAmount,
  //     currency: 'cad',
  //     application_fee_amount: bidOrBooServiceFee,
  //     description: description,
  //     payment_method_types: ['card'],
  //     statement_descriptor: 'BidOrBoo Charge',
  //     receipt_email: requester.email.emailAddress,
  //     // confirm: true,
  //     metadata: metadata,
  //     // setup_future_usage: 'on_session' ,
  //     // save_payment_method: true,
  //     // customer: customID

  //     transfer_data: {
  //       destination: destinationAccId,
  //     },
  //     customer: 'cus_FdV8pImnyoVJDp',
  //     payment_method: 'pm_1F8JwgIkbQJUBZs8X03HNthR',
  //     save_payment_method: true,
  //     setup_future_usage: 'on_session',
  //     // return_url: `http://localhost:3000/my-request/review-request-details/${taskId}/?success=true`,
  //     // cancel_url: `http://localhost:3000/my-request/review-request-details/${taskId}/?success=false`,
  //   });
  // },
  // retrieveTaskChargeSessionId: ({
  //   metadata,
  //   taskName,
  //   amount,
  //   destinationAccId,
  //   taskId,
  //   requester,
  // }) => {
  //   const description = `BidOrBoo - Charge for booking ${taskName} service`;

  //   const BIDORBOO_SERVICECHARGE = 0.06;

  //   // confirm award and pay
  //   const originalCharge = amount.value;
  //   const bidOrBooServiceFee = Math.ceil(originalCharge * BIDORBOO_SERVICECHARGE);
  //   const totalAmount = (originalCharge + bidOrBooServiceFee) * 100;
  //   // const taskerPayoutAmount = chargeAmount - bidOrBooTotalCommission;

  //   return stripe.checkout.sessions.create({
  //     customer: 'cus_FdV8pImnyoVJDp',
  //     customer_email: requester.email.emailAddress,
  //     client_reference_id: 'cus_FdV8pImnyoVJDp',
  //     payment_method_types: ['card'],
  //     success_url: `${websiteUrl}/my-request/review-request-details/${taskId}/?success=true`,
  //     cancel_url: `${websiteUrl}/my-request/review-request-details/${taskId}/?success=false`,
  //     billing_address_collection: 'auto',
  //     line_items: [
  //       {
  //         name: `BidOrBoo - ${taskName}`,
  //         amount: totalAmount,
  //         currency: 'cad',
  //         quantity: 1,
  //         description: description,
  //         // images: would be nice to show images
  //       },
  //     ],
  //     payment_intent_data: {
  //       application_fee_amount: bidOrBooServiceFee,
  //       capture_method: 'automatic',
  //       description: description,
  //       metadata: metadata,
  //       statement_descriptor: 'BidOrBoo Charge',
  //       receipt_email: requester.email.emailAddress,
  //       setup_future_usage: 'off_session',
  //       transfer_data: {
  //         destination: destinationAccId,
  //       },
  //     },
  //   });
  // },

  initializeCustomer: ({ email, name }) => {
    return stripe.customers.create({
      email,
      name,
    });
  },
  // https://stripe.com/docs/api/customers/update
  updateCustomer: (customerAccId, customerAccDetails) => {
    return stripe.customers.update(customerAccId, {
      ...customerAccDetails,
    });
  },
  createChargeForSessionId: ({
    metadata,
    taskName,
    taskId,
    totalCharge,
    bidOrBooServiceFee,
    requesterId,
    requesterEmail,
    taskerAccId,
    taskerDisplayName,
    requesterCustomerId,
    taskImages,
  }) => {
    const title = `Booking - ${taskName}`;
    const description = `*After you confirm service completion, payment will be released to tasker: (${taskerDisplayName})`;

    return stripe.checkout.sessions.create({
      success_url: `${websiteUrl}/my-request/awarded-request-details/${taskId}`,
      cancel_url: `${websiteUrl}/my-request/review-request-details/${taskId}/?checkoutCancelled=true`,
      payment_method_types: ['card'],
      client_reference_id: requesterId,
      customer: requesterCustomerId,
      submit_type: 'book',
      mode: 'payment',
      line_items: [
        {
          name: title,
          description,
          amount: totalCharge,
          currency: 'cad',
          quantity: 1,
          images: taskImages ? taskImages : [],
        },
      ],
      payment_intent_data: {
        application_fee_amount: bidOrBooServiceFee,
        capture_method: 'automatic',
        description: description,
        metadata,
        statement_descriptor: 'BidOrBoo Charge',
        receipt_email: requesterEmail,
        setup_future_usage: 'on_session',
        transfer_data: {
          destination: taskerAccId,
        },
      },
    });
  },
  // const BIDORBOO_SERVICECHARGE = 0.06;

  // // confirm award and pay
  // const originalCharge = amount.value;
  // const bidOrBooServiceFee = Math.ceil(originalCharge * BIDORBOO_SERVICECHARGE);
  // const totalAmount = (originalCharge + bidOrBooServiceFee) * 100;
  // const taskerPayoutAmount = chargeAmount - bidOrBooTotalCommission;

  //   return stripe.checkout.sessions.create({
  //     success_url: `${websiteUrl}/my-request/awarded-request-details/${taskId}`,
  //     cancel_url: `${websiteUrl}/my-request/review-request-details/${taskId}/?checkoutCancelled=true`,
  //     payment_method_types: ['card'],
  //     client_reference_id: requesterId,
  //     customer: requesterCustomerId,
  //     submit_type: 'book',
  //     mode: 'payment',
  //     line_items: [
  //       {
  //         name: title,
  //         description,
  //         amount: totalCharge,
  //         currency: 'cad',
  //         quantity: 1,
  //         images: taskImages ? taskImages : [],
  //       },
  //     ],
  //     payment_intent_data: {
  //       // application_fee_amount: bidOrBooServiceFee,
  //       capture_method: 'automatic',
  //       description: description,
  //       metadata,
  //       statement_descriptor: 'BidOrBoo Charge',
  //       receipt_email: requesterEmail,
  //       setup_future_usage: 'on_session',
  //       // transfer_data: {
  //       //   destination: taskerAccId,
  //       // },
  //     },
  //   });
  // },
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
      refund_application_fee: true,
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
  retrieveACharge: async (chargeId) => {
    return stripe.charges.retrieve(chargeId);
  },
  payoutToBank: async (connectedAccId, { amount, metadata }) => {
    return stripe.payouts.create(
      {
        amount,
        metadata,
        currency: 'cad',
        statement_descriptor: 'BidOrBoo payout',
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
        bugsnagClient.notify(e);

        reject(e);
      }
    });
  },

  getAccountBalanceOnlyBalance: async (connectedAccId) => {
    return stripe.balance.retrieve(
      {},
      {
        stripe_account: connectedAccId,
      }
    );
  },

  // sendPayoutToExternalBank: async (connectedAccId, amount) => {
  //   return stripe.payouts.create(
  //     {
  //       amount,
  //       currency: 'cad',
  //     },
  //     {
  //       stripe_account: connectedAccId,
  //     }
  //   );
  // },
  // sendPayoutToExternalBank: async (payoutId, amount) => {
  //   return stripe.payouts.retrieve('payoutId');
  // },

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
  getPaymentIntents: (intentId) => {
    return stripe.paymentIntents.retrieve(intentId);
  },
  updateCustomerDetails: (paymentMethodId, customerId) => {
    return stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  },

  initializeConnectedAccount: async ({ userId, displayName, email, phone, tosAcceptance }) => {
    return new Promise(async (resolve, reject) => {
      let accountDetails = {
        country: 'CA', //HARD CODED
        type: 'custom', //HARD CODED
        default_currency: 'CAD', //HARD CODED
        requested_capabilities: ['transfers'], // ['card_payments', 'transfers'],
        business_type: 'individual',
        metadata: { email: email || '', userId, displayName, phone: phone || '' },
        tos_acceptance: { ip: tosAcceptance.ip, date: moment(tosAcceptance.date).valueOf() },
        settings: {
          payments: {
            statement_descriptor: 'BidOrBoo Payment',
          },
          payouts: {
            schedule: { interval: 'manual' },
            statement_descriptor: 'BidOrBoo Payout',
          },
        },
      };
      if (email) {
        accountDetails = { ...accountDetails, email };
      }
      try {
        const account = await stripe.accounts.create(accountDetails);
        resolve(account);
      } catch (e) {
        bugsnagClient.notify(e);

        reject(e);
      }
    });
  },
  getCustomAccountLink: async ({
    stripeConnectAccId,
    redirectUrl,
    isNewCustomer = true,
    collectMinimum = true,
  }) => {
    try {
      // XXX important update
      // https://stripe.com/docs/connect/connect-onboarding#customaccountverification
      const accountLink = await stripe.accountLinks.create({
        account: stripeConnectAccId,
        failure_url: `${redirectUrl}/?success=false`,
        success_url: `${redirectUrl}/?success=true`,
        type: 'custom_account_verification', //isNewCustomer ? 'custom_account_verification' : 'custom_account_update',
        collect: 'currently_due',
      });

      return accountLink;
    } catch (error) {
      throw error;
    }
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
