export const REQUEST_STATES = {
  // delete
  PAIDOUT: 'PAIDOUT',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  PAYMENT_TO_BANK_FAILED: 'PAYMENT_TO_BANK_FAILED',
  //------delete above

  // real ones
  OPEN: 'OPEN',
  AWARDED: 'AWARDED', //
  AWARDED_SEEN: 'AWARDED_SEEN',
  DISPUTED: 'DISPUTED', // disputed request
  AWARDED_REQUEST_CANCELED_BY_TASKER: 'AWARDED_REQUEST_CANCELED_BY_TASKER',
  AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN: 'AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN',
  AWARDED_REQUEST_CANCELED_BY_REQUESTER: 'AWARDED_REQUEST_CANCELED_BY_REQUESTER',
  AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN: 'AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN',
  DONE: 'DONE', //when Tasker confirms we set it to Payout , later a cron request will pay the account
  DONE_SEEN: 'DONE_SEEN',
  DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',
  ARCHIVE: 'ARCHIVE', //For historical record
};

export const POINT_OF_VIEW = {
  REQUESTER: 'REQUESTER',
  TASKER: 'TASKER',
};

export { default as TASKS_DEFINITIONS } from './tasksDefinitions';

export { default as RequesterRequestDetails } from './AllPossibleTasksStatesCards/RequesterRequestDetails';

export { default as RequesterRequestSummary } from './AllPossibleTasksStatesCards/RequesterRequestSummary';

export { default as RequesterAwardedDetails } from './AllPossibleTasksStatesCards/RequesterAwardedDetails';

export { default as RequesterAwardedSummary } from './AllPossibleTasksStatesCards/RequesterAwardedSummary';
export { default as RequesterArchiveSummary } from './AllPossibleTasksStatesCards/RequesterArchiveSummary';
export { default as RequesterArchiveDetails } from './AllPossibleTasksStatesCards/RequesterArchiveDetails';

export { default as RequesterCanceledByRequesterSummary } from './AllPossibleTasksStatesCards/RequesterCanceledByRequesterSummary';

export { default as RequesterCanceledByRequesterDetails } from './AllPossibleTasksStatesCards/RequesterCanceledByRequesterDetails';

export { default as RequesterCanceledByTaskerSummary } from './AllPossibleTasksStatesCards/RequesterCanceledByTaskerSummary';

export { default as RequesterCanceledByTaskerDetails } from './AllPossibleTasksStatesCards/RequesterCanceledByTaskerDetails';
export { default as RequesterDisputedResolvedDetails } from './AllPossibleTasksStatesCards/RequesterDisputedResolvedDetails';
export { default as RequesterDisputedResolvedSummary } from './AllPossibleTasksStatesCards/RequesterDisputedResolvedSummary';

export { default as TaskerBidOnTaskSummary } from './AllPossibleTasksStatesCards/TaskerBidOnTaskSummary';

export { default as TaskerBidOnTaskDetails } from './AllPossibleTasksStatesCards/TaskerBidOnTaskDetails';

export { default as TaskerMyOpenBidSummary } from './AllPossibleTasksStatesCards/TaskerMyOpenBidSummary';

export { default as TaskerMyOpenBidDetails } from './AllPossibleTasksStatesCards/TaskerMyOpenBidDetails';

export { default as TaskerMyAwardedBidDetails } from './AllPossibleTasksStatesCards/TaskerMyAwardedBidDetails';

export { default as TaskerMyAwardedBidSummary } from './AllPossibleTasksStatesCards/TaskerMyAwardedBidSummary';

export { default as TaskerAwardedBidCanceledByTaskerDetails } from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByTaskerDetails';

export { default as TaskerAwardedBidCanceledByRequesterSummary } from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByRequesterSummary';

export { default as TaskerAwardedBidCanceledByRequesterDetails } from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByRequesterDetails';

export { default as TaskerAwardedBidCanceledByTaskerSummary } from './AllPossibleTasksStatesCards/TaskerAwardedBidCanceledByTaskerSummary';

export { default as RequesterDoneSummary } from './AllPossibleTasksStatesCards/RequesterDoneSummary';

export { default as RequesterDoneDetails } from './AllPossibleTasksStatesCards/RequesterDoneDetails';

export { default as TaskerBidDoneDetails } from './AllPossibleTasksStatesCards/TaskerBidDoneDetails';

export { default as TaskerBidDoneSummary } from './AllPossibleTasksStatesCards/TaskerBidDoneSummary';

export { default as RequesterDisputedSummary } from './AllPossibleTasksStatesCards/RequesterDisputedSummary';

export { default as RequesterDisputedDetails } from './AllPossibleTasksStatesCards/RequesterDisputedDetails';

export { default as TaskerMyDisputedBidDetails } from './AllPossibleTasksStatesCards/TaskerMyDisputedBidDetails';
export { default as TaskerMyDisputedResolvedBidDetails } from './AllPossibleTasksStatesCards/TaskerMyDisputedResolvedBidDetails';
export { default as TaskerMyDisputedResolvedBidSummary } from './AllPossibleTasksStatesCards/TaskerMyDisputedResolvedBidSummary';

export { default as TaskerMyDisputedBidSummary } from './AllPossibleTasksStatesCards/TaskerMyDisputedBidSummary';
export { default as TaskerArchiveSummary } from './AllPossibleTasksStatesCards/TaskerArchiveSummary';
export { default as TaskerArchiveDetails } from './AllPossibleTasksStatesCards/TaskerArchiveDetails';
