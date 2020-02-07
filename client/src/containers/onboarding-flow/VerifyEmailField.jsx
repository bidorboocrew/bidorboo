import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as A from '../../app-state/actionTypes';

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
        await axios.post(ROUTES.API.USER.POST.resendVerificationEmail);
        setTimeout(() => {
          this.setState({ isResendingVCode: false, inputCodeContent: '' });
        }, 2000);
      } catch (e) {
        this.props.dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg:
                'Unable to verify your email, please click the chat button in the footer, or contact us bidorboo@bidorboo.ca to resolve this',
            },
          },
        });

        this.setState({ isResendingVCode: false, inputCodeContent: '' });
      }
    });
  };
  render() {
    const { isResendingVCode, inputCodeContent } = this.state;
    const { verifyEmail, verifyingEmailInProgress, dispatch, userDetails } = this.props;

    return (
      <div>
        <div className={`group`}>
          <label className="label">
            We sent verification code to ({userDetails.email.emailAddress})
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
            disabled={isResendingVCode || verifyingEmailInProgress}
            style={{ maxWidth: 400, borderRadius: 0, borderBottom: '2px solid #26ca70' }}
            className="input"
            placeholder="Enter verification code..."
          />
          <div className="help">
            *Check inbox/junk folders for an email from bidorboo@bidorboo.ca
          </div>
        </div>

        <div>
          <button
            style={{ marginLeft: 8 }}
            onClick={() => {
              if (!isResendingVCode || !verifyingEmailInProgress) {
                if (!inputCodeContent) {
                  dispatch({
                    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
                    payload: {
                      toastDetails: {
                        type: 'error',
                        msg: 'Please use the 6 digits code we sent to your email',
                      },
                    },
                  });
                } else if (inputCodeContent.length === 6) {
                  verifyEmail(`${inputCodeContent}`);
                  this.toggleEnterPinDialog();
                } else {
                  dispatch({
                    type: A.UI_ACTIONS.SHOW_TOAST_MSG,
                    payload: {
                      toastDetails: {
                        type: 'error',
                        msg: "you've entered an invalid code. code is a 6 digit sent to your email",
                      },
                    },
                  });
                }
              }
            }}
            disabled={isResendingVCode || verifyingEmailInProgress || inputCodeContent.length !== 6}
            className="button is-success"
          >
            Verify Email
          </button>
        </div>
        <br></br>
        <div className="help">*this could take 1-2 minutes</div>
        <button
          style={{ borderRadius: 0, padding: 0, boxShadow: 'none' }}
          onClick={this.handleSendNewCode}
          className="button is-text is-small"
          disabled={isResendingVCode || verifyingEmailInProgress}
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
    verifyingEmailInProgress: userReducer.verifyingEmail,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    verifyEmail: bindActionCreators(verifyEmail, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailField);
