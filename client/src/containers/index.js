export { default as Header } from './Header';
export { default as HomePage } from './HomePage';

export { default as MyProfile } from './personal-profile/MyProfile';
export { default as PaymentSettings } from './personal-profile/PaymentSettings';
export { default as NotificationSettings } from './personal-profile/MyNotifications';


// proposer flow
export { default as ProposerRootPage } from './proposer-flow/ProposerRootPage';
export { default as CreateAJobPage } from './proposer-flow/CreateAJobPage';
export { default as MyRequestsPage } from './proposer-flow/MyRequestsPage';
export {
  default as ReviewMyAwardedJobAndWinningBidPage,
} from './proposer-flow/ReviewMyAwardedJobAndWinningBidPage';
export { default as ReviewRequestAndBidsPage } from './proposer-flow/ReviewRequestAndBidsPage';

// tasker flow
export { default as TaskerRootPage } from './tasker-flow/TaskerRootPage';
export { default as BidOnJobPage } from './tasker-flow/BidOnJobPage';
export { default as ReviewBidAndRequestPage } from './tasker-flow/ReviewOpenBidAndRequestPage';
export { default as ReviewAwardedBidPage } from './tasker-flow/ReviewAwardedBidPage';
export { default as MyBidsPage } from './tasker-flow/MyBidsPage';

export { default as NotificationsModal } from './NotificationsModal';

export {
  default as ProposerReviewingCompletedJob,
} from './review-flow/ProposerReviewingCompletedJob';
export { default as TaskerReviewingCompletedJob } from './review-flow/TaskerReviewingCompletedJob';

export { default as OtherUserProfileForReviewPage } from './OtherUserProfileForReviewPage';

export { default as FirstTimeUser } from './onboarding-flow/FirstTimeUser';
export { default as ResetLocalPassword } from './onboarding-flow/ResetLocalPassword';
export { default as LoginOrRegisterPage } from './onboarding-flow/LoginOrRegisterPage';

export { default as TermsOfService } from './onboarding-flow/TermsOfService';
export { default as ShareButtons } from './ShareButtons';
