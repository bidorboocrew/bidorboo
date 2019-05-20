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
export { HOUSE_CLEANING_DEF } from './house-cleaning/houseCleaningDefinition';
export { default as HouseCleaningConcept } from './house-cleaning/HouseCleaningConcept';
export { default as HouseCleaningCreateJob } from './house-cleaning/HouseCleaningCreateJob';

export {
  default as HouseCleaningRequestDetails,
} from './house-cleaning/HouseCleaningRequestDetails';

export {
  default as HouseCleaningRequestSummary,
} from './house-cleaning/HouseCleaningRequestSummary';

export {
  default as HouseCleaningAwardedDetails,
} from './house-cleaning/HouseCleaningAwardedDetails';

export {
  default as HouseCleaningAwardedSummary,
} from './house-cleaning/HouseCleaningAwardedSummary';

export {
  default as HouseCleaningAwardedCanceledByRequesterSummary,
} from './house-cleaning/HouseCleaningAwardedCanceledByRequesterSummary';

export {
  default as HouseCleaningAwardedCanceledByRequesterDetails,
} from './house-cleaning/HouseCleaningAwardedCanceledByRequesterDetails';

export {
  default as HouseCleaningOpenCanceledSummary,
} from './house-cleaning/HouseCleaningOpenCanceledSummary';
export {
  default as HouseCleaningOpenCanceledDetails,
} from './house-cleaning/HouseCleaningOpenCanceledDetails';

export {
  default as TaskerBidOnHouseCleaningSummary,
} from './house-cleaning/TaskerBidOnHouseCleaningSummary';

export {
  default as TaskerBidOnHouseCleaningDetails,
} from './house-cleaning/TaskerBidOnHouseCleaningDetails';

export {
  default as TaskerMyOpenBidHouseCleaningSummary,
} from './house-cleaning/TaskerMyOpenBidHouseCleaningSummary';

export {
  default as TaskerMyOpenBidHouseCleaningDetails,
} from './house-cleaning/TaskerMyOpenBidHouseCleaningDetails';




export {
  default as TaskerMyAwardedBidHouseCleaningSummary,
} from './house-cleaning/TaskerMyAwardedBidHouseCleaningSummary';
