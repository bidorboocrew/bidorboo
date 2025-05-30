import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getBugsnagClient } from '../../index';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import logoImg from '../../assets/images/android-icon-192x192.png';

const Steps = {
  enterEmail: 'enterEmail',
  enterNewPassword: 'enterNewPassword',
};
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class ResetLocalPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: Steps.enterEmail,
      emailAddress: '',
      isValidEmail: true,
      verificationCode: '',
      isValidVerificationCode: true,
      isValidPassword: true,
      password1: '',
      password2: '',
      showOopsSomethingWentWrong: false,
      showLoginNow: false,
    };
  }

  componentDidMount() {
    const { isLoggedIn } = this.props;

    isLoggedIn && switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings);
  }
  requestVerificationCode = async () => {
    const { emailAddress } = this.state;

    const isValidEmail =
      emailAddress && emailAddress.length > 3 && re.test(String(emailAddress).toLowerCase());

    if (isValidEmail) {
      const sendVerificationResp = await axios.post(
        ROUTES.API.USER.POST.loggedOutRequestEmailVerificationCode,
        {
          data: {
            emailAddress,
          },
        },
      );

      if (sendVerificationResp && sendVerificationResp.data && sendVerificationResp.data.success) {
        this.setState({ step: Steps.enterNewPassword });
      } else {
        this.setState({ showOopsSomethingWentWrong: true });
      }
    } else {
      this.setState({ isValidEmail: false });
    }
  };
  submitVerificationCode = async () => {
    const { verificationCode } = this.state;

    const isValidVerificationCode = verificationCode && verificationCode.length === 6;
    if (isValidVerificationCode) {
      // some axios call with status success or not
      const isCorrectCode = true;
      if (isCorrectCode) {
        this.setState({ step: Steps.enterNewPassword });
      } else {
        this.setState({ isValidVerificationCode: false });
      }
    } else {
      this.setState({ isValidVerificationCode: false });
    }
  };

  submitNewPassword = async () => {
    const { password1, password2, verificationCode, emailAddress } = this.state;

    const isValidEmail =
      emailAddress && emailAddress.length > 3 && re.test(String(emailAddress).toLowerCase());
    const isValidVerificationCode = verificationCode && verificationCode.length === 6;
    const isValidPassword =
      password1 &&
      password1.length > 6 &&
      password2 &&
      password2.length > 6 &&
      password1 === password2;

    if (isValidEmail && isValidPassword && isValidVerificationCode) {
      try {
        const updatePasswordResp = await axios.post(ROUTES.API.USER.POST.updateUserPassword, {
          data: {
            password1,
            password2,
            verificationCode,
            emailAddress,
          },
        });
        if (updatePasswordResp && updatePasswordResp.data && updatePasswordResp.data.success) {
          this.setState({ showLoginNow: true });
        } else {
          this.setState({ showOopsSomethingWentWrong: true });
        }
      } catch (e) {
        getBugsnagClient().leaveBreadcrumb('URGENT_failed to update password');
        getBugsnagClient().notify(e);
        this.setState({ showOopsSomethingWentWrong: true });
      }
    } else {
      this.setState({ isValidPassword, isValidPassword, isValidVerificationCode });
    }
  };
  render() {
    const {
      step,
      emailAddress,
      isValidEmail,
      verificationCode,
      isValidVerificationCode,
      isValidPassword,
      password1,
      password2,
      showOopsSomethingWentWrong,
      showLoginNow,
    } = this.state;

    return (
      <div className="columns is-multiline is-centered is-mobile">
        <div className="column limitLargeMaxWidth">
          <div>
            <section className="hero is-white">
              <div className="hero-body">
                <div className="container">
                  <div className="title has-text-grey">
                    <img
                      src={logoImg}
                      alt="BidOrBoo"
                      width="24"
                      height="24"
                      style={{ maxHeight: 'unset' }}
                    />
                    <span style={{ marginLeft: 4 }}>Reset Or Change Your Password</span>
                  </div>
                </div>
                {showLoginNow && (
                  <>
                    <p className="subtitle has-text-success has-text-weight-bold">
                      Your password was updated successfully
                    </p>
                    <div>You can now login using your new credentials</div>
                    <div>
                      <a
                        style={{
                          fontWeight: 500,
                          border: '1px solid #eee',
                          // boxShadow: 'none',
                          borderRadius: 25,
                        }}
                        className="button is-link is-small"
                        onClick={(e) => {
                          e.preventDefault();
                          switchRoute(ROUTES.CLIENT.LOGIN_OR_REGISTER, {
                            isLoggedIn: false,
                          });
                        }}
                      >
                        LOGIN
                      </a>
                    </div>
                  </>
                )}
                {showOopsSomethingWentWrong && (
                  <div className="subtitle has-text-danger">
                    Ooops Our apologies, something went wrong. Please use the Chat button in the
                    footer of this page to chat with our customer support
                  </div>
                )}
                {!showLoginNow && !showOopsSomethingWentWrong && step === Steps.enterEmail && (
                  <div>
                    <div className={`group`}>
                      <label className="label">
                        Enter your email address that's associated with your BidOrBoo account
                      </label>
                      <input
                        value={emailAddress}
                        type="email"
                        onChange={(e) => {
                          this.setState({ emailAddress: e.target.value });
                        }}
                        style={{ flexGrow: 1 }}
                        className={`input ${isValidEmail ? '' : 'is-danger'}`}
                        placeholder="type your email address..."
                      />
                      {!isValidEmail && (
                        <div className="help has-text-danger">
                          *invalid email address, must be something like google@gmail.com
                        </div>
                      )}
                    </div>
                    <button className="button is-success" onClick={this.requestVerificationCode}>
                      Send Verification Code
                    </button>
                    <div className="help">
                      *a verification code will be sent to the email address you've set
                    </div>
                  </div>
                )}

                {!showLoginNow && !showOopsSomethingWentWrong && step === Steps.enterNewPassword && (
                  <div>
                    <p>We've sent a verification code to {`${emailAddress}`}</p>
                    <div className={`group`}>
                      <label className="label">Enter the verification code</label>
                      <input
                        value={verificationCode}
                        type="number"
                        onChange={(e) => {
                          this.setState({ verificationCode: e.target.value });
                        }}
                        style={{ flexGrow: 1 }}
                        className={`input ${isValidVerificationCode ? '' : 'is-danger'}`}
                        placeholder="enter verification code..."
                      />
                      {!isValidVerificationCode && (
                        <div className="help has-text-danger">
                          *invalid verification code. Please check your email
                        </div>
                      )}
                      <div className="help">*check junk folder of your email just in case.</div>
                    </div>
                    <br></br>
                    <p>Enter a new password for {`${emailAddress}`}</p>
                    <div className={`group`}>
                      <label className="label">Enter Password</label>
                      <input
                        value={password1}
                        type="password"
                        onChange={(e) => {
                          this.setState({ password1: e.target.value });
                        }}
                        style={{ flexGrow: 1 }}
                        className={`input ${isValidPassword ? '' : 'is-danger'}`}
                        placeholder="Enter your new password..."
                      />
                    </div>

                    <div className={`group`}>
                      <label className="label">Confirm Password</label>
                      <input
                        value={password2}
                        type="password"
                        onChange={(e) => {
                          this.setState({ password2: e.target.value });
                        }}
                        style={{ flexGrow: 1 }}
                        className={`input ${isValidPassword ? '' : 'is-danger'}`}
                        placeholder="Enter the same password..."
                      />
                    </div>

                    {!isValidPassword && (
                      <div className="help has-text-danger">
                        *Invalid password, please make sure the password is longer than 6 chars and
                        are an exact match
                      </div>
                    )}

                    <button className="button is-success" onClick={this.submitNewPassword}>
                      Change Password
                    </button>

                    <div className="help">
                      *You can always chat with our customer support at the bottom using the chat
                      button in the footer
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps, null)(ResetLocalPassword);
