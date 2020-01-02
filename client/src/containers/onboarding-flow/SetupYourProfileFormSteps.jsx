import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import VerifyEmailField from './VerifyEmailField';
import VerifyPhoneField from './VerifyPhoneField';
import UpdatePhoneNumberField from './UpdatePhoneNumberField';
import { updateProfileDetails } from '../../app-state/actions/userModelActions';

const Step1 = ({ userDetails, showSetupPhoneStep }) => {
  return (
    <div>
      <div className="subtitle">EMAIL VERIFICATION</div>
      <div className="slide-in-right field">
        <div className="group">
          <label className="label hasSelectedValue">{`We've sent the Code to: `}</label>
          <div>{`${userDetails.email.emailAddress}`}</div>
        </div>

        <VerifyEmailField {...{ userDetails, showSetupPhoneStep }} />
      </div>

      {/* <button onClick={showSetupPhoneStep} className="button is-white firstButtonInCard">
        <span>SKIP</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button> */}
    </div>
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
  return (
    <div style={{ position: 'relative' }}>
      <div className="subtitle has-text-weight-bold">PHONE VERIFICATION</div>
      {!renderVerificationSection && (
        <div className="slide-in-right field" style={{ height: '10rem' }}>
          <UpdatePhoneNumberField
            showPhoneVerificationStep={showPhoneVerificationStep}
            userDetails={userDetails}
            onSubmit={onSubmit}
          />
        </div>
      )}

      {renderVerificationSection && (
        <div className="slide-in-right field">
          <div className="group">
            <label className="label hasSelectedValue">{`We've sent the Code to: `}</label>
            <div>{`${userDetails.phone.phoneNumber}`}</div>
          </div>
          <VerifyPhoneField {...{ userDetails, showTosStep, showSetupPhoneStep }} />
        </div>
      )}

      {/* <button onClick={showTosStep} className="button is-white is-pulled-right">
        <span>SKIP</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button> */}
      {!isEmailAlreadyVerified && (
        <button onClick={showEmailVerificationStep} className="button is-pulled-left">
          <span className="icon">
            <i className="fas fa-chevron-left" />
          </span>
          <span>Back</span>
        </button>
      )}
    </div>
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
    const { location, updateOnBoardingDetails } = this.props;
    const shouldRedirect = location && location.state && location.state.redirectUrl;

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
              if (shouldRedirect && location.state.redirectUrl !== ROUTES.CLIENT.ONBOARDING) {
                return switchRoute(location.state.redirectUrl);
              } else {
                return switchRoute(ROUTES.CLIENT.HOME);
              }
            },
          );
        }
      },
    );
  };
  render() {
    const { hasAgreedToTOS, tosError } = this.state;
    const {
      showSetupPhoneStep,
      isEmailAlreadyVerified,
      isPhoneAlreadyVerified,
      showEmailVerificationStep,
    } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        <div className="title has-text-centered">BidOrBoo Terms Of Use</div>
        <div className="slide-in-right field" style={{ height: '10rem' }}>
          <div style={{ padding: '0.5rem' }} className="group">
            <div className="control">
              <label style={{ lineHeight: 1.5 }} className="checkbox">
                <input
                  style={{ marginRight: 4 }}
                  onChange={this.toggleHasAgreedToTOS}
                  type="checkbox"
                  value={hasAgreedToTOS}
                />
                {` I confirm that I have read and agreed to`}
                <a target="_blank" rel="noopener noreferrer" href={`${ROUTES.CLIENT.TOS}`}>
                  {` BidOrBoo Service Agreement `}
                </a>
                and
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://stripe.com/connect-account/legal"
                >
                  {` Stripe Connected Account Agreement`}
                </a>
                .
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
          onClick={this.verifyAndSubmitOnBoarding}
          className="button is-success is-pulled-right"
        >
          Get Started
        </button>

        {!isEmailAlreadyVerified && isPhoneAlreadyVerified && (
          <button onClick={showEmailVerificationStep} className="button is-pulled-left">
            <span className="icon">
              <i className="fas fa-chevron-left" />
            </span>
            <span>Back</span>
          </button>
        )}
        {!isPhoneAlreadyVerified && (
          <button onClick={showSetupPhoneStep} className="button is-pulled-left">
            <span className="icon">
              <i className="fas fa-chevron-left" />
            </span>
            <span>Back</span>
          </button>
        )}
      </div>
    );
  }
}

class SetupYourProfileFormSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
    };
  }

  showEmailVerificationStep = () => {
    this.setState(() => ({ currentStep: 1 }));
  };

  showSetupPhoneStep = () => {
    this.setState(() => ({ currentStep: 2 }));
  };

  showPhoneVerificationStep = () => {
    this.setState(() => ({ currentStep: 3 }));
  };

  showTosStep = () => {
    this.setState(() => ({ currentStep: 4 }));
  };

  componentDidUpdate() {
    const { isLoggedIn, userDetails, location } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    } else if (userDetails.membershipStatus !== 'NEW_MEMBER') {
      const shouldRedirect = location && location.state && location.state.redirectUrl;

      if (shouldRedirect && location.state.redirectUrl !== ROUTES.CLIENT.ONBOARDING) {
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
  handlePhoneNumberSubmit = (value) => {
    this.props.updateProfileDetails(value);
    this.showTosStep();
  };
  render() {
    const { currentStep } = this.state;
    const { updateProfileDetails, userDetails } = this.props;

    const { email, phone } = userDetails;

    let isEmailAlreadyVerified = false;
    if (email && email.emailAddress && email.isVerified) {
      isEmailAlreadyVerified = true;
    }

    let isPhoneAlreadyVerified = false;
    if (phone && phone.phoneNumber && phone.isVerified) {
      isPhoneAlreadyVerified = true;
    }

    let showTos = false;
    if (phone && phone.phoneNumber && phone.isVerified) {
      showTos = true;
    }

    let stepToRender = null;
    switch (currentStep) {
      case 1:
        if (!isEmailAlreadyVerified) {
          stepToRender = (
            <Step1
              isEmailAlreadyVerified={isEmailAlreadyVerified}
              isPhoneAlreadyVerified={isPhoneAlreadyVerified}
              {...this.props}
              showSetupPhoneStep={this.showSetupPhoneStep}
              showTosStep={this.showTosStep}
            />
          );
        } else if (!isPhoneAlreadyVerified) {
          stepToRender = (
            <Step2
              {...this.props}
              isEmailAlreadyVerified={isEmailAlreadyVerified}
              isPhoneAlreadyVerified={isPhoneAlreadyVerified}
              showTosStep={this.showTosStep}
              showEmailVerificationStep={this.showEmailVerificationStep}
              showPhoneVerificationStep={this.showPhoneVerificationStep}
              onSubmit={this.handlePhoneNumberSubmit}
            />
          );
        } else {
          stepToRender = (
            <Step4
              isEmailAlreadyVerified={isEmailAlreadyVerified}
              isPhoneAlreadyVerified={isPhoneAlreadyVerified}
              {...this.props}
              showSetupPhoneStep={this.showSetupPhoneStep}
              showEmailVerificationStep={this.showEmailVerificationStep}
            />
          );
        }
        break;
      case 2:
        if (!isPhoneAlreadyVerified) {
          stepToRender = (
            <Step2
              {...this.props}
              isEmailAlreadyVerified={isEmailAlreadyVerified}
              isPhoneAlreadyVerified={isPhoneAlreadyVerified}
              showTosStep={this.showTosStep}
              showEmailVerificationStep={this.showEmailVerificationStep}
              showPhoneVerificationStep={this.showPhoneVerificationStep}
              onSubmit={updateProfileDetails}
            />
          );
        } else {
          stepToRender = (
            <Step4
              isEmailAlreadyVerified={isEmailAlreadyVerified}
              isPhoneAlreadyVerified={isPhoneAlreadyVerified}
              {...this.props}
              showSetupPhoneStep={this.showSetupPhoneStep}
              showEmailVerificationStep={this.showEmailVerificationStep}
            />
          );
        }
        break;
      case 3:
        stepToRender = (
          <Step2
            {...this.props}
            isEmailAlreadyVerified={isEmailAlreadyVerified}
            isPhoneAlreadyVerified={isPhoneAlreadyVerified}
            showTosStep={this.showTosStep}
            showEmailVerificationStep={this.showEmailVerificationStep}
            showPhoneVerificationStep={this.showPhoneVerificationStep}
            onSubmit={updateProfileDetails}
            renderVerificationSection
          />
        );
        break;
      case 4:
        stepToRender = (
          <Step4
            isEmailAlreadyVerified={isEmailAlreadyVerified}
            isPhoneAlreadyVerified={isPhoneAlreadyVerified}
            {...this.props}
            showSetupPhoneStep={this.showSetupPhoneStep}
            showEmailVerificationStep={this.showEmailVerificationStep}
          />
        );
        break;
    }
    return <React.Fragment>{stepToRender}</React.Fragment>;
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupYourProfileFormSteps);
