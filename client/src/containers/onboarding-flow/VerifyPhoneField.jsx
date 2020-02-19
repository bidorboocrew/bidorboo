import React from 'react';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { connect } from 'react-redux';

import { getBugsnagClient } from '../../index';
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
        getBugsnagClient().leaveBreadcrumb('URGENT_Unable to verify your phone');
        getBugsnagClient().notify(e);
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
    const { verifyingPhoneInProgress, dispatch, userDetails, editPhoneNumber = null } = this.props;

    return (
      <div>
        <div className="group">
          <label className="label">
            We sent verification code to ({userDetails.phone.phoneNumber})
          </label>
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
            style={{
              flexGrow: 1,
              borderRadius: 0,
              borderBottom: '2px solid #26ca70',
              maxWidth: 400,
            }}
            className="input"
            placeholder="Enter verification code..."
          />
          <div className="help">*check your phone text messages inbox</div>
        </div>
        <div>
          {editPhoneNumber && (
            <button
              style={{ marginRight: 6, boxShadow: 'none' }}
              onClick={editPhoneNumber}
              className="button is-light"
            >
              <span className="icon">
                <i className="far fa-arrow-alt-circle-left" />
              </span>
              <span>Go Back</span>
            </button>
          )}
          <button
            style={{ marginLeft: 6 }}
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
            disabled={isResendingVCode || verifyingPhoneInProgress || inputCodeContent.length !== 6}
            className="button is-success"
          >
            Verify Phone
          </button>
        </div>
        <br></br>
        <div className="help">*This could take 1-2 minutes</div>
        <button
          style={{ borderRadius: 0, padding: 0, boxShadow: 'none' }}
          onClick={this.handleSendNewCode}
          className="button is-text is-small"
          disabled={isResendingVCode || verifyingPhoneInProgress}
        >
          {`${isResendingVCode ? '*A new code was sent' : '*Click to request a new code'}`}
        </button>
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
    dispatch,
    verifyPhone: bindActionCreators(verifyPhone, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneField);
