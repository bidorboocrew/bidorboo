import React from 'react';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';

const Step2 = ({ nextButton, backButton }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className="title has-text-centered">Let's Setup Your Phone Number</div>
      <div className="slide-in-right field" style={{ height: '10rem' }}>
        <label className="label">Enter Your Phone Number</label>
        <input
          className="input"
          type="tel"
          id="phone"
          name="phone"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required
        />
        <p className="help">*Must be a valid phone number, for example 0001114444</p>
      </div>
      <br />
      {nextButton && nextButton()}
      {backButton && backButton()}
    </div>
  );
};

const Step3 = ({ nextButton, backButton }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className="title has-text-centered">Verify Your Phone Number</div>
      <div className="slide-in-right field" style={{ height: '10rem' }}>
        <p className="label">
          We've sent a verification code to your phone () please check your messages
        </p>
        <label className="label">Enter Your Phone Verification Code</label>
        <input
          className="input"
          type="number"
          id="verification"
          name="verification"
          pattern=".{6}"
          required
        />
        <p className="help">*Check your text msgs inbox and enter the 6 digit verification code</p>
      </div>
      <br />
      {nextButton && nextButton()}
      {backButton && backButton()}
    </div>
  );
};
const Step1 = ({ nextButton, backButton }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className="title has-text-centered">Verify your email address</div>
      <div className="slide-in-right field" style={{ height: '10rem' }}>
        <p className="label">We've sent an email to () please check the email and enter the code</p>
        <label className="label">Enter Your Email Verification code</label>
        <input
          className="input"
          type="number"
          id="verification"
          name="verification"
          pattern=".{6}"
          required
        />
        <p className="help">
          *Check your inbox or junk folders just incase and enter the 6 digit verification code
        </p>
      </div>
      <br />
      {nextButton && nextButton()}
      {backButton && backButton()}
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
            <br />
            <div className="has-text-centered">
              <a onClick={this.verifyAndSubmitOnBoarding} className="button is-success is-large">
                GET ME STARTED
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const steps = [
  { name: 'Step 1', component: <Step1 index={1} /> },
  { name: 'Step 2', component: <Step2 index={2} /> },
  { name: 'Step 3', component: <Step3 index={3} /> },
  { name: 'Step 4', component: <Step4 index={4} /> },
];

export default class SetupYourProfileFormSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }

  nextStep = () => {
    debugger;
    this.setState(() => ({ currentStep: this.state.currentStep + 1 }));
  };
  previousStep = () => {
    debugger;
    this.setState(() => ({ currentStep: this.state.currentStep - 1 }));
  };

  componentDidMount() {
    const { isLoggedIn, userDetails } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    } else if (userDetails.membershipStatus !== 'NEW_MEMBER') {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    }
  }
  nextButton = (text = 'Next') => (
    <button onClick={this.nextStep} className="button is-medium is-success is-pulled-right">
      {text}
    </button>
  );

  backButton = (text = 'Back') => (
    <button onClick={this.previousStep} className="button is-medium is-success is-pulled-left">
      {text}
    </button>
  );

  render() {
    const { currentStep } = this.state;
    const { displayName } = this.props;
    const { hasAgreedToTOS, tosError } = this.state;

    let stepToRender = null;
    switch (currentStep) {
      case 0:
        stepToRender = <Step1 nextButton={this.nextButton} />;
        break;
      case 1:
        stepToRender = <Step2 nextButton={this.nextButton} backButton={this.backButton} />;
        break;
      case 2:
        stepToRender = <Step3 nextButton={this.nextButton} />;
        break;
      case 3:
        stepToRender = <Step4 />;
        break;
    }
    return <React.Fragment>{stepToRender}</React.Fragment>;
  }
}
