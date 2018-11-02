import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
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
  CurrentJob,
  CurrentPostedBid,
  ActiveAwardedBids,
  ActiveAwardedJobs,
  CurrentAwardedJob,
} from './index';

class App extends React.Component {
  static propTypes = {
    toastDetails: PropTypes.shape({
      type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
      msg: PropTypes.string,
      toastId: PropTypes.string,
    }),
    a_getCurrentUser: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // just remvoe a loading indicator till app is loaded
    document.getElementById('fullscreen-preloader') &&
      document.getElementById('fullscreen-preloader').remove();

    this.props.a_getCurrentUser();
  }

  componentDidCatch(error, info) {
    console.log('bdb error details ' + error);
    console.log('failure info ' + info);
  }
  render() {
    const { s_isLoggedIn, s_toastDetails } = this.props;

    return (
      <div id="bidorboo-root-view">
        <Toast toastDetails={s_toastDetails} />
        <div id="app-flex-wrapper">
          <div id="header-and-content">
            <Header id="bidorboo-header" />
            <div id="main-view">
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
                <Route exact path={ROUTES.CLIENT.PROPOSER.myjobs} component={MyJobs} />
                <Route
                  exact
                  path={ROUTES.CLIENT.PROPOSER.selectedPostedJobPage}
                  component={CurrentJob}
                />
                <Route
                  exact
                  path={ROUTES.CLIENT.PROPOSER.awardedJobsPage}
                  component={ActiveAwardedJobs}
                />
                 <Route
                  exact
                  path={ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}
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
                  path={ROUTES.CLIENT.BIDDER.currentPostedBid}
                  component={CurrentPostedBid}
                />
                <Route
                  exact
                  path={ROUTES.CLIENT.BIDDER.activeBidsPage}
                  component={ActiveAwardedBids}
                />
                <Route exact path={ROUTES.CLIENT.MY_PROFILE} component={MyProfile} />
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
const mapStateToProps = ({ authReducer, uiReducer }) => {
  return {
    s_isLoggedIn: authReducer.isLoggedIn,
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
    mapDispatchToProps
  )(App)
);

/**
 * this will ensure that you dont enter a route unless you are auth
 * good for profile
 * @param {*}
 */
// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         const { isLoggedIn, redirectWhenNotLoggedIn } = { ...rest };
//         return isLoggedIn ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to={`${redirectWhenNotLoggedIn || ROUTES.CLIENT.HOME}/true`} />
//         );
//       }}
//     />
//   );
// };
