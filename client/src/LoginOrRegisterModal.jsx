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
    const { isActive, handleCancel, isLoggedIn, registerNewUser, bidOrBooLogin } = this.props;
    const { showRegistrationForm } = this.state;

    const currentPage = `${window.location.pathname || '/'}`;
    const googleAuthPath = `${ROUTES.API.AUTH.GOOGLE}/?originPath=${currentPage}`;
    const facebookAuthPath = `${ROUTES.API.AUTH.FACEBOOK}/?originPath=${currentPage}`;

    return isActive && !isLoggedIn ? (
      <div className="modal is-active">
        <div onClick={handleCancel} className="modal-background" />
        <div className="modal-content">
          <div style={{ background: 'white', padding: '0 1rem 1rem' }}>
            <div className="tabs is-centered">
              <ul>
                <li className={`${showRegistrationForm ? '' : 'is-active'}`}>
                  <a onClick={this.setShowLoginForm}>
                    <span>Login</span>
                  </a>
                </li>
                <li className={`${showRegistrationForm ? 'is-active' : ''}`}>
                  <a onClick={this.setShowRegistrationForm}>
                    <span>Sign Up</span>
                  </a>
                </li>
              </ul>
            </div>
            {!showRegistrationForm && (
              <React.Fragment>
                <div className="has-text-centered">
                  <div className="tabs is-small is-centered">
                    <ul>
                      <li>
                        <a>login/Join us via social media</a>
                      </li>
                    </ul>
                  </div>
                  <a
                    rel="noopener noreferrer"
                    className="button is-danger is-inline-flex"
                    href={googleAuthPath}
                    style={{ margin: 8, width: 160 }}
                  >
                    <span className="icon">
                      <i className="fab fa-google" />
                    </span>
                    <span>Using Google</span>
                  </a>

                  <a
                    rel="noopener noreferrer"
                    href={facebookAuthPath}
                    className="button is-link is-inline-flex"
                    style={{ margin: 8, width: 160 }}
                  >
                    <span className="icon">
                      <i className="fab fa-facebook-square" />
                    </span>
                    <span>Using Facebook</span>
                  </a>
                </div>
                <div style={{ marginTop: 12 }} className="has-text-centered">
                  <div className="tabs is-small is-centered">
                    <ul>
                      <li>
                        <a>already a ? login here</a>
                      </li>
                    </ul>
                  </div>
                  <LocalLoginForm
                    originPath={currentPage}
                    onSubmit={(vals) => {
                      bidOrBooLogin(vals);
                      handleCancel();
                    }}
                  />
                </div>
              </React.Fragment>
            )}
            {showRegistrationForm && (
              <RegistrationForm
                originPath={currentPage}
                onSubmit={(vals) => {
                  registerNewUser(vals);
                  handleCancel();
                }}
              />
            )}
          </div>
        </div>
        <button onClick={handleCancel} class="modal-close is-large" aria-label="close" />
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
    bidOrBooLogin: bindActionCreators(bidOrBooLogin, dispatch),
    registerNewUser: bindActionCreators(registerNewUser, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginOrRegisterModal);
