const BIDORBOO_SERVICECHARGE_FOR_REQUESTER = 0.06;
const BIDORBOO_SERVICECHARGE_FOR_TASKER = 0.02;

// https://stripe.com/en-ca/connect/pricing
const BIDORBOO_SERVICECHARGE_TOTAL =
  BIDORBOO_SERVICECHARGE_FOR_REQUESTER + BIDORBOO_SERVICECHARGE_FOR_TASKER;

const STRIPE_PERCENT_CUT_ON_EACH_CHECKOUT = 0.029;
const STRIPE_STATIC_CUT_ON_EACH_CHECKOUT = 0.3; //cent

const STRIPE_PERCENT_CUT_ON_EACH_PAYOUT = 0.025;
const STRIPE_STATIC_CUT_ON_EACH_PAYOUT = 0.25; //cent

const BIDORBOO_REQUESTER_REFUND_PERCENTAGE_IN_CASE_OF_CANCELLATION = 0.8;

const BIDORBOO_TASKER_PAYOUT_PERCENTAGE_IN_CASE_OF_CANCELLATION = 0.2;

exports.getChargeDistributionDetails = (totalBidAmountInDollars) => {
  let theActualBidAmount = totalBidAmountInDollars;
  if (typeof totalBidAmountInDollars === 'string') {
    theActualBidAmount = parseInt(totalBidAmountInDollars);
  }
  const bidOrBooChargeOnRequester = BIDORBOO_SERVICECHARGE_FOR_REQUESTER * theActualBidAmount;

  const requesterPaymentAmount = Math.ceil(bidOrBooChargeOnRequester + theActualBidAmount);

  const bidOrBooPlatformFee = requesterPaymentAmount * BIDORBOO_SERVICECHARGE_TOTAL;

  const leftOverMoney = requesterPaymentAmount - bidOrBooPlatformFee;

  // amount stripe will take on every checkout
  // const stripeCheckoutProcessingFee =
  //   requesterPaymentAmount * STRIPE_PERCENT_CUT_ON_EACH_CHECKOUT +
  //   STRIPE_STATIC_CUT_ON_EACH_CHECKOUT;

  // amount stripe will take on every payout
  const stripePayoutToTaskerProcessingFee =
    leftOverMoney * STRIPE_PERCENT_CUT_ON_EACH_PAYOUT + STRIPE_STATIC_CUT_ON_EACH_PAYOUT;

  const bidderPayoutAmount = leftOverMoney - stripePayoutToTaskerProcessingFee;

  const requesterPartialRefundAmount =
    BIDORBOO_REQUESTER_REFUND_PERCENTAGE_IN_CASE_OF_CANCELLATION * requesterPaymentAmount;
  // const amountRefundedFromApplicationFee = BIDORBOO_REFUND_AMOUNT * bidOrBooPlatformFee;
  // const actualKeptBidOrBooApplicationFees = bidOrBooPlatformFee - amountRefundedFromApplicationFee;

  const taskerPartialPayoutAmount =
    bidderPayoutAmount * BIDORBOO_TASKER_PAYOUT_PERCENTAGE_IN_CASE_OF_CANCELLATION;
  // requesterPaymentAmount - requesterPartialRefundAmount - actualKeptBidOrBooApplicationFees;

  return {
    requesterPaymentAmount: parseFloat(requesterPaymentAmount.toFixed(2)),
    bidderPayoutAmount: parseFloat(bidderPayoutAmount.toFixed(2)),
    requesterPartialRefundAmount: parseFloat(requesterPartialRefundAmount.toFixed(2)),
    taskerPartialPayoutAmount: parseFloat(taskerPartialPayoutAmount.toFixed(2)),
    bidOrBooPlatformFee: bidOrBooPlatformFee,
    // stripeCheckoutProcessingFee: stripeCheckoutProcessingFee,
    // stripePayoutToTaskerProcessingFee: stripePayoutToTaskerProcessingFee,
  };
};
