const BIDORBOO_SERVICECHARGE_FOR_REQUESTER = 0.06;
const BIDORBOO_SERVICECHARGE_FOR_TASKER = 0.06;

// https://stripe.com/en-ca/connect/pricing
const BIDORBOO_SERVICECHARGE_TOTAL = 0.12;

const STRIPE_PERCENT_CUT_ON_EACH_CHECKOUT = 0.029;
const STRIPE_STATIC_CUT_ON_EACH_CHECKOUT = 0.3; //cent

const STRIPE_PERCENT_CUT_ON_EACH_PAYOUT = 0.025;
const STRIPE_STATIC_CUT_ON_EACH_PAYOUT = 0.25; //cent

exports.getChargeDistributionDetails = (totalBidAmountInDollars) => {
  const bidOrBooChargeOnRequester = BIDORBOO_SERVICECHARGE_FOR_REQUESTER * totalBidAmountInDollars;
  const requesterTotalPayment = Math.ceil(bidOrBooChargeOnRequester + totalBidAmountInDollars);

  const bidOrBooPlatformFee = Math.ceil(requesterTotalPayment * BIDORBOO_SERVICECHARGE_TOTAL);

  // amount stripe will take on every checkout
  const stripeCheckoutProcessingFee = (
    requesterTotalPayment * STRIPE_PERCENT_CUT_ON_EACH_CHECKOUT +
    STRIPE_STATIC_CUT_ON_EACH_CHECKOUT
  ).toFixed(2);

  const leftOverMoney = (
    requesterTotalPayment -
    bidOrBooPlatformFee -
    stripeCheckoutProcessingFee
  ).toFixed(2);

  // amount stripe will take on every payout
  const stripePayoutToTaskerProcessingFee = (
    leftOverMoney * STRIPE_PERCENT_CUT_ON_EACH_PAYOUT +
    STRIPE_STATIC_CUT_ON_EACH_PAYOUT
  ).toFixed(2);

  const taskerTotalPayoutAmount = (leftOverMoney - stripePayoutToTaskerProcessingFee).toFixed(2);

  return {
    requesterTotalPayment: requesterTotalPayment * 100,
    bidOrBooPlatformFee: bidOrBooPlatformFee * 100,
    taskerTotalPayoutAmount: taskerTotalPayoutAmount * 100,
    stripeCheckoutProcessingFee: stripeCheckoutProcessingFee * 100,
    stripePayoutToTaskerProcessingFee: stripePayoutToTaskerProcessingFee * 100,
  };
};
