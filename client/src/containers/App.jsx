import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { withRouter, Redirect } from 'react-router';
import { getCurrentUser, onLogout } from '../app-state/actions/authActions';
import { showLoginDialog, toggleSideNav } from '../app-state/actions/uiActions';

import * as ROUTES from '../constants/route_const';

import {
  Header,
  HomePage,
  ProposerContainer,
  BidderContainer,
  UserProfileContainer
} from './index';
import { SideBar, Overlay } from '../components';

import './styles/app.css';

class App extends React.Component {
  static propTypes = {
    s_isSideNavOpen: PropTypes.bool.isRequired,
    s_currentRoute: PropTypes.string,
    a_getCurrentUser: PropTypes.func.isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_toggleSideNav: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired
  };

  componentDidMount() {
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
    const {
      s_isSideNavOpen,
      s_isLoggedIn,
      s_userDetails,
      a_onLogout,
      a_showLoginDialog,
      a_toggleSideNav
    } = this.props;

    return (
      <div id="bidorboo-root-view">
        {/* we will make our notifications absolute positioned  */}
        <div id="bidorboo-notification" />
        {/* we will make progress absolutely positioned */}
        <div id="bidorboo-progress" />
        {/* for blocking Entire UI */}
        <div id="block-ui-overlay" />
        {s_isSideNavOpen && <Overlay onCloseHandler={a_toggleSideNav} />}
        {/* for modal dialogs  */}
        <div id="global-modal-dialog" />

        <div id="app-flex-wrapper">
          {s_isSideNavOpen && (
            <SideBar
              userDetails={s_userDetails}
              isUserLoggedIn={s_isLoggedIn}
              onLogout={a_onLogout}
              onshowLoginDialog={a_showLoginDialog}
              actionList={[]}
            />
          )}
          <div id="header-and-content">
            <Header id="bidorboo-header" />
            <div id="main-view">
              <Switch>
                <Route
                  exact
                  path={ROUTES.FRONTENDROUTES.ENTRY}
                  component={HomePage}
                />
                <Route
                  exact
                  path={ROUTES.FRONTENDROUTES.HOME}
                  component={HomePage}
                />
                <Route
                  exact
                  path={ROUTES.FRONTENDROUTES.PROPOSER}
                  component={ProposerContainer}
                />
                <Route
                  exact
                  path={ROUTES.FRONTENDROUTES.BIDDER}
                  component={BidderContainer}
                />
                <ProtectedRoute
                  isLoggedIn={s_isLoggedIn}
                  exact
                  path={ROUTES.FRONTENDROUTES.MY_PROFILE}
                  component={UserProfileContainer}
                />
                {/* redirect any unknown route to the home component */}
                <Route path="*" component={HomePage} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ uiReducer, authReducer, routerReducer }) => {
  return {
    s_isSideNavOpen: uiReducer.isSideNavOpen,
    s_currentRoute: routerReducer.currentRoute,
    s_isLoggedIn: authReducer.isLoggedIn,
    s_userDetails: authReducer.userDetails
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_onLogout: bindActionCreators(onLogout, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_toggleSideNav: bindActionCreators(toggleSideNav, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

/**
 * this will ensure that you dont enter a route unless you are auth
 * good for profile
 * @param {*}
 */
const ProtectedRoute = ({ isloggedIn, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isloggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={ROUTES.FRONTENDROUTES.ENTRY} />
        )
      }
    />
  );
};
