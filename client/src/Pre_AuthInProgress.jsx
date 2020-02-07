import { withRouter } from 'react-router-dom';
import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser } from './app-state/actions/authActions';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';
import { Spinner } from './components/Spinner';
import { Header } from './containers/index';

import Pre_LoggedOut_1_CheckValidRoutes from './Pre_LoggedOut_1_CheckValidRoutes';
import Pre_LoggedIn_1_HandleOnBoarding from './Pre_LoggedIn_1_HandleOnBoarding';

import {
  setAppViewUIToRequester,
  setAppViewUIToTasker,
  setServerAppRequesterView,
  setServerAppTaskerView,
} from './app-state/actions/uiActions';

class Pre_AuthInProgress extends React.PureComponent {
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
    const { getCurrentUser } = this.props;
    getCurrentUser();
  }

  componentDidUpdate(prevProps) {
    const { getCurrentUser } = this.props;

    if (window.location.pathname !== prevProps.location.pathname) {
      getCurrentUser();
    }
  }

  render() {
    const { authIsInProgress, isLoggedIn } = this.props;
    if (this.state.hasError) {
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
                <br />
                <a
                  onClick={(e) => {
                    window.location.href = 'https://www.bidorboo.ca';
                    window.location.reload();
                    return;
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

    if (authIsInProgress) {
      return <Spinner isLoading />;
    }

    if (!isLoggedIn) {
      return <Pre_LoggedOut_1_CheckValidRoutes {...this.props} />;
    } else if (isLoggedIn) {
      return <Pre_LoggedIn_1_HandleOnBoarding {...this.props} />;
    }

    return this.props.children;
  }
}
const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userReducer.userDetails,
    authIsInProgress: uiReducer.authIsInProgress,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    setAppViewUIToTasker: bindActionCreators(setAppViewUIToTasker, dispatch),
    setAppViewUIToRequester: bindActionCreators(setAppViewUIToRequester, dispatch),
    setServerAppRequesterView: bindActionCreators(setServerAppRequesterView, dispatch),
    setServerAppTaskerView: bindActionCreators(setServerAppTaskerView, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pre_AuthInProgress));
