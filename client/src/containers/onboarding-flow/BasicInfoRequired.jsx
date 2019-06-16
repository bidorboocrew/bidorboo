import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import VerifyPhoneButton from '../personal-profile/VerifyPhoneButton';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';

export class FirstTimeUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasVerified: false,
    };
  }
  componentDidMount() {
    const { isLoggedIn, userDetails } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    } else if (userDetails.membershipStatus !== 'NEW_MEMBER') {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    }
  }

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
    const { displayName } = this.props;


    shouldShowPhoneVerification
    return (
      <section
        style={{ paddingRight: '0.25rem', paddingLeft: '0.25rem' }}
        className="section"
        id="ONBOARDING_CONTAINER"
      >
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">{displayName}</h1>
              <h2 className="has-text-centered subtitle has-text-grey">
                Before you can use our platform we must verify some basic details
              </h2>
            </div>
          </div>
        </section>

        <div className="container" style={{ maxWidth: 800 }}>
          <div className="card disabled limitLargeMaxWidth">
            <div className="card-content">
              <div className="content">
                <DisplayLabelValue
                  renderExtraStuff={() => (
                    <React.Fragment>
                      {shouldShowPhoneVerification && <VerifyPhoneButton />}
                    </React.Fragment>
                  )}
                  labelText="Phone Number"
                  labelValue={
                    <div>
                      <span>{phoneNumber}</span>
                      {phone.isVerified && (
                        <span style={{ marginLeft: 6 }} className="has-text-success">
                          <span className="icon">
                            <i className="fas fa-check is-success" />
                          </span>
                          <span>(Verified)</span>
                        </span>
                      )}
                    </div>
                  }
                />
                <br />
                <div className="has-text-centered">
                  <a onClick={this.verifyAndSubmitOnBoarding} className="button is-success">
                    GET STARTED
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="card disabled limitLargeMaxWidth">
            <div className="card-content">
              <div className="content">
                <div className="field">
                  <div className="control">
                    <label style={{ lineHeight: 1.5 }} className="checkbox">
                      {` By becoming a BidOrBoo Tasker you agree to comply with all
                               out policies and terms of use`}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({ userReducer, uiReducer }) => {
  const { userDetails } = userReducer;
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails,
    displayName: userDetails.displayName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOnBoardingDetails: bindActionCreators(updateOnBoardingDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FirstTimeUser);

const DisplayLabelValue = ({ labelText, labelValue, renderExtraStuff }) => {
  return (
    <div className="field">
      <label className="label">{labelText}</label>
      <div className="control"> {labelValue}</div>
      {renderExtraStuff && renderExtraStuff()}
    </div>
  );
};
