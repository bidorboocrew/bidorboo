import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';

import * as ROUTES from '../../constants/frontend-route-consts';
import { verifyEmail } from '../../app-state/actions/authActions';

class VerifyEmailField extends React.Component {
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
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      } catch (e) {
        // some alert
        alert(
          'Unable to verify your email, please click the chat button on the right bottom corner of your creend or contact us bidorboocrew@bidorboo.com to resolve this',
        );
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      }
    });
  };
  render() {
    const { isResendingVCode, inputCodeContent, showEnterPinDialog } = this.state;
    const { verifyEmail, verifyingEmailInProgress } = this.props;

    return (
      <div>
        <div className={`group`}>
          <label className="label">Enter Email Verification code</label>
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
            placeholder="Enter 6 digits Verification Code"
          />
        </div>
        <div style={{ display: 'flex' }}>
          <button
            onClick={() => {
              if (!isResendingVCode || !verifyingEmailInProgress) {
                if (!inputCodeContent) {
                  alert('Please use the 6 digits code we sent to your email');
                } else if (inputCodeContent.length === 6) {
                  verifyEmail(`${inputCodeContent}`);
                  this.toggleEnterPinDialog();
                } else {
                  alert("you've entered an invalid code. code is a 6 digit sent to your email");
                }
              }
            }}
            disabled={isResendingVCode || verifyingEmailInProgress}
            className="button is-success"
          >
            Verify Email
          </button>
          <button
            style={{ marginLeft: 8 }}
            onClick={this.handleSendNewCode}
            className="button"
            disabled={isResendingVCode || verifyingEmailInProgress}
          >
            {`${isResendingVCode ? 'Code Was Sent' : 'Resend My Code'}`}
          </button>
        </div>
        <div className="help">
          *Check inbox/junk folders for an email from bidorboocrew@bidorboo.com
        </div>
        <br />
      </div>
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
)(VerifyEmailField);
