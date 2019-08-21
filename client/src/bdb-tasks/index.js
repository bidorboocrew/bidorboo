export const REQUEST_STATES = {
  OPEN: 'OPEN',
  AWARDED: 'AWARDED',
  DISPUTED: 'DISPUTED',
  AWARDED_JOB_CANCELED_BY_BIDDER: 'AWARDED_JOB_CANCELED_BY_BIDDER',
  AWARDED_JOB_CANCELED_BY_REQUESTER: 'AWARDED_JOB_CANCELED_BY_REQUESTER',
  CANCELED_OPEN: 'CANCELED_OPEN',
  DONE: 'DONE',
  PAIDOUT: 'PAIDOUT',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  PAYMENT_TO_BANK_FAILED: 'PAYMENT_TO_BANK_FAILED',
  ARCHIVE: 'ARCHIVE',
};

export const BID_STATES = {
  OPEN: 'OPEN',
  AWARDED: 'AWARDED',
  AWARDED_SEEN: 'AWARDED_SEEN',
  AWARDED_BID_CANCELED_BY_TASKER: 'AWARDED_BID_CANCELED_BY_TASKER',
  DISPUTED: 'DISPUTED',
  AWARDED_BID_CANCELED_BY_REQUESTER: 'AWARDED_BID_CANCELED_BY_REQUESTER',
  DONE: 'DONE',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  PAYMENT_TO_BANK_FAILED: 'PAYMENT_TO_BANK_FAILED',
  ARCHIVE: 'ARCHIVE',
};

export const POINT_OF_VIEW = {
  REQUESTER: 'REQUESTER',
  TASKER: 'TASKER',
};

export { default as TASKS_DEFINITIONS } from './tasksDefinitions';

export {
  default as RequesterRequestDetails,
} from './AllPossibleTasksStatesCards/RequesterRequestDetails';

export {
  default as RequesterRequestSummary,
} from './AllPossibleTasksStatesCards/RequesterRequestSummary';

export {
  default as RequesterAwardedDetails,
} from './AllPossibleTasksStatesCards/RequesterAwardedDetails';

export {
  default as RequesterAwardedSummary,
} from './AllPossibleTasksStatesCards/RequesterAwardedSummary';

export {
  default as RequesterCanceledByRequesterSummary,
} from './AllPossibleTasksStatesCards/RequesterCanceledByRequesterSummary';

export {
  default as RequesterCanceledByRequesterDetails,
} from './AllPossibleTasksStatesCards/RequesterCanceledByRequesterDetails';

export {
  default as RequesterCanceledByTaskerSummary,
} from './AllPossibleTasksStatesCards/RequesterCanceledByTaskerSummary';

export {
  default as RequesterCanceledByTaskerDetails,
} from './AllPossibleTasksStatesCards/RequesterCanceledByTaskerDetails';

export {
  default as RequesterOpenCanceledSummary,
} from './AllPossibleTasksStatesCards/RequesterOpenCanceledSummary';
export {
  default as RequesterOpenCanceledDetails,
} from './AllPossibleTasksStatesCards/RequesterOpenCanceledDetails';

export {
  default as TaskerBidOnTaskSummary,
} from './AllPossibleTasksStatesCards/TaskerBidOnTaskSummary';

export {
  default as TaskerBidOnTaskDetails,
} from './AllPossibleTasksStatesCards/TaskerBidOnTaskDetails';

export {
  default as TaskerMyOpenBidSummary,
} from './AllPossibleTasksStatesCards/TaskerMyOpenBidSummary';

export {
  default as TaskerMyOpenBidDetails,
} from './AllPossibleTasksStatesCards/TaskerMyOpenBidDetails';

export {
  default as TaskerMyAwardedBidDetails,
} from './AllPossibleTasksStatesCards/TaskerMyAwardedBidDetails';

export {
  default as TaskerMyAwardedBidSummary,
} from './AllPossibleTasksStatesCards/TaskerMyAwardedBidSummary';

export {
  default as TaskerAwardedBidCanceledByTaskerDetails,
} from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByTaskerDetails';

export {
  default as TaskerAwardedBidCanceledByRequesterSummary,
} from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByRequesterSummary';

export {
  default as TaskerAwardedBidCanceledByRequesterDetails,
} from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByRequesterDetails';

export {
  default as TaskerAwardedBidCanceledByTaskerSummary,
} from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByTaskerSummary';

export {
  default as RequesterDoneSummary,
} from './AllPossibleTasksStatesCards/RequesterDoneSummary';

export {
  default as RequesterDoneDetails,
} from './AllPossibleTasksStatesCards/RequesterDoneDetails';

export {
  default as TaskerMyAwardedDoneBidDetails,
} from './AllPossibleTasksStatesCards/TaskerMyAwardedDoneBidDetails';

export {
  default as TaskerMyAwardedDoneBidSummary,
} from './AllPossibleTasksStatesCards/TaskerMyAwardedDoneBidSummary';

export {
  default as RequesterDisputedSummary,
} from './AllPossibleTasksStatesCards/RequesterDisputedSummary';

export {
  default as RequesterDisputedDetails,
} from './AllPossibleTasksStatesCards/RequesterDisputedDetails';

export {
  default as TaskerMyDisputedBidDetails,
} from './AllPossibleTasksStatesCards/TaskerMyDisputedBidDetails';

export {
  default as TaskerMyDisputedBidSummary,
} from './AllPossibleTasksStatesCards/TaskerMyDisputedBidSummary';
