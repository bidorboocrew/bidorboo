import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Toast from '../components/Toast';
import LoadingBar from 'react-redux-loading-bar';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import { getCurrentUser } from '../app-state/actions/authActions';
import logoImg from '../assets/images/android-chrome-192x192.png';
import canadaFlag from '../assets/images/Canada-flag-round.png';
import { registerServiceWorker } from '../registerServiceWorker';
import AddToMobileHomeScreenBanner from './AddToMobileHomeScreenBanner';
import '../assets/index.scss';

import {
  Header,
  HomePage,
  MyProfile,
  PaymentSettings,
  VerificationPage,
  ProposerRootPage,
  CreateAJobPage,
  MyRequestsPage,
  FirstTimeUser,
  ReviewMyAwardedJobAndWinningBidPage,
  ReviewRequestAndBidsPage,
  BidderRootPage,
  BidOnJobPage,
  ReviewBidAndRequestPage,
  ReviewAwardedBidPage,
  MyBidsPage,
  ProposerReviewingCompletedJob,
  BidderReviewingCompletedJob,
  OtherUserProfileForReviewPage,
  PastProvidedServices,
  PastRequestedServices,
  TermsOfUse,
} from './index';

import FreshdeskChat from './FreshdeskChat';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.log('bdb error details ' + error);
    console.log('failure info ' + info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate() {
    if (this.props.userDetails.notifications && this.props.userDetails.notifications.push) {
      registerServiceWorker(
        `${process.env.REACT_APP_VAPID_KEY}`,
        this.props.userDetails._id !== 'loggedOutUser_uuid',
      );
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
                <h1 className="title has-text-danger">OOOOPS ! We've Encountered An Error</h1>
                <br />
                <h1 className="sub-title">
                  Apologies for the inconvenience, We will track the issue and fix it asap.
                </h1>
                <br />
                <a
                  onClick={(e) => {
                    switchRoute(ROUTES.CLIENT.HOME);
                    // xxxx update without reload
                    window.location.reload();
                  }}
                  className="button is-outlined is-success is-medium"
                >
                  Go to Home Page
                </a>
              </div>
            </div>
          </section>
        </div>
      );
    }

    const { s_toastDetails, userAppView, isLoggedIn, authIsInProgress } = this.props;
    // if (authIsInProgress) {
    //   return (
    //     <Spinner renderLabel="Authenticating..." isLoading={authIsInProgress} size={'large'} />
    //   );
    // }

    return (
      <div id="bidorboo-root-view">
        <FreshdeskChat />
        <div id="bidorboo-root-modals" />
        {/* this sill be where action sheets mount */}
        <div id="bidorboo-root-action-sheet" />
        <Toast toastDetails={s_toastDetails} />
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
          <Switch>
            {/* public paths */}
            <Route exact path={ROUTES.CLIENT.TOS} component={TermsOfUse} />

            <Route exact path={ROUTES.CLIENT.HOME} component={HomePage} />
            <Route exact path={ROUTES.CLIENT.PROPOSER.root} component={ProposerRootPage} />
            <Route exact path={`${ROUTES.CLIENT.PROPOSER.createjob}`} component={CreateAJobPage} />
            <Route exact path={ROUTES.CLIENT.BIDDER.root} component={BidderRootPage} />
            <Route exact path={ROUTES.CLIENT.BIDDER.bidOnJobPage} component={BidOnJobPage} />
            <Route
              exact
              path={`${ROUTES.CLIENT.USER_ROFILE_FOR_REVIEW}`}
              component={OtherUserProfileForReviewPage}
            />
            {/* loggedInPaths paths */}

            <Route exact path={`${ROUTES.CLIENT.ONBOARDING}`} component={FirstTimeUser} />

            <Route exact path={`${ROUTES.CLIENT.PROPOSER.myOpenJobs}`} component={MyRequestsPage} />

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
              path={ROUTES.CLIENT.MY_PROFILE.paymentSettings}
              component={PaymentSettings}
            />
            <Route exact path={`${ROUTES.CLIENT.VERIFICATION}`} component={VerificationPage} />
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
            <Route
              exact
              path={`${ROUTES.CLIENT.MY_PROFILE.pastProvidedServices}`}
              component={PastProvidedServices}
            />
            <Route
              exact
              path={`${ROUTES.CLIENT.MY_PROFILE.pastRequestedServices}`}
              component={PastRequestedServices}
            />
            <Redirect path="*" to={ROUTES.CLIENT.ENTRY} />

            <Redirect path="*" to={ROUTES.CLIENT.HOME} />
          </Switch>
        </div>
        {!(window.location.pathname.indexOf('/on-boarding') > -1) && (
          <footer id="mainFooter" className="footer">
            <nav className="level">
              <div className="level-item has-text-centered">
                <div>
                  <p className="has-text-white is-size-7">Availablility</p>
                  <div className="is-size-7">
                    <img
                      width={21}
                      height={21}
                      alt="Canada"
                      style={{ WebkitFilter: 'grayscale(100%)', filter: 'grayscale(100%)' }}
                      src={canadaFlag}
                    />
                  </div>
                  <div>
                    <a
                      style={{ padding: '0.25rem', margin: '0.5rem', textDecoration: 'underline' }}
                      className="is-size-7"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${ROUTES.CLIENT.TOS}`}
                    >
                      {`BidOrBoo Terms`}
                    </a>
                    <span className="has-text-white">{`&`}</span>
                    <a
                      style={{ padding: '0.25rem', margin: '0.5rem', textDecoration: 'underline' }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://stripe.com/connect-account/legal"
                      className="is-size-7"
                    >
                      {`Stripe Terms`}
                    </a>
                  </div>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <div className="has-text-white is-size-7">
                    <img
                      src={logoImg}
                      alt="BidOrBoo"
                      style={{ WebkitFilter: 'grayscale(100%)', filter: 'grayscale(100%)' }}
                      width={21}
                      height={21}
                    />
                    {` BidOrBoo Inc`}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <AddToMobileHomeScreenBanner />
                  </div>
                </div>
              </div>

              <div className="level-item has-text-centered">
                <div>
                  <p className="has-text-white is-size-7">Contact Us</p>
                  <div className="has-text-white is-size-7">bidorboocrew@bidorboo.com</div>
                </div>
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
