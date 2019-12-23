import React from 'react';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { connect } from 'react-redux';
import * as A from '../../app-state/actionTypes';

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
        await axios.post(ROUTES.API.USER.POST.resendVerificationMsg);
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      } catch (e) {
        this.props.dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg:
                'we are unable to send the verification text, please contact bidorboo@bidorboo.ca',
            },
          },
        });
        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      }
    });
  };

  submitPhone = (val) => {
    const { verifyPhone, showTosStep } = this.props;
    verifyPhone(val, showTosStep);
  };
  render() {
    const { isResendingVCode, inputCodeContent } = this.state;
    const { verifyingPhoneInProgress, dispatch } = this.props;
    this.rootModal = document.querySelector('#bidorboo-root-modals');

    return (
      <div>
        <div className="group">
          <label className="label">Enter Phone Verification code</label>
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
            placeholder="Enter 6 digits Verification Code"
          />
        </div>
        <div>
          <button
            style={{ borderRadius: 0, boxShadow: 'none' }}
            onClick={this.handleSendNewCode}
            className="button is-text"
            disabled={isResendingVCode || verifyingPhoneInProgress}
          >
            {`${isResendingVCode ? 'Code Was Sent' : 'Resend My Code'}`}
          </button>
          <button
            style={{ marginLeft: 6, borderRadius: 0 }}
            onClick={() => {
              if (!isResendingVCode || !verifyingPhoneInProgress) {
                if (!inputCodeContent) {
                  dispatch({
                    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
                    payload: {
                      toastDetails: {
                        type: 'error',
                        msg: 'Please use the 6 digits code we sent to your phone',
                      },
                    },
                  });
                } else if (inputCodeContent.length === 6) {
                  this.submitPhone(`${inputCodeContent}`);
                } else {
                  dispatch({
                    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
                    payload: {
                      toastDetails: {
                        type: 'error',
                        msg: "you've entered an invalid code. code is a 6 digit sent to your phone",
                      },
                    },
                  });
                }
              }
            }}
            disabled={isResendingVCode || verifyingPhoneInProgress}
            className="button is-success"
          >
            Verify Phone
          </button>
        </div>
        <div className="help">* Check your phone text msgs</div>
        <br />
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneField);
