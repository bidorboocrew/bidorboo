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
  ProposerRoot,
  CreateAJob,
  MyOpenJobsPage,
  BidderRoot,
  MyProfile,
  BidNow,
  MyBids,
  ReviewRequestAndBidsPage,
  CurrentPostedBid,
  CurrentAwardedJob,
  CurrentAwardedBid,
  Verification,
} from './index';

class App extends React.Component {
  componentDidCatch(error, info) {
    console.log('bdb error details ' + error);
    console.log('failure info ' + info);
  }

  render() {
    const { s_toastDetails } = this.props;
    return (
      <div id="bidorboo-root-view">
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

        <Header id="bidorboo-header" />
        <Switch>
          <Route exact path={ROUTES.CLIENT.ENTRY} component={HomePage} />
          <Route exact path={ROUTES.CLIENT.HOME} component={HomePage} />
          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.root}/:showLoginDialog`}
            component={ProposerRoot}
          />

          {/* proposer related routes */}
          <Route exact path={ROUTES.CLIENT.PROPOSER.root} component={ProposerRoot} />
          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.createjob}/:templateId`}
            component={CreateAJob}
          />

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
            component={CurrentAwardedJob}
          />

          {/* proposer related routes */}
          <Route
            exact
            path={`${ROUTES.CLIENT.BIDDER.root}/:showLoginDialog`}
            component={BidderRoot}
          />
          <Route exact path={ROUTES.CLIENT.BIDDER.root} component={BidderRoot} />
          <Route exact path={ROUTES.CLIENT.BIDDER.bidNow} component={BidNow} />
          <Route exact path={ROUTES.CLIENT.BIDDER.mybids} component={MyBids} />
          <Route
            exact
            path={`${ROUTES.CLIENT.BIDDER.currentPostedBid}/:bidId`}
            component={CurrentPostedBid}
          />
          <Route
            exact
            path={`${ROUTES.CLIENT.BIDDER.currentAwardedBid}/:bidId`}
            component={CurrentAwardedBid}
          />
          <Route exact path={ROUTES.CLIENT.MY_PROFILE} component={MyProfile} />
          <Route exact path={`${ROUTES.CLIENT.VERIFICATION}`} component={Verification} />
          <Redirect path="*" to={ROUTES.CLIENT.HOME} />
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    s_isLoggedIn: userReducer.isLoggedIn,
    s_toastDetails: uiReducer.toastDetails,
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
