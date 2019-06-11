export const REQUEST_STATES = {
  OPEN: 'OPEN',
  AWARDED: 'AWARDED',
  DISPUTED: 'DISPUTED',
  AWARDED_CANCELED_BY_BIDDER: 'AWARDED_CANCELED_BY_BIDDER',
  AWARDED_CANCELED_BY_REQUESTER: 'AWARDED_CANCELED_BY_REQUESTER',
  CANCELED_OPEN: 'CANCELED_OPEN',
  DONE: 'DONE',
  PAIDOUT: 'PAIDOUT',
};

export const BID_STATES = {
  OPEN: 'OPEN',
  CANCELED_AWARDED_BY_TASKER: 'CANCELED_AWARDED_BY_TASKER',
  CANCELED_AWARDED_BY_REQUESTER: 'CANCELED_AWARDED_BY_REQUESTER',
  WON: 'WON',
  WON_SEEN: 'WON_SEEN',
  DONE: 'DONE',
  PAID_OUT: 'PAID_OUT',
};

export const POINT_OF_VIEW = {
  REQUESTER: 'REQUESTER',
  TASKER: 'TASKER',
};
export { TASKS_DEFINITIONS } from './house-cleaning/tasksDefinitions';
export { default as HouseCleaningConcept } from './house-cleaning/HouseCleaningConcept';
export { default as HouseCleaningCreateJob } from './house-cleaning/HouseCleaningCreateJob';

export {
  default as RequesterRequestDetails,
} from './house-cleaning/RequesterRequestDetails';

export {
  default as RequesterRequestSummary,
} from './house-cleaning/RequesterRequestSummary';

export {
  default as RequesterAwardedDetails,
} from './house-cleaning/RequesterAwardedDetails';

export {
  default as RequesterAwardedSummary,
} from './house-cleaning/RequesterAwardedSummary';

export {
  default as RequesterCanceledByRequesterSummary,
} from './house-cleaning/RequesterCanceledByRequesterSummary';

export {
  default as RequesterCanceledByRequesterDetails,
} from './house-cleaning/RequesterCanceledByRequesterDetails';

export {
  default as RequesterOpenCanceledSummary,
} from './house-cleaning/RequesterOpenCanceledSummary';
export {
  default as RequesterOpenCanceledDetails,
} from './house-cleaning/RequesterOpenCanceledDetails';

export {
  default as TaskerBidOnTaskSummary,
} from './house-cleaning/TaskerBidOnTaskSummary';

export {
  default as TaskerBidOnTaskDetails,
} from './house-cleaning/TaskerBidOnTaskDetails';

export {
  default as TaskerMyOpenBidSummary,
} from './house-cleaning/TaskerMyOpenBidSummary';

export {
  default as TaskerMyOpenBidDetails,
} from './house-cleaning/TaskerMyOpenBidDetails';

export {
  default as TaskerMyAwardedBidDetails,
} from './house-cleaning/TaskerMyAwardedBidDetails';

export {
  default as TaskerMyAwardedBidSummary,
} from './house-cleaning/TaskerMyAwardedBidSummary';

export {
  default as TaskerAwardedBidCanceledByTaskerDetails,
} from './house-cleaning/TaskerAwardedBidCanceledByTaskerDetails';

export {
  default as TaskerAwardedBidCanceledByTaskerSummary,
} from './house-cleaning/TaskerAwardedBidCanceledByTaskerSummary';

export {
  default as RequesterDoneSummary,
} from './house-cleaning/RequesterDoneSummary';

export {
  default as RequesterDoneDetails,
} from './house-cleaning/RequesterDoneDetails';

export {
  default as TaskerMyAwardedDoneBidDetails,
} from './house-cleaning/TaskerMyAwardedDoneBidDetails';

export {
  default as TaskerMyAwardedDoneBidSummary,
} from './house-cleaning/TaskerMyAwardedDoneBidSummary';

export {
  default as RequesterDisputedSummary,
} from './house-cleaning/RequesterDisputedSummary';

export {
  default as RequesterDisputedDetails,
} from './house-cleaning/RequesterDisputedDetails';

export {
  default as TaskerMyDisputedBidDetails,
} from './house-cleaning/TaskerMyDisputedBidDetails';

export {
  default as TaskerMyDisputedBidSummary,
} from './house-cleaning/TaskerMyDisputedBidSummary';
