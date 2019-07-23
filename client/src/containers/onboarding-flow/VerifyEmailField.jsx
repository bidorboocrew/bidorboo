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
          'we are unable to send the verification email, please contact us bidorboocrew@bidorboo.com and we will help you resolve this',
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
            disabled={isResendingVCode || verifyingEmailInProgress}
            style={{ flexGrow: 1, borderRadius: 0 }}
            className="input"
            type="number"
            maxLength="6"
            minLength="6"
            placeholder="Enter 6 digits Verification Code"
          />
          <div className="help">
            *Check inbox/junk folders for an email from bidorboocrew@bidorboo.com
          </div>
          <div style={{ display: 'flex' }}>
            <div
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
              style={{ borderRadius: 0 }}
              disabled={!inputCodeContent || isResendingVCode || verifyingEmailInProgress}
              className="button is-success"
            >
              Verify Email
            </div>
            <button
              style={{ marginLeft: 8 }}
              onClick={this.handleSendNewCode}
              className="button"
              disabled={isResendingVCode || verifyingEmailInProgress}
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
