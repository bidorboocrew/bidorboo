import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

// https://github.com/osano/cookieconsent/tree/dev/src
// import CookieConsent from 'cookieconsent';

import Toast from '../components/Toast';
import LoadingBar from 'react-redux-loading-bar';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import { getCurrentUser } from '../app-state/actions/authActions';
import logoImg from '../assets/images/android-chrome-192x192.png';
import canadaFlag from '../assets/images/Canada-flag-round.png';
import AddToMobileHomeScreenBanner from './AddToMobileHomeScreenBanner';
import '../assets/index.scss';
import { Spinner } from '../components/Spinner.jsx';

import { Header, HomePage, ResetLocalPassword, FirstTimeUser, LoginOrRegisterPage } from './index';

import ShowSpecialMomentModal from './ShowSpecialMomentModal';

const FreshdeskChat = lazy(() => import('./FreshdeskChat.jsx'));

const MyNotifications = lazy(() => import('./personal-profile/MyNotifications.jsx'));
const MyProfile = lazy(() => import('./personal-profile/MyProfile.jsx'));
const PaymentSettings = lazy(() => import('./personal-profile/PaymentSettings.jsx'));

const ProposerRootPage = lazy(() => import('./proposer-flow/ProposerRootPage.jsx'));
const CreateAJobPage = lazy(() => import('./proposer-flow/CreateAJobPage.jsx'));

const MyRequestsPage = lazy(() => import('./proposer-flow/MyRequestsPage.jsx'));

