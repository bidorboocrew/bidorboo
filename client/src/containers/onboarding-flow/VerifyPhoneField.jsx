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
    };
  }

  handleSendNewCode = async () => {
    this.setState({ isResendingVCode: true }, async () => {
      try {
        const resendVerificationReq = await axios.post(ROUTES.API.USER.POST.resendVerificationMsg);
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      } catch (e) {
        // some alert
        alert(
          'we are unable to send the verification text, please contact bidorboocrew@bidorboo.com',
        );
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      }
    });
  };

  submitPhone = (val) => {
    const { verifyPhone, showTosStep } = this.props;
    verifyPhone(val);
    showTosStep();
  };
  render() {
    const { isResendingVCode, inputCodeContent } = this.state;
    const { verifyingPhoneInProgress, showTosStep } = this.props;
    this.rootModal = document.querySelector('#bidorboo-root-modals');

    return (
      <div className="group saidTest">
        <div style={{ marginTop: 2 }} className="control">
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
          <div className="help">* Check your phone text msgs</div>
          <div style={{ display: 'flex' }}>
            <div
              onClick={() => {
                if (!isResendingVCode || !verifyingPhoneInProgress) {
                  if (!inputCodeContent) {
                    alert('Please use the 6 digits code we sent to your phone');
                  } else if (inputCodeContent.length === 6) {
                    this.submitPhone(`${inputCodeContent}`);
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
              className="button"
              disabled={isResendingVCode || verifyingPhoneInProgress}
            >
              {`${isResendingVCode ? 'Code Was Sent' : 'Get A New Code'}`}
            </button>
          </div>
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
