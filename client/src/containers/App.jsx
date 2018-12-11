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
  PostedJobs,
  BidderRoot,
  MyProfile,
  BidNow,
  MyBids,
  CurrentJob,
  CurrentPostedBid,
  MyAwardedBids,
  AwardedJobs,
  CurrentAwardedJob,
  CurrentAwardedBid,
  NewPostedJob,
} from './index';

import WebPush from '../WebPush';
import { payloadFromSubscription } from '../utils';
const applicationServerPublicKey =
  'BNNIelsxMdODKuerQ6A28c0ASnc0YP7BygBjuTkR0qRgRSJXOonCx5Juk2VZgOLmiAbTl04zER-AbdRScMOzYfE';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriveUserEnabled: true,
      subscription: { endpoint: '' },
    };

    this.onUpdateSubscriptionOnServer = this.onUpdateSubscriptionOnServer.bind(this);
    this.onSubscriptionFailed = this.onSubscriptionFailed.bind(this);
  }

  onUpdateSubscriptionOnServer(subscription) {
    console.log('onUpdateSubscriptionOnServer:', subscription);
    var payload = payloadFromSubscription(subscription);
    console.log('payload:', JSON.stringify(payload));
    this.setState({ subscription: subscription });
  }

  onSubscriptionFailed(error) {
    console.log('onSubscriptionFailed:', error);
  }

  componentDidMount() {
    // just remvoe a loading indicator till app is loaded
    // document.getElementById('fullscreen-preloader') &&
    //   document.getElementById('fullscreen-preloader').remove();

    this.props.a_getCurrentUser();
  }

  componentDidCatch(error, info) {
    console.log('bdb error details ' + error);
    console.log('failure info ' + info);
  }
  render() {
    const { s_toastDetails } = this.props;
    return (
      <div id="bidorboo-root-view">
        <WebPush
          subscriveUserEnabled={this.state.subscriveUserEnabled}
          applicationServerPublicKey={applicationServerPublicKey}
          onSubscriptionFailed={this.onSubscriptionFailed}
          onUpdateSubscriptionOnServer={this.onUpdateSubscriptionOnServer}
        />
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
          {/* redirect and force login */}
          <Route exact path={ROUTES.CLIENT.ENTRY} component={HomePage} />
          {/* redirect and force login */}
          <Route exact path={ROUTES.CLIENT.HOME} component={HomePage} />
          {/* redirect and force login */}
          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.root}/:showLoginDialog`}
            component={ProposerRoot}
          />
          {/* unprotected routes user is allowed to enter without logging in */}
          <Route exact path={ROUTES.CLIENT.PROPOSER.root} component={ProposerRoot} />
          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.createjob}/:templateId`}
            component={CreateAJob}
          />
          {/* protected routes , user will be redirected to corresponding root route and asked to login */}
          <Route exact path={ROUTES.CLIENT.PROPOSER.myOpenJobs} component={PostedJobs} />
          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.selectedPostedJobPage}/:jobId`}
            component={CurrentJob}
          />
          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.newlyPostedJob}/:jobId`}
            component={NewPostedJob}
          />
          {/* <Route exact path={ROUTES.CLIENT.PROPOSER.awardedJobsPage} component={AwardedJobs} /> */}
          <Route
            exact
            path={`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/:jobId`}
            component={CurrentAwardedJob}
          />

          {/* redirect and force login */}
          <Route
            exact
            path={`${ROUTES.CLIENT.BIDDER.root}/:showLoginDialog`}
            component={BidderRoot}
          />
          {/* unprotected routes user is allowed to enter without logging in */}
          <Route exact path={ROUTES.CLIENT.BIDDER.root} component={BidderRoot} />
          <Route exact path={ROUTES.CLIENT.BIDDER.bidNow} component={BidNow} />
          {/* protected routes , user will be redirected to corresponding root route and asked to login */}
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
          {/* <Route exact path={ROUTES.CLIENT.BIDDER.myAwardedBids} component={MyAwardedBids} /> */}
          <Route exact path={ROUTES.CLIENT.MY_PROFILE} component={MyProfile} />
          {/* redirect any unknown route to the home component */}
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
