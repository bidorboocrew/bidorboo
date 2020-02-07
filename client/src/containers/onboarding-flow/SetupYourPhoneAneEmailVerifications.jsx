import React, { useState } from 'react';

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
    <div className="field">
      <div style={{ marginBottom: 4, fontSize: 14, fontWeight: 400 }} className="has-text-dark">
        Step 1: Verify your email
      </div>

      <VerifyEmailField {...{ userDetails, showSetupPhoneStep }} />
    </div>
  );
};

const Step2 = ({
  userDetails,
  onSubmit,
  showPhoneVerificationStep,
  showEmailVerificationStep,
  isEmailAlreadyVerified,
  showSetupPhoneStep,
  renderVerificationSection = false,
}) => {
  const [editPhoneNumber, setEditPhoneNumber] = useState(false);
  return (
    <>
      <div>
        {(!renderVerificationSection || editPhoneNumber) && (
          <div className="slide-in-right field">
            <div
              style={{ marginBottom: 4, fontSize: 14, fontWeight: 400 }}
              className="has-text-dark"
            >
              Step 2: Add your cellphone number
            </div>
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
              <div
                style={{ marginBottom: 4, fontSize: 14, fontWeight: 400 }}
                className="has-text-dark"
              >
                Step 3: Verify your cellphone number
              </div>
              <VerifyPhoneField
                {...{
                  userDetails,
                  showSetupPhoneStep,
                  editPhoneNumber: () => setEditPhoneNumber(true),
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

class SetupYourPhoneAneEmailVerifications extends React.Component {
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

  componentDidUpdate() {
    const { isLoggedIn, userDetails, location } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    }
  }
  componentDidMount() {
    const { isLoggedIn, userDetails } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    }
  }
  handlePhoneNumberSubmit = (value) => {
    this.props.updateProfileDetails(value);
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
            />
          );
        } else if (!isPhoneAlreadyVerified) {
          stepToRender = (
            <Step2
              {...this.props}
              isEmailAlreadyVerified={isEmailAlreadyVerified}
              isPhoneAlreadyVerified={isPhoneAlreadyVerified}
              showEmailVerificationStep={this.showEmailVerificationStep}
              showPhoneVerificationStep={this.showPhoneVerificationStep}
              onSubmit={this.handlePhoneNumberSubmit}
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
              showEmailVerificationStep={this.showEmailVerificationStep}
              showPhoneVerificationStep={this.showPhoneVerificationStep}
              onSubmit={updateProfileDetails}
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
            showEmailVerificationStep={this.showEmailVerificationStep}
            showPhoneVerificationStep={this.showPhoneVerificationStep}
            onSubmit={updateProfileDetails}
            renderVerificationSection
          />
        );
        break;

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

export default connect(mapStateToProps, mapDispatchToProps)(SetupYourPhoneAneEmailVerifications);
