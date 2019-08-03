import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

// import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';
import VerifyEmailField from './VerifyEmailField';
import VerifyPhoneField from './VerifyPhoneField';
import UpdatePhoneNumberField from './UpdatePhoneNumberField';
import { updateProfileDetails } from '../../app-state/actions/userModelActions';

const Step1 = ({ userDetails, showSetupPhoneStep }) => {
  return (
    <div>
      <div className="subtitle">Verify your email address</div>
      <div className="slide-in-right field">
        <div>{`We've sent the Code to: `}</div>
        <div className="has-text-weight-semibold">{`${userDetails.email.emailAddress}`}</div>
        <br />
        <VerifyEmailField {...{ userDetails, showSetupPhoneStep }} />
      </div>

      <button onClick={showSetupPhoneStep} className="button is-link  firstButtonInCard">
        <span>Skip for now</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button>
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
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className="subtitle has-text-weight-bold">Let's Setup Your Phone Number</div>
      <div className="slide-in-right field" style={{ height: '10rem' }}>
        <UpdatePhoneNumberField
          showPhoneVerificationStep={showPhoneVerificationStep}
          userDetails={userDetails}
          onSubmit={onSubmit}
        />
      </div>
      <br />
      <button onClick={showTosStep} className="button is-link is-pulled-right">
        <span>Skip for now</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button>
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

const Step3 = ({ userDetails, showTosStep, showSetupPhoneStep }) => {
  return (
    <div>
      <div className="subtitle">Verify your phone number</div>
      <div className="slide-in-right field">
        <div>{`We've sent the Code to: `}</div>
        <div className="has-text-weight-semibold">{`${userDetails.phone.phoneNumber}`}</div>
        <br />
        <VerifyPhoneField {...{ userDetails, showTosStep, showSetupPhoneStep }} />
      </div>

      <button onClick={showTosStep} className="button is-link firstButtonInCard">
        <span>Skip for now</span>
        <span className="icon">
          <i className="fas fa-chevron-right" />
        </span>
      </button>
      <button onClick={showSetupPhoneStep} className="button is-pulled-left">
        <span className="icon">
          <i className="fas fa-chevron-left" />
        </span>
        <span>Back</span>
      </button>
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

          this.props.updateOnBoardingDetails({
            agreedToTOS: this.state.hasAgreedToTOS,
          });
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
          <div className="group saidTest">
            <label className="label">Please Read BidOrBoo terms of service</label>
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
                  <strong>{` BidOrBoo Service Agreement `}</strong>
                </a>
                and
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://stripe.com/connect-account/legal"
                >
                  <strong>{` Stripe Connected Account Agreement`}</strong>
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

export class SetupYourProfileFormSteps extends React.Component {
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
    const { displayName, updateProfileDetails, userDetails } = this.props;
    const { hasAgreedToTOS, tosError } = this.state;

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
          <Step3
            isEmailAlreadyVerified={isEmailAlreadyVerified}
            isPhoneAlreadyVerified={isPhoneAlreadyVerified}
            {...this.props}
            showTosStep={this.showTosStep}
            showSetupPhoneStep={this.showSetupPhoneStep}
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
    updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetupYourProfileFormSteps);
