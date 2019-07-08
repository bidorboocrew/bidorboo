import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';
import VerifyEmailField from './VerifyEmailField';
import VerifyPhoneField from './VerifyPhoneField';
import UpdatePhoneNumberField from './UpdatePhoneNumberField';
import { updateProfileDetails } from '../../app-state/actions/userModelActions';

const Step1 = ({ nextButton, backButton, userDetails, showSetupPhone }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className="title has-text-centered">Verify your email address</div>
      <div className="slide-in-right field" style={{ height: '10rem' }}>
        <p className="label">
          We've sent an email to ({userDetails.email.emailAddress}) please check the email and enter
          the code
        </p>
        <VerifyEmailField />
      </div>
      <br />

      <button onClick={showSetupPhone} className="button is-medium is-success is-pulled-right">
        {`Skip >`}
      </button>
    </div>
  );
};

const Step2 = ({
  nextButton,
  backButton,
  userDetails,
  onSubmit,
  showPhoneVerification,
  showEmailVerification,
  showTosStep,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className="title has-text-centered">Let's Setup Your Phone Number</div>
      <div className="slide-in-right field" style={{ height: '10rem' }}>
        <p className="label">
          Your phone number is necessary for facilitating communication when requesting or doing a
          task
        </p>
        <UpdatePhoneNumberField
          showPhoneVerification={showPhoneVerification}
          userDetails={userDetails}
          onSubmit={onSubmit}
        />
      </div>
      <br />
      <button onClick={showTosStep} className="button is-medium is-success is-pulled-right">
        {`Skip >`}
      </button>
      <button
        onClick={showEmailVerification}
        className="button is-medium is-success is-pulled-left is-outlined"
      >
        {`< Back`}
      </button>
    </div>
  );
};

const Step3 = ({ nextButton, backButton, userDetails, showTosStep, showSetupPhone }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className="title has-text-centered">Verify Your Phone Number</div>
      <div className="slide-in-right field" style={{ height: '10rem' }}>
        <p className="label">
          We've sent a verification code to your phone (
          {userDetails.phone && userDetails.phone.phoneNumber}) please check your messages
        </p>
        <VerifyPhoneField />
      </div>
      <br />
      <button onClick={showTosStep} className="button is-medium is-success is-pulled-right">
        {`Skip >`}
      </button>
      <button
        onClick={showSetupPhone}
        className="button is-medium is-success is-pulled-left is-outlined"
      >
        {`< Back`}
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
    const { showSetupPhone } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        <div className="title has-text-centered">BidOrBoo Terms Of Use</div>
        <div className="slide-in-right field" style={{ height: '10rem' }}>
          <div className="field">
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
          className="button is-medium is-success is-pulled-right"
        >
          Start BidOrBooing Now
        </button>
        <button
          onClick={showSetupPhone}
          className="button is-medium is-success is-pulled-left is-outlined"
        >
          {`< Back`}
        </button>
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

  showEmailVerification = () => {
    this.setState(() => ({ currentStep: 1 }));
  };

  showSetupPhone = () => {
    this.setState(() => ({ currentStep: 2 }));
  };

  showPhoneVerification = () => {
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

  render() {
    const { currentStep } = this.state;
    const { displayName, updateProfileDetails } = this.props;
    const { hasAgreedToTOS, tosError } = this.state;

    let stepToRender = null;
    switch (currentStep) {
      case 1:
        stepToRender = <Step1 {...this.props} showSetupPhone={this.showSetupPhone} />;
        break;
      case 2:
        stepToRender = (
          <Step2
            {...this.props}
            showTosStep={this.showTosStep}
            showEmailVerification={this.showEmailVerification}
            showPhoneVerification={this.showPhoneVerification}
            onSubmit={updateProfileDetails}
          />
        );
        break;
      case 3:
        stepToRender = (
          <Step3
            {...this.props}
            showTosStep={this.showTosStep}
            showSetupPhone={this.showSetupPhone}
          />
        );
        break;
      case 4:
        stepToRender = <Step4 {...this.props} showSetupPhone={this.showSetupPhone} />;
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
