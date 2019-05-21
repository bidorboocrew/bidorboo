import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as ROUTES from '../../constants/frontend-route-consts';

import { verifyPhone } from '../../app-state/actions/authActions';

class VerifyPhoneButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResendingVCode: false,
      inputCodeContent: '',
    };
  }

  handleSendNewCode = async () => {
    this.setState({ isResendingVCode: true }, async () => {
      try {
        const resendVerificationReq = await axios.post(
          ROUTES.API.USER.POST.resendVerificationEmail,
        );
        if (resendVerificationReq && resendVerificationReq.success) {
          alert('you should recieve a text shortly , please give 10-15 minutes');
        }
      } catch (e) {
        // some alert
        alert('we are unable to send the verification text, please contact bidorboocrew@gmail.com');
        this.setState({ isResendingVCode: false });
      }
    });
  };
  render() {
    const { isResendingVCode, inputCodeContent } = this.state;
    const { verifyPhone, verifyingPhoneInProgress } = this.props;
    return (
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
            disabled={isResendingVCode || verifyingPhoneInProgress}
            style={{ flexGrow: 1, borderRadius: 0 }}
            className="input is-small"
            type="number"
            maxLength="6"
            placeholder="Verification Code"
          />
          <div
            onClick={() => {
              if (!isResendingVCode || !verifyingPhoneInProgress) {
                if (!inputCodeContent) {
                  alert('Please check your phone msgs to get the verification code');
                } else if (inputCodeContent.length === 6) {
                  verifyPhone(`${inputCodeContent}`);
                } else {
                  alert("you've entered an invalid code. code is a 6 digit sent to your phone");
                }
              }
            }}
            style={{ borderRadius: 0 }}
            className="button is-success is-outlined  is-small"
          >
            <span className="icon">
              <i className="fas fa-check is-success" />
            </span>
          </div>
          <button
            style={{ marginLeft: 6 }}
            onClick={this.handleSendNewCode}
            className="button is-text is-small"
            disabled={isResendingVCode || verifyingPhoneInProgress}
          >
            {`${isResendingVCode ? 'pin sent' : 'resend pin'}`}
          </button>
        </div>
        <div className="help">* Check your email inbox/junk folders</div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    shouldShowLoginDialog: uiReducer.shouldShowLoginDialog,
    verifyingPhoneInProgress: userReducer.verifyingPhone,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    verifyPhone: bindActionCreators(verifyPhone, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyPhoneButton);
