import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';
import logoImg from '../../assets/images/android-chrome-192x192.png';
import SetupYourProfileFormSteps from './SetupYourProfileFormSteps';

const Steps = {
  enterEmail: 'enterEmail',
  enterVerificationCode: 'enterVerificationCode',
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
  sendVerificationCodeToEmail = () => {
    const { emailAddress } = this.state;

    const isValidEmail =
      emailAddress && emailAddress.length > 3 && re.test(String(emailAddress).toLowerCase());

    if (isValidEmail) {
      this.setState(
        () => ({ step: Steps.enterVerificationCode }),
        () => {
          // do some axios call to send verification code
        },
      );
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
    const { password1, password2 } = this.state;

    const isValidPassword =
      password1 &&
      password1.length > 6 &&
      password2 &&
      password2.length > 6 &&
      password1 === password2;

    if (isValidPassword) {
      // some axios call with status success or not
      const passwordUpdated = true;
      if (passwordUpdated) {
        this.setState({ showLoginNow: true });
      } else {
        // show error
        this.setState({ showOopsSomethingWentWrong: true });
      }
    } else {
      this.setState({ isValidPassword: false });
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
                    <p className="subtitle has-text-succes">
                      Your password was updated successfully
                    </p>
                    <div>
                      please click the login button in our application bar and use your new
                      credentials to login
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
                        Enter your email address that's associated with your BIDORBOO account
                      </label>
                      <input
                        value={emailAddress}
                        type="email"
                        onChange={(e) => {
                          this.setState({ emailAddress: e.target.value });
                        }}
                        style={{ flexGrow: 1, borderRadius: 0 }}
                        className={`input ${isValidEmail ? '' : 'is-danger'}`}
                        placeholder="type your email address..."
                      />
                      {!isValidEmail && (
                        <div className="help has-text-danger">
                          *invalid email address, must be something like google@gmail.com
                        </div>
                      )}
                    </div>
                    <button
                      className="button is-success"
                      onClick={this.sendVerificationCodeToEmail}
                    >
                      Send Verification Code
                    </button>
                    <div className="help">
                      *a verification code will be sent to the email address you've set
                    </div>
                  </div>
                )}

                {!showLoginNow &&
                  !showOopsSomethingWentWrong &&
                  step === Steps.enterVerificationCode && (
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
                          style={{ flexGrow: 1, borderRadius: 0 }}
                          className={`input ${isValidVerificationCode ? '' : 'is-danger'}`}
                          placeholder="enter verification code..."
                        />
                        {!isValidVerificationCode && (
                          <div className="help has-text-danger">
                            *invalid verification code. Please check your email
                          </div>
                        )}
                      </div>
                      <button className="button is-success" onClick={this.submitVerificationCode}>
                        SUBMIT
                      </button>
                      <div className="help">*Make sure to check your junk folder just in case</div>
                      <div className="help">
                        *You can always chat with our customer support at the bottom using the chat
                        button in the footer
                      </div>
                    </div>
                  )}

                {!showLoginNow && !showOopsSomethingWentWrong && step === Steps.enterNewPassword && (
                  <div>
                    <p>Enter a new password for {`${emailAddress}`}</p>
                    <div className={`group`}>
                      <label className="label">Enter Password</label>
                      <input
                        value={password1}
                        type="password"
                        onChange={(e) => {
                          this.setState({ password1: e.target.value });
                        }}
                        style={{ flexGrow: 1, borderRadius: 0 }}
                        className={`input ${isValidPassword ? '' : 'is-danger'}`}
                        placeholder="enter verification code..."
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
                        style={{ flexGrow: 1, borderRadius: 0 }}
                        className={`input ${isValidPassword ? '' : 'is-danger'}`}
                        placeholder="enter verification code..."
                      />
                    </div>

                    {!isValidPassword && (
                      <div className="help has-text-danger">
                        *Invalid password, please make sure the password is longer than 6 chars and
                        are an exact match
                      </div>
                    )}

                    <button className="button is-success" onClick={this.submitNewPassword}>
                      Update password
                    </button>
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

const mapStateToProps = ({ userReducer, uiReducer }) => {
  const { userDetails } = userReducer;
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // resetPassword: bindActionCreators(resetPassword, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetLocalPassword);
