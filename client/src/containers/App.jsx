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
  // MyStats,
  VerificationPage,
  ProposerRootPage,
  CreateAJobPage,
  MyOpenJobsPage,
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
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            backgroundColor: '#23d160',
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
                  <p>Requester View</p>
                </div>
              )}

              {userAppView === 'BIDDER' && (
                <div className="VerticalAligner title " id="bidorboo-switch-role">
                  <p>Tasker View</p>
                </div>
              )}
            </React.Fragment>
          )}
        <Header id="bidorboo-header" />
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
          <Route exact path={ROUTES.CLIENT.BIDDER.BidOnJobPage} component={BidOnJobPage} />
          <Route
            exact
            path={`${ROUTES.CLIENT.USER_ROFILE_FOR_REVIEW}`}
            component={OtherUserProfileForReviewPage}
          />
          {/* loggedInPaths paths */}

          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.myOpenJobs}/:tabId`}
            component={MyOpenJobsPage}
          />
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

          <Redirect path="*" to={ROUTES.CLIENT.HOME} />
        </Switch>
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