const TermsOfService = lazy(() => import('./onboarding-flow/TermsOfService.jsx'));
const OtherUserProfileForReviewPage = lazy(() => import('./OtherUserProfileForReviewPage.jsx'));
const BidderReviewingCompletedJob = lazy(() =>
  import('./review-flow/BidderReviewingCompletedJob.jsx'),
);
const ProposerReviewingCompletedJob = lazy(() =>
  import('./review-flow/ProposerReviewingCompletedJob.jsx'),
);
const MyBidsPage = lazy(() => import('./bidder-flow/MyBidsPage.jsx'));
const ReviewAwardedBidPage = lazy(() => import('./bidder-flow/ReviewAwardedBidPage.jsx'));
const ReviewBidAndRequestPage = lazy(() => import('./bidder-flow/ReviewOpenBidAndRequestPage.jsx'));
const BidOnJobPage = lazy(() => import('./bidder-flow/BidOnJobPage.jsx'));
const BidderRootPage = lazy(() => import('./bidder-flow/BidderRootPage.jsx'));
const ReviewRequestAndBidsPage = lazy(() => import('./proposer-flow/ReviewRequestAndBidsPage.jsx'));
const ReviewMyAwardedJobAndWinningBidPage = lazy(() =>
  import('./proposer-flow/ReviewMyAwardedJobAndWinningBidPage.jsx'),
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // componentDidMount() {
  //   // https://github.com/osano/cookieconsent/tree/dev/src
  //   window.cookieconsent.initialise({
  //     container: document.getElementById('bidorboo-root-cookieconsent'),
  //     palette: {
  //       popup: { background: '#1aa3ff' },
  //       button: { background: '#e0e0e0' },
  //     },
  //     revokable: true,
  //     onStatusChange: function(status) {
  //       console.log(this.hasConsented() ? 'enable cookies' : 'disable cookies');
  //     },
  //     theme: 'edgeless',
  //     content: {
  //       header: 'Cookies used on the website!',
  //       message: 'This website uses cookies to improve your experience.',
  //       dismiss: 'Got it!',
  //       allow: 'Allow cookies',
  //       deny: 'Decline',
  //       link: 'Learn more',
  //       href: 'https://www.cookiesandyou.com',
  //       close: '&#x274c;',
  //       policy: 'Cookie Policy',
  //       target: '_blank',
  //     },
  //   });
  // }
  componentDidCatch(error, info) {
    console.error('bdb error details ' + error);
    console.error('failure info ' + info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div id="bidorboo-root-view">
          <div id="bidorboo-root-cookieconsent" />
          <Header id="bidorboo-header" />
          <section className="hero is-fullheight">
            <div className="hero-body">
              <div className="container">
                <h1 className="title has-text-info">Sorry! We've encountered an error</h1>
                <br />
                <h1 className="sub-title">
                  Apologies for the inconvenience, We will track the issue and fix it asap.
                </h1>
                <br />
                <a
                  onClick={(e) => {
                    switchRoute(ROUTES.CLIENT.HOME);
                    // xxxx update without reload
                  }}
                  className="button is-success is-medium"
                >
                  Go to Home Page
                </a>
              </div>
            </div>
          </section>
        </div>
      );
    }

    const { s_toastDetails } = this.props;
    // if (authIsInProgress) {
    //   return (
    //     <Spinner renderLabel="Authenticating..." isLoading={authIsInProgress} size={'large'} />
    //   );
    // }

    return (
      <div id="bidorboo-root-view">
        {/* <FreshdeskChat /> */}
        <div id="bidorboo-root-modals" />
        {/* this sill be where action sheets mount */}
        <div id="bidorboo-root-action-sheet" />
        {/* <ShareButtons></ShareButtons> */}
        <Toast toastDetails={s_toastDetails} />
        <ShowSpecialMomentModal />
        <LoadingBar
          updateTime={700}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            backgroundColor: 'hsl(141, 71%, 48%)',
            height: '5px',
            zIndex: 999,
          }}
        />
        <Header id="bidorboo-header" />
        <div id="RoutesWrapper" className="has-navbar-fixed-top">
          <Suspense fallback={<Spinner renderLabel="loading..."></Spinner>}>
            <Switch>
              <Route exact path={ROUTES.CLIENT.HOME} component={HomePage} />
              <Route exact path={ROUTES.CLIENT.PROPOSER.root} component={ProposerRootPage} />
              <Route
                exact
                path={`${ROUTES.CLIENT.PROPOSER.createjob}`}
                component={CreateAJobPage}
              />
              <Route exact path={ROUTES.CLIENT.BIDDER.root} component={BidderRootPage} />
              <Route exact path={ROUTES.CLIENT.BIDDER.bidOnJobPage} component={BidOnJobPage} />
              <Route
                exact
                path={`${ROUTES.CLIENT.USER_ROFILE_FOR_REVIEW}`}
                component={OtherUserProfileForReviewPage}
              />

              <Route exact path={`${ROUTES.CLIENT.ONBOARDING}`} component={FirstTimeUser} />
              <Route exact path={`${ROUTES.CLIENT.RESETPASSWORD}`} component={ResetLocalPassword} />
              <Route exact path={'/login-and-registration'} component={LoginOrRegisterPage} />

              <Route
                exact
                path={`${ROUTES.CLIENT.PROPOSER.myRequestsPage}`}
                component={MyRequestsPage}
              />

              <Route
                exact
                path={`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}`}
                component={ReviewRequestAndBidsPage}
              />
              <Route
                exact
                path={`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}`}
                component={ReviewMyAwardedJobAndWinningBidPage}
              />
              <Route exact path={ROUTES.CLIENT.BIDDER.mybids} component={MyBidsPage} />
              <Route
                exact
                path={`${ROUTES.CLIENT.BIDDER.reviewMyOpenBidAndTheRequestDetails}`}
                component={ReviewBidAndRequestPage}
              />
              <Route
                exact
                path={`${ROUTES.CLIENT.BIDDER.awardedBidDetailsPage}`}
                component={ReviewAwardedBidPage}
              />
              <Route exact path={ROUTES.CLIENT.MY_PROFILE.basicSettings} component={MyProfile} />
              <Route
                exact
                path={ROUTES.CLIENT.MY_PROFILE.myNotifications}
                component={MyNotifications}
              />
              <Route
                exact
                path={ROUTES.CLIENT.MY_PROFILE.paymentSettings}
                component={PaymentSettings}
              />
              <Route
                exact
                path={`${ROUTES.CLIENT.REVIEW.proposerJobReview}`}
                component={ProposerReviewingCompletedJob}
              />
              <Route
                exact
                path={`${ROUTES.CLIENT.REVIEW.bidderJobReview}`}
                component={BidderReviewingCompletedJob}
              />

              <Route exact path={ROUTES.CLIENT.TOS} component={TermsOfService} />
              <Redirect path="*" to={ROUTES.CLIENT.HOME} />
            </Switch>
          </Suspense>
        </div>
        {!(window.location.pathname.indexOf('/on-boarding') > -1) && (
          <footer id="mainFooter" className="footer">
            <nav className="level">
              <div className="level-item has-text-centered">
                <div>
                  <p className="has-text-white is-size-7">Availability</p>
                  <div className="is-size-7">
                    <img width={21} height={21} alt="Canada" src={canadaFlag} />
                  </div>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <div className="has-text-white is-size-7">
                    <img src={logoImg} alt="BidOrBoo" width={21} height={21} />
                    {` BidOrBoo Inc`}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <AddToMobileHomeScreenBanner />
                  </div>
                </div>
              </div>

              <div className="level-item has-text-centered">
                <div>
                  <p className="has-text-white is-size-7">Chat With Us</p>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <Suspense fallback={<Spinner renderLabel="loading..."></Spinner>}>
                      <FreshdeskChat isFooter />
                    </Suspense>
                  </div>
                </div>
              </div>
            </nav>
            <nav className="container help">
              <div className="has-text-light">
                {`To get in touch via email:`}
                <a className="has-text-link" href={`mailto:bidorboo@bidorboo.ca`}>
                  <span className="icon">
                    <i className="far fa-envelope" />
                  </span>
                  <span>bidorboo@bidorboo.ca</span>
                </a>
              </div>
              <div className="has-text-light">
                <a className="has-text-link" onClick={() => switchRoute(ROUTES.CLIENT.TOS)}>
                  {`BidOrBoo Service Terms | Privacy`}
                </a>
                {' and '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://stripe.com/connect-account/legal"
                  className="has-text-link"
                >
                  {`Stripe Terms of use`}
                </a>
              </div>
              <div className="help has-text-light">
                {`This site is protected by reCAPTCHA and the Google `}
                <a className="has-text-link" href="https://policies.google.com/privacy">
                  Privacy Policy
                </a>
                {` and `}
                <a className="has-text-link" href="https://policies.google.com/terms">
                  Terms of Service
                </a>
                {` apply.`}
              </div>
            </nav>
          </footer>
        )}
      </div>
    );
  }
}
const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    s_toastDetails: uiReducer.toastDetails,
    userAppView: uiReducer.userAppView,
    authIsInProgress: uiReducer.authIsInProgress,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
