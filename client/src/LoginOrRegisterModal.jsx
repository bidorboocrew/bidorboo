import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ROUTES from './constants/frontend-route-consts';
import LocalLoginForm from './components/forms/LocalLoginForm';
import RegistrationForm from './components/forms/RegistrationForm';

import { registerNewUser, bidOrBooLogin } from './app-state/actions/authActions';

export class LoginOrRegisterModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRegistrationForm: false,
    };
  }

  setShowRegistrationForm = () => {
    this.setState({ showRegistrationForm: true });
  };
  setShowLoginForm = () => {
    this.setState({ showRegistrationForm: false });
  };

  render() {
    const { isActive, handleCancel, isLoggedIn, a_registerNewUser, a_bidOrBooLogin } = this.props;
    const { showRegistrationForm } = this.state;

    const currentPage = `${window.location.pathname || '/'}`;
    const googleAuthPath = `${ROUTES.API.AUTH.GOOGLE}/?originPath=${currentPage}`;
    const facebookAuthPath = `${ROUTES.API.AUTH.FACEBOOK}/?originPath=${currentPage}`;

    return isActive && !isLoggedIn ? (
      <div className="modal is-active">
        <div onClick={handleCancel} className="modal-background" />

        <div className="modal-content">
          <div class="card">
            <div class="card-content">
              <div className="tabs is-centered is-medium is-boxed">
                <ul>
                  <li className={`${showRegistrationForm ? '' : 'is-active'}`}>
                    <a onClick={this.setShowLoginForm}>
                      <span>Existing User Login</span>
                    </a>
                  </li>
                  <li className={`${showRegistrationForm ? 'is-active' : ''}`}>
                    <a onClick={this.setShowRegistrationForm}>
                      <span>Register Now</span>
                    </a>
                  </li>
                </ul>
              </div>
              {!showRegistrationForm && (
                <React.Fragment>
                  <LocalLoginForm
                    originPath={currentPage}
                    onSubmit={(vals) => {
                      a_bidOrBooLogin(vals);
                      handleCancel();
                    }}
                  />
                  <br />
                  <div className="has-text-centered">
                    <h1 className="is-size-6">OR login via social media</h1>
                    <br />

                    <a
                      rel="noopener noreferrer"
                      className="button is-danger is-inline-flex"
                      href={googleAuthPath}
                      style={{ marginTop: 8, marginRight: 4 }}
                    >
                      <span className="icon">
                        <i className="fab fa-google" />
                      </span>
                      <span>login using Google</span>
                    </a>

                    <a
                      rel="noopener noreferrer"
                      href={facebookAuthPath}
                      className="button is-link is-inline-flex"
                      style={{ marginTop: 8, marginLeft: 4 }}
                    >
                      <span className="icon">
                        <i className="fab fa-facebook-square" />
                      </span>
                      <span>login using Facebook</span>
                    </a>
                  </div>
                </React.Fragment>
              )}
              {showRegistrationForm && (
                <RegistrationForm
                  originPath={currentPage}
                  onSubmit={(vals) => {
                    a_registerNewUser(vals);
                    handleCancel();
                  }}
                />
              )}{' '}
            </div>
          </div>
        </div>
        <button class="modal-close is-large" onClick={handleCancel} aria-label="close" />
      </div>
    ) : null;
  }
}

const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_bidOrBooLogin: bindActionCreators(bidOrBooLogin, dispatch),
    a_registerNewUser: bindActionCreators(registerNewUser, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginOrRegisterModal);
