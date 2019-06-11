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

export { default as TASKS_DEFINITIONS } from './tasksDefinitions';
export { default as HouseCleaningConcept } from './house-cleaning/HouseCleaningConcept';
export { default as HouseCleaningCreateJob } from './house-cleaning/HouseCleaningCreateJob';

export { default as RequesterRequestDetails } from './genericTasks/RequesterRequestDetails';

export { default as RequesterRequestSummary } from './genericTasks/RequesterRequestSummary';

export { default as RequesterAwardedDetails } from './genericTasks/RequesterAwardedDetails';

export { default as RequesterAwardedSummary } from './genericTasks/RequesterAwardedSummary';

export {
  default as RequesterCanceledByRequesterSummary,
} from './genericTasks/RequesterCanceledByRequesterSummary';

export {
  default as RequesterCanceledByRequesterDetails,
} from './genericTasks/RequesterCanceledByRequesterDetails';

export {
  default as RequesterOpenCanceledSummary,
} from './genericTasks/RequesterOpenCanceledSummary';
export {
  default as RequesterOpenCanceledDetails,
} from './genericTasks/RequesterOpenCanceledDetails';

export { default as TaskerBidOnTaskSummary } from './genericTasks/TaskerBidOnTaskSummary';

export { default as TaskerBidOnTaskDetails } from './genericTasks/TaskerBidOnTaskDetails';

export { default as TaskerMyOpenBidSummary } from './genericTasks/TaskerMyOpenBidSummary';

export { default as TaskerMyOpenBidDetails } from './genericTasks/TaskerMyOpenBidDetails';

export { default as TaskerMyAwardedBidDetails } from './genericTasks/TaskerMyAwardedBidDetails';

export { default as TaskerMyAwardedBidSummary } from './genericTasks/TaskerMyAwardedBidSummary';

export {
  default as TaskerAwardedBidCanceledByTaskerDetails,
} from './genericTasks/TaskerAwardedBidCanceledByTaskerDetails';

export {
  default as TaskerAwardedBidCanceledByTaskerSummary,
} from './genericTasks/TaskerAwardedBidCanceledByTaskerSummary';

export { default as RequesterDoneSummary } from './genericTasks/RequesterDoneSummary';

export { default as RequesterDoneDetails } from './genericTasks/RequesterDoneDetails';

export {
  default as TaskerMyAwardedDoneBidDetails,
} from './genericTasks/TaskerMyAwardedDoneBidDetails';

export {
  default as TaskerMyAwardedDoneBidSummary,
} from './genericTasks/TaskerMyAwardedDoneBidSummary';

export { default as RequesterDisputedSummary } from './genericTasks/RequesterDisputedSummary';

export { default as RequesterDisputedDetails } from './genericTasks/RequesterDisputedDetails';

export { default as TaskerMyDisputedBidDetails } from './genericTasks/TaskerMyDisputedBidDetails';

export { default as TaskerMyDisputedBidSummary } from './genericTasks/TaskerMyDisputedBidSummary';
