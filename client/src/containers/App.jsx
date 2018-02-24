import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { withRouter, Redirect } from 'react-router';
import { onLoginGoogle,
  onLogout } from '../app-state/actions/authActions';
import * as ROUTES from '../route_const';

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
  componentDidMount() {
    this.props.a_onLoginGoogle();
  }
  componentWillReceiveProps(nextProps) {
    //this is used mostly to redirect user to the login page
    if (
      this.props.s_currentRoute !== nextProps.s_currentRoute &&
      nextProps.s_currentRoute === '/login'
    ) {
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
      s_currentRoute,
      a_onLoginGoogle,
      onLogout
    } = this.props;

    return (
      <div id="bidorboo-root-view">
        {/* we will make our notifications absolute positioned  */}
        <div id="bidorboo-notification" />
        {/* we will make progress absolutely positioned */}
        <div id="bidorboo-progress" />
        {/* for blocking Entire UI */}
        <div id="block-ui-overlay" />
        {/* for modal dialogs  */}
        <div id="modal-dialog" />

        <div id="app-flex-wrapper">
          {s_isSideNavOpen && (
            <SideBar loginAction={a_onLoginGoogle} actionList={[]} />
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
                <Route
                  exact
                  path={ROUTES.FRONTENDROUTES.MY_PROFILE}
                  component={UserProfileContainer}
                />
                {/* redirect any unknown route to the home component */}
                <Route path="*" component={HomePage} />
                <ProtectedRoute exact path={ROUTES.FRONTENDROUTES.MY_PROFILE} />
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
    s_currentRoute: routerReducer.pathname
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_onLoginGoogle: bindActionCreators(onLoginGoogle, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

/**
 * this will ensure that you dont enter a route unless you are auth
 * good for profile
 * @param {*}
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      props.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to={ROUTES.FRONTENDROUTES.ENTRY} />
      )
    }
  />
);
