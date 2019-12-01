import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { registerNewUser, bidOrBooLogin } from '../../app-state/actions/authActions';
import LocalLoginForm from '../../components/forms/LocalLoginForm.jsx';
import RegistrationForm from '../../components/forms/RegistrationForm.jsx';
import { CoolBidOrBooTitle } from '../commonComponents.jsx';
export class LoginOrRegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRegistrationForm: false,
      isLoggedIn: props.isLoggedIn || false,
      redirectedFromUrl: props.redirectedFromUrl || '/',
    };
  }

  setShowRegistrationForm = () => {
    this.setState({ showRegistrationForm: true });
  };
  setShowLoginForm = () => {
    this.setState({ showRegistrationForm: false });
  };

  render() {
    const { registerNewUser, bidOrBooLogin } = this.props;
    const { showRegistrationForm, redirectedFromUrl, isLoggedIn } = this.state;

    const googleAuthPath = `${ROUTES.API.AUTH.GOOGLE}/?originPath=${redirectedFromUrl}`;
    const facebookAuthPath = `${ROUTES.API.AUTH.FACEBOOK}/?originPath=${redirectedFromUrl}`;

    if (isLoggedIn) {
      // your logged in, why are you here?
      return switchRoute(ROUTES.CLIENT.HOME);
    }

    return (
      <div className="columns is-centered is-multiline slide-in-right">
        <div className="column limitLargeMaxWidth">
          <div>
            <CoolBidOrBooTitle></CoolBidOrBooTitle>

            <div
              style={{ height: 'unset' }}
              className="card cardWithButton limitLargeMaxWidth nofixedwidth"
            >
              <div className="content">
                <div style={{ background: 'white' }}>
                  <div className="tabs is-medium is-centered is-fullwidth">
                    <ul className="loginOrSignup">
                      <li
                        className={`${
                          showRegistrationForm ? '' : 'is-active has-text-weight-semibold'
                        }`}
                      >
                        <a onClick={this.setShowLoginForm}>
                          <span>Login now</span>
                        </a>
                      </li>
                      <li
                        className={`${
                          showRegistrationForm ? 'is-active has-text-weight-semibold' : ''
                        }`}
                      >
                        <a onClick={this.setShowRegistrationForm}>
                          <span>(Sign up)</span>
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
                              <a>login via social media</a>
                            </li>
                          </ul>
                        </div>
                        <a
                          rel="noopener noreferrer"
                          className="button is-danger is-inline-flex"
                          href={googleAuthPath}
                          style={{ borderRadius: 0, margin: 8, width: 160 }}
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
                          style={{ borderRadius: 0, margin: 8, width: 160 }}
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
                              <a>or login with your email</a>
                            </li>
                          </ul>
                        </div>
                        <div style={{ marginLeft: 24 }}>
                          <LocalLoginForm
                            originPath={redirectedFromUrl}
                            onSubmit={(vals) => {
                              bidOrBooLogin(vals);
                            }}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {showRegistrationForm && (
                    <>
                      <div className="has-text-centered">
                        <div className="tabs is-small is-centered">
                          <ul>
                            <li>
                              <a>Join via social media</a>
                            </li>
                          </ul>
                        </div>
                        <a
                          rel="noopener noreferrer"
                          className="button is-danger is-inline-flex"
                          href={googleAuthPath}
                          style={{ borderRadius: 0, margin: 8, width: 160 }}
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
                          style={{ borderRadius: 0, margin: 8, width: 160 }}
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
                              <a>Register With BidOrBoo</a>
                            </li>
                          </ul>
                        </div>
                        <div style={{ marginLeft: 24 }} className="has-text-left">
                          <RegistrationForm
                            originPath={redirectedFromUrl}
                            onSubmit={registerNewUser}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bidOrBooLogin: bindActionCreators(bidOrBooLogin, dispatch),
    registerNewUser: bindActionCreators(registerNewUser, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(LoginOrRegisterPage);
