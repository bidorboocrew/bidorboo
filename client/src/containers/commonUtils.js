export const getUserExistingBid = (job, currentUserId) => {
  if (!job._bidsListRef || !job._bidsListRef.length > 0) {
    return false;
  }

  let userExistingBid = null;
  let userAlreadyBid = job._bidsListRef.some((bid) => {
    userExistingBid = bid;
    return bid._bidderRef === currentUserId;
  });
  return { userAlreadyBid, userExistingBid };
};

export const didUserAlreadyView = (job, currentUserId) => {
  if (!job.viewedBy || !job.viewedBy.length > 0) {
    return false;
  }

  let didUserAlreadyView = job.viewedBy.some((usrId) => {
    return usrId === currentUserId;
  });
  return didUserAlreadyView;
};

export const findAvgBidInBidList = (bidsList) => {
  let hasBids = bidsList && bidsList.length > 0;

  if (hasBids) {
    const bidsTotal = bidsList
      .map((bid) => bid.bidAmount.value)
      .reduce((accumulator, bidAmount) => accumulator + bidAmount);
    return Math.ceil(bidsTotal / bidsList.length);
  }
  return null;
};

const BIDORBOO_SERVICECHARGE_FOR_REQUESTER = 0.06;
const BIDORBOO_SERVICECHARGE_FOR_TASKER = 0.06;

// https://stripe.com/en-ca/connect/pricing
const BIDORBOO_SERVICECHARGE_TOTAL = 0.12;

const STRIPE_PERCENT_CUT_ON_EACH_CHECKOUT = 0.029;
const STRIPE_STATIC_CUT_ON_EACH_CHECKOUT = 0.3; //cent

const STRIPE_PERCENT_CUT_ON_EACH_PAYOUT = 0.025;
const STRIPE_STATIC_CUT_ON_EACH_PAYOUT = 0.25; //cent
const BIDORBOO_REFUND_AMOUNT = 0.8;

export const getChargeDistributionDetails = (totalBidAmountInDollars) => {
  const bidOrBooChargeOnRequester = BIDORBOO_SERVICECHARGE_FOR_REQUESTER * totalBidAmountInDollars;
  const requesterTotalPayment = Math.ceil(bidOrBooChargeOnRequester + totalBidAmountInDollars);

  const bidOrBooPlatformFee = Math.ceil(requesterTotalPayment * BIDORBOO_SERVICECHARGE_TOTAL);

  // amount stripe will take on every checkout
  // const stripeCheckoutProcessingFee =
  //   requesterTotalPayment * STRIPE_PERCENT_CUT_ON_EACH_CHECKOUT +
  //   STRIPE_STATIC_CUT_ON_EACH_CHECKOUT;

  const leftOverMoney = requesterTotalPayment - bidOrBooPlatformFee;

  // amount stripe will take on every payout
  const stripePayoutToTaskerProcessingFee = (
    leftOverMoney * STRIPE_PERCENT_CUT_ON_EACH_PAYOUT +
    STRIPE_STATIC_CUT_ON_EACH_PAYOUT
  ).toFixed(2);

  const taskerTotalPayoutAmount = leftOverMoney - stripePayoutToTaskerProcessingFee;

  const requesterPartialRefundAmount = BIDORBOO_REFUND_AMOUNT * requesterTotalPayment;
  const amountRefundedFromApplicationFee = BIDORBOO_REFUND_AMOUNT * bidOrBooPlatformFee;
  const actualKeptBidOrBooApplicationFees = bidOrBooPlatformFee - amountRefundedFromApplicationFee;

  const taskerPayoutInCaseOfPartialRefund =
    requesterTotalPayment - requesterPartialRefundAmount - actualKeptBidOrBooApplicationFees;
  return {
    requesterTotalPayment: Math.ceil(requesterTotalPayment),
    // bidOrBooPlatformFee: bidOrBooPlatformFee,
    taskerTotalPayoutAmount: Math.floor(taskerTotalPayoutAmount),
    // stripeCheckoutProcessingFee: stripeCheckoutProcessingFee,
    // stripePayoutToTaskerProcessingFee: stripePayoutToTaskerProcessingFee,
    taskerPayoutInCaseOfPartialRefund: Math.floor(taskerPayoutInCaseOfPartialRefund),
    requesterPartialRefundAmount: Math.floor(requesterPartialRefundAmount),
  };
};
