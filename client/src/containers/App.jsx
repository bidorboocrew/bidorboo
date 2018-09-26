import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { withRouter, Redirect } from 'react-router';
import LoadingBar from 'react-redux-loading-bar';
// import AdSense from 'react-adsense';
import Toast from '../components/Toast';

import * as ROUTES from '../constants/frontend-route-consts';
import { getCurrentUser } from '../app-state/actions/authActions';

import '../assets/index.css';

import {
  Header,
  HomePage,
  ProposerRoot,
  CreateAJob,
  MyJobs,
  BidderRoot,
  MyProfile,
  BidNow,
  MyBids,
  CurrentAddedJob,
  CurrentPostedBid
} from './index';

class App extends React.Component {
  static propTypes = {
    s_currentRoute: PropTypes.string,
    toastDetails: PropTypes.shape({
      type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
      msg: PropTypes.string,
      toastId: PropTypes.string
    }),
    a_getCurrentUser: PropTypes.func.isRequired
  };

  componentDidMount() {
    // just remvoe a loading indicator till app is loaded
    document.getElementById('fullscreen-preloader') &&
      document.getElementById('fullscreen-preloader').remove();

    this.props.a_getCurrentUser();
  }
  componentWillReceiveProps(nextProps) {
    //this is used mostly to redirect user to the login page
    if (this.props.s_currentRoute !== nextProps.s_currentRoute) {
      this.props.history.push(nextProps.s_currentRoute);
    }
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    console.log('bdb error details ' + error);
    console.log('failure info ' + info);
  }
  render() {
    const { s_isLoggedIn, s_toastDetails } = this.props;

    return (
      <div id="bidorboo-root-view">
        {/* we will make our notifications absolute positioned  */}
        <div id="bidorboo-notification" />
        {/* we will make progress absolutely positioned */}
        <Toast toastDetails={s_toastDetails} />
        <div id="bidorboo-progress" />
        {/* for blocking Entire UI */}
        <div id="block-ui-overlay" />
        {/* for modal dialogs  */}
        <div id="global-modal-dialog" />
        <div id="app-flex-wrapper">
          <div id="header-and-content">
            <Header id="bidorboo-header" />
            <section>
              <LoadingBar
                style={{
                  zIndex: 10001,
                  backgroundColor: '#622c8c',
                  height: '2px'
                }}
              />
            </section>
            <div id="main-view">
              <Switch>
                {/* redirect and force login */}
                <Route
                  exact
                  path={ROUTES.CLIENT.ENTRY}
                  component={HomePage}
                />
                {/* redirect and force login */}
                <Route
                  exact
                  path={ROUTES.CLIENT.HOME}
                  component={HomePage}
                />
                {/* redirect and force login */}
                <Route
                  exact
                  path={`${
                    ROUTES.CLIENT.PROPOSER.root
                  }/:showLoginDialog`}
                  component={ProposerRoot}
                />
                {/* unprotected routes user is allowed to enter without logging in */}
                <Route
                  exact
                  path={ROUTES.CLIENT.PROPOSER.root}
                  component={ProposerRoot}
                />
                <Route
                  exact
                  path={`${
                    ROUTES.CLIENT.PROPOSER.createjob
                  }/:templateId`}
                  component={CreateAJob}
                />
                {/* protected routes , user will be redirected to corresponding root route and asked to login */}
                <ProtectedRoute
                  isLoggedIn={s_isLoggedIn}
                  exact
                  path={ROUTES.CLIENT.PROPOSER.myjobs}
                  redirectWhenNotLoggedIn={ROUTES.CLIENT.PROPOSER.root}
                  component={MyJobs}
                />
                <ProtectedRoute
                  isLoggedIn={s_isLoggedIn}
                  exact
                  path={ROUTES.CLIENT.PROPOSER.currentPostedJob}
                  redirectWhenNotLoggedIn={ROUTES.CLIENT.PROPOSER.root}
                  component={CurrentAddedJob}
                />
                {/* redirect and force login */}
                <Route
                  exact
                  path={`${ROUTES.CLIENT.BIDDER.root}/:showLoginDialog`}
                  component={BidderRoot}
                />
                {/* unprotected routes user is allowed to enter without logging in */}
                <Route
                  isLoggedIn={s_isLoggedIn}
                  exact
                  path={ROUTES.CLIENT.BIDDER.root}
                  component={BidderRoot}
                />
                <Route
                  isLoggedIn={s_isLoggedIn}
                  exact
                  path={ROUTES.CLIENT.BIDDER.bidNow}
                  component={BidNow}
                />
                {/* protected routes , user will be redirected to corresponding root route and asked to login */}
                <ProtectedRoute
                  isLoggedIn={s_isLoggedIn}
                  exact
                  path={ROUTES.CLIENT.BIDDER.mybids}
                  redirectWhenNotLoggedIn={ROUTES.CLIENT.BIDDER.root}
                  component={MyBids}
                />
                <ProtectedRoute
                  exact
                  isLoggedIn={s_isLoggedIn}
                  path={ROUTES.CLIENT.BIDDER.currentPostedBid}
                  redirectWhenNotLoggedIn={ROUTES.CLIENT.BIDDER.root}
                  component={CurrentPostedBid}
                />
                <ProtectedRoute
                  isLoggedIn={s_isLoggedIn}
                  exact
                  path={ROUTES.CLIENT.MY_PROFILE}
                  redirectWhenNotLoggedIn={ROUTES.CLIENT.HOME}
                  component={MyProfile}
                />
                {/* redirect any unknown route to the home component */}
                <Redirect path="*" to={ROUTES.CLIENT.HOME} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ authReducer, routerReducer, uiReducer }) => {
  return {
    s_currentRoute: routerReducer.currentRoute,
    s_isLoggedIn: authReducer.isLoggedIn,
    s_toastDetails: uiReducer.toastDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

/**
 * this will ensure that you dont enter a route unless you are auth
 * good for profile
 * @param {*}
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        const { isLoggedIn, redirectWhenNotLoggedIn } = { ...rest };
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={`${redirectWhenNotLoggedIn || ROUTES.CLIENT.HOME}/true`}
          />
        );
      }}
    />
  );
};
