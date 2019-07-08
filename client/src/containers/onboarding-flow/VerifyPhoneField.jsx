import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as ROUTES from '../../constants/frontend-route-consts';

import { verifyPhone } from '../../app-state/actions/authActions';

class VerifyPhoneField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResendingVCode: false,
      inputCodeContent: '',
      showEnterPinDialog: false,
    };
  }

  toggleEnterPinDialog = () => {
    this.setState({ showEnterPinDialog: !this.state.showEnterPinDialog });
  };

  handleSendNewCode = async () => {
    this.setState({ isResendingVCode: true }, async () => {
      try {
        const resendVerificationReq = await axios.post(ROUTES.API.USER.POST.resendVerificationMsg);
        if (resendVerificationReq && resendVerificationReq.success) {
          alert('you should recieve a text shortly , please give 10-15 minutes');
        }
      } catch (e) {
        // some alert
        alert(
          'we are unable to send the verification text, please contact bidorboocrew@bidorboo.com',
        );
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      }
    });
  };
  render() {
    const { isResendingVCode, inputCodeContent, showEnterPinDialog } = this.state;
    const { verifyPhone, verifyingPhoneInProgress } = this.props;
    this.rootModal = document.querySelector('#bidorboo-root-modals');

    return (
      <div className="field">
        <label className="label">Enter Your Phone Verification Code:</label>
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
              className="input"
              type="number"
              maxLength="6"
              minLength="6"
              placeholder="Enter 6 digits Verification Code"
            />
            <div
              onClick={() => {
                if (!isResendingVCode || !verifyingPhoneInProgress) {
                  if (!inputCodeContent) {
                    alert('Please use the 6 digits code we sent to your phone');
                  } else if (inputCodeContent.length === 6) {
                    verifyPhone(`${inputCodeContent}`);
                    this.toggleEnterPinDialog();
                  } else {
                    alert("you've entered an invalid code. code is a 6 digit sent to your phone");
                  }
                }
              }}
              style={{ borderRadius: 0 }}
              disabled={!inputCodeContent || isResendingVCode || verifyingPhoneInProgress}
              className="button is-success"
            >
              Verify Phone
            </div>
            <button
              style={{ marginLeft: 6 }}
              onClick={this.handleSendNewCode}
              className="button is-text"
              disabled={isResendingVCode || verifyingPhoneInProgress}
            >
              {`${isResendingVCode ? 'Code Sent' : 'Send New Code'}`}
            </button>
          </div>
          <div className="help">* Check your phone text msgs</div>
        </div>
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
)(VerifyPhoneField);
