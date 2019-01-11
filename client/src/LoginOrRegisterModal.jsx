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
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">BidOrBoo</p>
            <button onClick={handleCancel} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <div className="tabs is-centered is-medium">
              <ul>
                <li className={`${showRegistrationForm ? '' : 'is-active'}`}>
                  <a onClick={this.setShowLoginForm}>
                    <span>Login</span>
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
                <LocalLoginForm originPath={currentPage} onSubmit={a_bidOrBooLogin} />
                <br />
                <div className="has-text-centered">
                  <h1 className="is-size-6">via social media</h1>

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
              <RegistrationForm originPath={currentPage} onSubmit={a_registerNewUser} />
            )}
          </section>
          <footer className="modal-card-foot">
            <button onClick={handleCancel} className="button">
              Cancel
            </button>
          </footer>
        </div>
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
