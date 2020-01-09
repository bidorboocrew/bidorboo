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
import CookieConsent from 'react-cookie-consent';

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

const RequesterRootPage = lazy(() => import('./requester-flow/RequesterRootPage.jsx'));
const CreateARequestPage = lazy(() => import('./requester-flow/CreateARequestPage.jsx'));

const MyRequestsPage = lazy(() => import('./requester-flow/MyRequestsPage.jsx'));

const TermsOfService = lazy(() => import('./onboarding-flow/TermsOfService.jsx'));
const OtherUserProfileForReviewPage = lazy(() => import('./OtherUserProfileForReviewPage.jsx'));
const TaskerReviewingCompletedRequest = lazy(() =>
  import('./review-flow/TaskerReviewingCompletedRequest.jsx'),
);
const RequesterReviewingCompletedRequest = lazy(() =>
  import('./review-flow/RequesterReviewingCompletedRequest.jsx'),
);
const MyBidsPage = lazy(() => import('./tasker-flow/MyBidsPage.jsx'));
const ReviewAwardedBidPage = lazy(() => import('./tasker-flow/ReviewAwardedBidPage.jsx'));
const ReviewBidAndRequestPage = lazy(() => import('./tasker-flow/ReviewOpenBidAndRequestPage.jsx'));
const BidOnRequestPage = lazy(() => import('./tasker-flow/BidOnRequestPage.jsx'));
const TaskerRootPage = lazy(() => import('./tasker-flow/TaskerRootPage.jsx'));
const ReviewRequestAndBidsPage = lazy(() =>
  import('./requester-flow/ReviewRequestAndBidsPage.jsx'),
);
const ReviewMyAwardedRequestAndWinningBidPage = lazy(() =>
  import('./requester-flow/ReviewMyAwardedRequestAndWinningBidPage.jsx'),
);

const getCookieByName = (name) => {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length == 2)
    return parts
      .pop()
      .split(';')
      .shift();
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.error('bdb error details ' + error);
    console.error('failure info ' + info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidMount() {
    if (getCookieByName('BidOrBooCookieConsent') === 'true') {
      // google analytics
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'UA-142687351-1');
      window['ga-disable-UA-142687351-1'] = false;
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div id="bidorboo-root-view">
          <Header id="bidorboo-header" />
          <section className="hero is-fullheight">
            <div className="hero-body">
              <div className="container">
                <label className="subtitle has-text-info">Sorry! We've encountered an error</label>
                <br />
                <label className="is-size-7">
                  Apologies for the inconvenience, We will track the issue and fix it asap.
                </label>
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

    return (
      <div id="bidorboo-root-view">
        {/* <FreshdeskChat /> */}
        <div id="bidorboo-root-modals" />
        {/* this sill be where action sheets mount */}
        <div id="bidorboo-root-action-sheet" />
        <CookieConsent
          location="bottom"
          buttonText="I Accept"
          declineButtonText="Decline"
          cookieName="BidOrBooCookieConsent"
          style={{ background: '#494949' }}
          contentStyle={{ marginBottom: 0 }}
          declineButtonClasses={'button is-danger is-small'}
          buttonClasses={'button is-success is-small'}
          buttonStyle={{
            background: '#26ca70',
            color: 'white',
          }}
          expires={365}
          enableDeclineButton
          onAccept={() => {
            // google analytics
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              window.dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'UA-142687351-1');
            window['ga-disable-UA-142687351-1'] = false;
          }}
          onDecline={() => {
            window['ga-disable-UA-142687351-1'] = true;
          }}
        >
          <div className="help has-text-light">
            {`This website uses cookies to enhance the user experience `}
            <a style={{ color: '#72a4f7' }} onClick={() => switchRoute(ROUTES.CLIENT.TOS)}>
              {`BidOrBoo Service Terms | Privacy`}
            </a>
          </div>
        </CookieConsent>
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
              <Route exact path={ROUTES.CLIENT.REQUESTER.root} component={RequesterRootPage} />
              <Route
                exact
                path={`${ROUTES.CLIENT.REQUESTER.createrequest}`}
                component={CreateARequestPage}
              />
              <Route exact path={ROUTES.CLIENT.TASKER.root} component={TaskerRootPage} />
              <Route
                exact
                path={ROUTES.CLIENT.TASKER.bidOnRequestPage}
                component={BidOnRequestPage}
              />
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
                path={`${ROUTES.CLIENT.REQUESTER.myRequestsPage}`}
                component={MyRequestsPage}
              />

              <Route
                exact
                path={`${ROUTES.CLIENT.REQUESTER.reviewRequestAndBidsPage}`}
                component={ReviewRequestAndBidsPage}
              />
              <Route
                exact
                path={`${ROUTES.CLIENT.REQUESTER.selectedAwardedRequestPage}`}
                component={ReviewMyAwardedRequestAndWinningBidPage}
              />

              <Route exact path={ROUTES.CLIENT.TASKER.mybids} component={MyBidsPage} />
              <Route
                exact
                path={`${ROUTES.CLIENT.TASKER.reviewMyOpenBidAndTheRequestDetails}`}
                component={ReviewBidAndRequestPage}
              />
              <Route
                exact
                path={`${ROUTES.CLIENT.TASKER.awardedBidDetailsPage}`}
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
                path={`${ROUTES.CLIENT.REVIEW.requesterRequestReview}`}
                component={RequesterReviewingCompletedRequest}
              />
              <Route
                exact
                path={`${ROUTES.CLIENT.REVIEW.taskerRequestReview}`}
                component={TaskerReviewingCompletedRequest}
              />

              <Route exact path={ROUTES.CLIENT.TOS} component={TermsOfService} />
              <Redirect path="*" to={ROUTES.CLIENT.HOME} />
            </Switch>
          </Suspense>
        </div>

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
                <div style={{ marginBottom: '0.5rem' }}>
                  <Suspense fallback={<Spinner renderLabel="loading..."></Spinner>}>
                    <FreshdeskChat isFooter />
                  </Suspense>
                </div>
              </div>
            </div>
          </nav>
          <nav className="container help has-text-centered">
            <div className="has-text-light">
              {`To get in touch via email:`}
              <a
                style={{ color: '#72a4f7' }}
                className="has-text-link"
                href={`mailto:bidorboo@bidorboo.ca`}
              >
                <span className="icon">
                  <i className="far fa-envelope" />
                </span>
                <span>bidorboo@bidorboo.ca</span>
              </a>
            </div>
            <div className="has-text-light">
              <a
                style={{ color: '#72a4f7' }}
                className="has-text-link"
                onClick={() => switchRoute(ROUTES.CLIENT.TOS)}
              >
                {`BidOrBoo Service Terms | Privacy`}
              </a>
              {' and '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://stripe.com/connect-account/legal"
                className="has-text-link"
                style={{ color: '#72a4f7' }}
              >
                {`Stripe Terms of use`}
              </a>
            </div>
            <div className="help has-text-light">
              {`This site is protected by reCAPTCHA and the Google `}
              <a
                style={{ color: '#72a4f7' }}
                className="has-text-link"
                href="https://policies.google.com/privacy"
              >
                Privacy Policy
              </a>
              {` and `}
              <a
                style={{ color: '#72a4f7' }}
                className="has-text-link"
                href="https://policies.google.com/terms"
              >
                Terms of Service
              </a>
              {` apply.`}
            </div>
          </nav>
        </footer>
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
    dispatch,
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
