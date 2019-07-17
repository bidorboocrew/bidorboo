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
