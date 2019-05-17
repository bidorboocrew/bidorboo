//handle all user data manipulations
const mongoose = require('mongoose');

const PaymentModel = mongoose.model('PaymentModel');


exports.paymentDataAccess = {
  logPaymentInfo: ({
    userMongoDBId,
    jobId,
    awardedBidderId,
    amount,
    stripeConfirmationId,
    currency,
  }) => {
    return new Promise(async (resolve, reject) => {
      const BIDORBOO_COMMISSION_RATE = 0.12;
      const STRIPE_TRANSACTION_RATE = 0.029;
      const STRIPE_TRAS_PROCESS_FEE = 0.3;

      const bidOrBooCommission = amount * BIDORBOO_COMMISSION_RATE;
      const stripeCommission = amount * STRIPE_TRANSACTION_RATE + STRIPE_TRAS_PROCESS_FEE;
      try {
        const paymentModel = await new PaymentModel({
          _jobRef: jobId,
          _from: userMongoDBId,
          _to: awardedBidderId,
          stripeConfirmationId: stripeConfirmationId,
          paymentDetails: {
            proposerPayment: amount,
            bidOrBooCommission: bidOrBooCommission,
            stripeCommission: stripeCommission,
            bidderEarns: amount - bidOrBooCommission - stripeCommission,
            currency,
          },
        }).save();

        resolve({ success: true });
      } catch (e) {
        reject(e);
      }
    });
  },
  // get jobs for a user and filter by a given state
  getAllPaymentsDetails: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const payments = await PaymentModel.find({}, null, {
          sort: { createdAt: -1 },
        })
          .populate({
            path: '_jobRef',
          })
          .populate({
            path: '_from',
          })
          .populate({
            path: '_to',
          })
          .lean(true)
          .exec();

        resolve(payments);
      } catch (e) {
        reject(e);
      }
    });
  },
};
