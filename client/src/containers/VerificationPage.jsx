import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { showLoginDialog } from '../app-state/actions/uiActions';

import { Spinner } from '../components/Spinner';
import { verifyEmail, verifyPhone } from '../app-state/actions/authActions';

class VerificationPage extends React.Component {
  componentDidMount() {
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) {
      showLoginDialog(true);
    } else {
      showLoginDialog(false);
    }
  }

  componentDidUpdate(prevProps) {
    debugger;
    const { match, isLoggedIn, verifyPhone, verifyEmail } = this.props;
    if (isLoggedIn && prevProps.isLoggedIn !== isLoggedIn) {
      const { code, field } = match.params;
      if (!code || !field) {
        switchRoute(`${ROUTES.CLIENT.HOME}`);
      } else {
        switch (field) {
          case 'Email':
            verifyEmail(code);
            break;
          case 'Phone':
            verifyPhone(code);
            break;
          default:
            switchRoute(`${ROUTES.CLIENT.MY_PROFILE.basicSettings}`);
            break;
        }
      }
    }
  }

  render() {
    const { match } = this.props;
    const { field } = match.params;

    return (
      <div className="container is-widescreen">
        <section className="section hero has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">{`${field} Verification`}</h1>
            </div>
          </div>
        </section>
        <section>
          <Spinner isLoading={true} size={'large'} />
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    shouldShowLoginDialog: uiReducer.shouldShowLoginDialog,
    verifyingPhoneInProgress: userReducer.verifyingPhone,
    verifyingEmailInProgress: userReducer.verifyingEmail,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    verifyEmail: bindActionCreators(verifyEmail, dispatch),
    verifyPhone: bindActionCreators(verifyPhone, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerificationPage);
