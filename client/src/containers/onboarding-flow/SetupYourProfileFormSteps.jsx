import React, { useState } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import VerifyEmailField from './VerifyEmailField';
import VerifyPhoneField from './VerifyPhoneField';
import UpdatePhoneNumberField from './UpdatePhoneNumberField';
import { updateProfileDetails } from '../../app-state/actions/userModelActions';
import { getCurrentUser } from '../../app-state/actions/authActions';

const Step1 = ({ userDetails, showSetupPhoneStep }) => {
  return (
    <>
      <div>
        <br></br>
        <div className="has-text-centered has-text-grey">
          <span className="icon">
            <i className="far fa-envelope" style={{ fontSize: 62, fontWeight: 300 }}></i>
          </span>
        </div>
        <div className="has-text-centered has-text-grey">Email Verification</div>
        <br></br>
        <div className="slide-in-right field">
          <VerifyEmailField {...{ userDetails, showSetupPhoneStep }} />
        </div>
      </div>
      <button onClick={showSetupPhoneStep} className="button is-white firstButtonInCard">
        <span>SKIP</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button>
    </>
  );
};

const Step2 = ({
  userDetails,
  onSubmit,
  showPhoneVerificationStep,
  showEmailVerificationStep,
  showTosStep,
  isEmailAlreadyVerified,
  showSetupPhoneStep,
  renderVerificationSection = false,
}) => {
  const [editPhoneNumber, setEditPhoneNumber] = useState(false);
  return (
    <>
      <div>
        <br></br>
        <div className="has-text-centered has-text-grey">
          <span className="icon">
            <i className="fas fa-mobile-alt" style={{ fontSize: 40, fontWeight: 300 }}></i>
          </span>
        </div>
        <div className="has-text-centered has-text-grey">Phone Verification</div>
        <br></br>
        {(!renderVerificationSection || editPhoneNumber) && (
          <div className="slide-in-right field">
            <UpdatePhoneNumberField
              showPhoneVerificationStep={showPhoneVerificationStep}
              userDetails={userDetails}
              onSubmit={(vals) => {
                onSubmit(vals);
                setEditPhoneNumber(false);
              }}
            />
            <br></br>
            <br></br>
          </div>
        )}

        {renderVerificationSection && !editPhoneNumber && (
          <>
            <div className="fade-in field">
              <VerifyPhoneField {...{ userDetails, showTosStep, showSetupPhoneStep }} />
            </div>
            <br></br>
            <br></br>
            <button
              onClick={() => setEditPhoneNumber(true)}
              className="button is-white is-pulled-left"
            >
              <span className="icon">
                <i className="fas fa-chevron-left" />
              </span>
              <span>Go Back</span>
            </button>
          </>
        )}

        {!isEmailAlreadyVerified && (
          <button onClick={showEmailVerificationStep} className="button is-pulled-left">
            <span className="icon">
              <i className="fas fa-chevron-left" />
            </span>
            <span>Back</span>
          </button>
        )}
      </div>
      <button onClick={showTosStep} className="button is-white firstButtonInCard">
        <span>SKIP</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button>
    </>
  );
};

class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAgreedToTOS: false,
      tosError: false,
    };
  }
  toggleHasAgreedToTOS = () => {
    const newStateOfTOS = !this.state.hasAgreedToTOS;
    if (newStateOfTOS) {
      this.setState({ hasAgreedToTOS: !this.state.hasAgreedToTOS, tosError: false });
    } else {
      this.setState({ hasAgreedToTOS: !this.state.hasAgreedToTOS });
    }
  };

  verifyAndSubmitOnBoarding = () => {
    const { hasAgreedToTOS } = this.state;
    const { location, updateOnBoardingDetails, getCurrentUser } = this.props;

    let errors = {};
    if (!hasAgreedToTOS) {
      errors = { ...errors, tosError: true };
    }
    this.setState(
      () => ({ ...errors }),
      () => {
        if (errors.tosError) {
          // do not call server
        } else {
          // no issues submit to server here

          updateOnBoardingDetails(
            {
              agreedToTOS: this.state.hasAgreedToTOS,
            },
            () => {
              // xxxx redirect potential
              getCurrentUser();
            },
          );
        }
      },
    );
  };
  render() {
    const { hasAgreedToTOS, tosError } = this.state;

    return (
      <div style={{ position: 'relative' }}>
        <div className="title has-text-centered">BidOrBoo</div>
        <div className="has-text-centered">
          <a
            className="subtitle"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => switchRoute(`${ROUTES.CLIENT.TOS}`)}
          >
            Terms Of Service | Privacy Policy
          </a>
        </div>
        <div className="slide-in-right field">
          <div style={{ padding: '0.5rem' }} className="group">
            <div className="control">
              <label style={{ lineHeight: 1.5 }} className="checkbox">
                <input
                  style={{ marginRight: 4, transform: 'scale(1.75)' }}
                  onChange={this.toggleHasAgreedToTOS}
                  type="checkbox"
                  value={hasAgreedToTOS}
                />
                {` I confirm that I have read and agreed to `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="is-link has-text-link"
                  style={{ textDecoration: 'underline' }}
                  onClick={() => switchRoute(`${ROUTES.CLIENT.TOS}`)}
                >
                  {`Terms Of Service and Privacy Policy Agreements`}
                </a>
              </label>
              {tosError && (
                <p className="help is-danger">
                  * You Must Read And Accept Our Terms before continuing
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          disabled={!hasAgreedToTOS || tosError}
          onClick={this.verifyAndSubmitOnBoarding}
          className="button is-success"
        >
          Agree And Get Started
        </button>
      </div>
    );
  }
}

class SetupYourProfileFormSteps extends React.Component {
  componentDidUpdate() {
    const { isLoggedIn, userDetails, location } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    } else if (userDetails.membershipStatus !== 'NEW_MEMBER') {
      const shouldRedirect = location && location.state && location.state.redirectUrl;

      if (shouldRedirect && location.state.redirectUrl !== ROUTES.CLIENT.LOGIN_OR_REGISTER) {
        return switchRoute(location.state.redirectUrl);
      } else {
        return switchRoute(ROUTES.CLIENT.HOME);
      }
    }
  }
  componentDidMount() {
    const { isLoggedIn, userDetails } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    } else if (userDetails.membershipStatus !== 'NEW_MEMBER') {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    }
  }

  render() {
    return <Step4 {...this.props} />;
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupYourProfileFormSteps);
