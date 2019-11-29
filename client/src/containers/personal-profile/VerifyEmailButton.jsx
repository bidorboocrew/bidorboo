import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';

import * as ROUTES from '../../constants/frontend-route-consts';
import { verifyEmail } from '../../app-state/actions/authActions';

class VerifyEmailButton extends React.Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();
    this.state = {
      isResendingVCode: false,
      inputCodeContent: '',
      showEnterPinDialog: '',
    };
  }
  toggleEnterPinDialog = () => {
    this.setState({ showEnterPinDialog: !this.state.showEnterPinDialog });
  };

  handleSendNewCode = async () => {
    this.setState({ isResendingVCode: true }, async () => {
      try {
        const resendVerificationReq = await axios.post(
          ROUTES.API.USER.POST.resendVerificationEmail,
        );
        if (resendVerificationReq && resendVerificationReq.success) {
          alert('you should recieve an email shortly , please give 10-15 minutes');
        }
      } catch (e) {
        // some alert
        alert(
          'Unable to verify your email, please click the chat button on the right bottom corner of your creend or contact us bidorboo@bidorboo.com to resolve this',
        );
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      }
    });
  };
  render() {
    const { isResendingVCode, inputCodeContent, showEnterPinDialog } = this.state;
    const { verifyEmail, verifyingEmailInProgress } = this.props;

    return (
      <React.Fragment>
        <div className="button is-info is-small" onClick={this.toggleEnterPinDialog}>
          Verify Your Email
        </div>
        {showEnterPinDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleEnterPinDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Verify Your Email</div>
                  <button
                    onClick={this.toggleEnterPinDialog}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <div className="content">
                    <div>Enter the verification code that you've recieved in your email</div>
                    <br />
                    <div>
                      Getting verified is an important step in building trust between Requesters and
                      Taskers
                    </div>
                    <br />
                    <div className="group">
                      <label className="label">Enter Verification Code:</label>
                      <div style={{ marginTop: 2 }} className="control">
                        <div style={{ display: 'flex' }}>
                          <input
                            value={inputCodeContent}
                            onChange={(e) => {
                              if (e.target.value && e.target.value.length > 6) {
                                // ignore after 6
                              } else {
                                this.setState({ inputCodeContent: e.target.value });
                              }
                            }}
                            disabled={isResendingVCode || verifyingEmailInProgress}
                            style={{ flexGrow: 1, borderRadius: 0 }}
                            className="input"
                            placeholder="Enter verification code"
                          />
                        </div>
                        <div className="help">
                          * Check your email inbox/junk folders for emails from
                          bidorboo@bidorboo.com
                        </div>
                        <br></br>

                        <button
                          style={{ marginRight: 6 }}
                          onClick={this.handleSendNewCode}
                          className="button is-text"
                          disabled={isResendingVCode || verifyingEmailInProgress}
                        >
                          {`${isResendingVCode ? 'pin sent' : 'resend pin'}`}
                        </button>
                        <button
                          onClick={() => {
                            if (!isResendingVCode || !verifyingEmailInProgress) {
                              if (!inputCodeContent) {
                                alert('Please use the 6 digits code we sent to your email');
                              } else if (inputCodeContent.length === 6) {
                                verifyEmail(`${inputCodeContent}`);
                                this.toggleEnterPinDialog();
                              } else {
                                alert(
                                  "you've entered an invalid code. code is a 6 digit sent to your email",
                                );
                              }
                            }
                          }}
                          style={{ borderRadius: 0 }}
                          disabled={
                            !inputCodeContent || isResendingVCode || verifyingEmailInProgress
                          }
                          className="button is-info"
                        >
                          Submit Code
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    style={{ width: 160 }}
                    onClick={this.toggleEnterPinDialog}
                    className="button is-outline"
                  >
                    <span>Cancel</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    shouldShowLoginDialog: uiReducer.shouldShowLoginDialog,
    verifyingEmailInProgress: userReducer.verifyingEmail,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    verifyEmail: bindActionCreators(verifyEmail, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEmailButton);
