// //handle all user data manipulations
// const mongoose = require('mongoose');

// const PaymentModel = mongoose.model('PaymentModel');


// exports.paymentDataAccess = {
//   logPaymentInfo: ({
//     mongoUser_id,
//     requestId,
//     awardedTaskerId,
//     amount,
//     stripeConfirmationId,
//     currency,
//   }) => {
//     return new Promise(async (resolve, reject) => {
//       const BIDORBOO_COMMISSION_RATE = 0.12;
//       const STRIPE_TRANSACTION_RATE = 0.029;
//       const STRIPE_TRAS_PROCESS_FEE = 0.3;

//       const bidOrBooCommission = amount * BIDORBOO_COMMISSION_RATE;
//       const stripeCommission = amount * STRIPE_TRANSACTION_RATE + STRIPE_TRAS_PROCESS_FEE;
//       try {
//         const paymentModel = await new PaymentModel({
//           _requestRef: requestId,
//           _from: mongoUser_id,
//           _to: awardedTaskerId,
//           stripeConfirmationId: stripeConfirmationId,
//           paymentDetails: {
//             requesterPayment: amount,
//             bidOrBooCommission: bidOrBooCommission,
//             stripeCommission: stripeCommission,
//             taskerEarns: amount - bidOrBooCommission - stripeCommission,
//             currency,
//           },
//         }).save();

//         resolve({ success: true });
//       } catch (e) {
//         reject(e);
//       }
//     });
//   },
//   // get requests for a user and filter by a given state
//   getAllPaymentsDetails: async () => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const payments = await PaymentModel.find({}, null, {
//           sort: { createdAt: -1 },
//         })
//           .populate({
//             path: '_requestRef',
//           })
//           .populate({
//             path: '_from',
//           })
//           .populate({
//             path: '_to',
//           })
//           .lean(true)
//           .exec();

//         resolve(payments);
//       } catch (e) {
//         reject(e);
//       }
//     });
//   },
// };
