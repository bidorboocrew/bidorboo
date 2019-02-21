import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Toast from '../components/Toast';
import LoadingBar from 'react-redux-loading-bar';
import * as ROUTES from '../constants/frontend-route-consts';
import { getCurrentUser } from '../app-state/actions/authActions';

import '../assets/index.css';

import {
  Header,
  HomePage,
  MyProfile,
  PaymentSettings,
  VerificationPage,
  ProposerRootPage,
  CreateAJobPage,
  MyOpenJobsPage,
  FirstTimeUser,
  ReviewMyAwardedJobAndWinningBidPage,
  ReviewRequestAndBidsPage,
  BidderRootPage,
  BidOnJobPage,
  ReviewBidAndRequestPage,
  ReviewAwardedBidPage,
  MyBidsPage,
  MyAgenda,
  ProposerReviewingCompletedJob,
  BidderReviewingCompletedJob,
  OtherUserProfileForReviewPage,
  PastProvidedServices,
  PastRequestedServices,
} from './index';

class App extends React.Component {
  componentDidCatch(error, info) {
    console.log('bdb error details ' + error);
    console.log('failure info ' + info);
  }

  render() {
    const { s_toastDetails, userAppView, isLoggedIn } = this.props;
    return (
      <div id="bidorboo-root-view">
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
            backgroundColor: '#31c110',
            height: '5px',
          }}
        />

        {isLoggedIn &&
          window.location &&
          window.location.href &&
          window.location.href.indexOf('BidOrBoo') < 0 && (
            <React.Fragment>
              {userAppView === 'PROPOSER' && (
                <div className="VerticalAligner title" id="bidorboo-switch-role">
                  <p className="title has-text-dark">Requester View</p>
                </div>
              )}

              {userAppView === 'BIDDER' && (
                <div className="VerticalAligner title " id="bidorboo-switch-role">
                  <p className="title has-text-dark">Tasker View</p>
                </div>
              )}
            </React.Fragment>
          )}
        <Header id="bidorboo-header" />
        <div id="RoutesWrapper">
          <Switch>
            {/* public paths */}
            <Route exact path={ROUTES.CLIENT.HOME} component={HomePage} />
            <Route exact path={ROUTES.CLIENT.PROPOSER.root} component={ProposerRootPage} />
            <Route
              exact
              path={`${ROUTES.CLIENT.PROPOSER.createjob}/:templateId`}
              component={CreateAJobPage}
            />
            <Route exact path={ROUTES.CLIENT.BIDDER.root} component={BidderRootPage} />
            <Route exact path={ROUTES.CLIENT.BIDDER.bidOnJobPage} component={BidOnJobPage} />
            <Route
              exact
              path={`${ROUTES.CLIENT.USER_ROFILE_FOR_REVIEW}`}
              component={OtherUserProfileForReviewPage}
            />
            {/* loggedInPaths paths */}

            <Route exact path={`${ROUTES.CLIENT.ONBOARDING}`} component={FirstTimeUser} />

            <Route exact path={`${ROUTES.CLIENT.PROPOSER.myOpenJobs}`} component={MyOpenJobsPage} />

            <Route
              exact
              path={`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/:jobId`}
              component={ReviewRequestAndBidsPage}
            />
            <Route
              exact
              path={`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/:jobId`}
              component={ReviewMyAwardedJobAndWinningBidPage}
            />
            <Route exact path={ROUTES.CLIENT.BIDDER.mybids} component={MyBidsPage} />
            <Route
              exact
              path={`${ROUTES.CLIENT.BIDDER.reviewMyBidAndTheRequestDetails}/:bidId`}
              component={ReviewBidAndRequestPage}
            />
            <Route
              exact
              path={`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/:bidId`}
              component={ReviewAwardedBidPage}
            />
            <Route exact path={ROUTES.CLIENT.MY_PROFILE.basicSettings} component={MyProfile} />
            <Route
              exact
              path={ROUTES.CLIENT.MY_PROFILE.paymentSettings}
              component={PaymentSettings}
            />
            <Route exact path={`${ROUTES.CLIENT.VERIFICATION}`} component={VerificationPage} />
            <Route exact path={`${ROUTES.CLIENT.MYAGENDA}`} component={MyAgenda} />
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
        <footer className="footer">
          <nav className="level">
            <div className="level-item has-text-centered">
              <div>
                <div className="has-text-grey is-size-7">
                  <img
                    src="https://image.flaticon.com/icons/svg/753/753078.svg"
                    alt="BidOrBoo"
                    style={{ WebkitFilter: 'grayscale(100%)', filter: 'grayscale(100%)' }}
                    width={21}
                    height={21}
                  />
                  {` BidOrBoo`}
                </div>
                <div className="has-text-grey is-size-7">Registration #: xxx-xxx-xxx</div>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="has-text-grey is-size-7">Terms Of Service</p>
                <a
                  className="is-size-7 button is-text"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="bidorbooserviceAgreement"
                >
                  {`BidOrBoo Terms`}
                </a>
                {` & `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://stripe.com/connect-account/legal"
                  className="is-size-7 button is-text"
                >
                  {`Stripe Terms`}
                </a>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="has-text-grey is-size-7">Availablility</p>
                <div className="is-size-7">
                  <img
                    width={21}
                    height={21}
                    alt="Canada"
                    style={{ WebkitFilter: 'grayscale(100%)', filter: 'grayscale(100%)' }}
                    src="https://static.gikacoustics.com/wp-content/uploads/2017/09/Canada-flag-round.png"
                  />
                </div>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="has-text-grey is-size-7">Contact Us</p>
                <div className="has-text-grey is-size-7">Address : xyz rd, ON, Canada</div>
                <div className="has-text-grey is-size-7">phone: 123-123-1234</div>
                <div className="has-text-grey is-size-7">email: bidorboocrew@gmail.com</div>
              </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
