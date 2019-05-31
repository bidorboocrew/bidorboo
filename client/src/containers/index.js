export { default as Header } from './Header';
export { default as HomePage } from './HomePage';

export { default as MyProfile } from './personal-profile/MyProfile';
export { default as MyProgress } from './personal-profile/MyStats';
export { default as PaymentSettings } from './personal-profile/PaymentSettings';
export { default as NotificationSettings } from './personal-profile/NotificationSettings';

export { default as VerificationPage } from './VerificationPage';

// proposer flow
export { default as ProposerRootPage } from './proposer-flow/ProposerRootPage';
export { default as CreateAJobPage } from './proposer-flow/CreateAJobPage';
export { default as MyRequestsPage } from './proposer-flow/MyRequestsPage';
export {
  default as ReviewMyAwardedJobAndWinningBidPage,
} from './proposer-flow/ReviewMyAwardedJobAndWinningBidPage';
export { default as ReviewRequestAndBidsPage } from './proposer-flow/ReviewRequestAndBidsPage';

// bidder flow
export { default as BidderRootPage } from './bidder-flow/BidderRootPage';
export { default as BidOnJobPage } from './bidder-flow/BidOnJobPage';
export { default as ReviewBidAndRequestPage } from './bidder-flow/ReviewOpenBidAndRequestPage';
export { default as ReviewAwardedBidPage } from './bidder-flow/ReviewAwardedBidPage';
export { default as MyBidsPage } from './bidder-flow/MyBidsPage';

export { default as NotificationsModal } from './NotificationsModal';

export {
  default as ProposerReviewingCompletedJob,
} from './review-flow/ProposerReviewingCompletedJob';
export { default as BidderReviewingCompletedJob } from './review-flow/BidderReviewingCompletedJob';

export { default as OtherUserProfileForReviewPage } from './OtherUserProfileForReviewPage';
export { default as PastProvidedServices } from './PastProvidedServices';
export { default as PastRequestedServices } from './PastRequestedServices';

export { default as FirstTimeUser } from './onboarding-flow/FirstTimeUser';
