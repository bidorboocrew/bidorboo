import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';

export class FirstTimeUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowAutoDetect: false,
      hasAgreedToTOS: false,
      tosError: false,
      phoneNumber: '',
      phoneError: false,
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
  toggleHasAgreedToTOS = () => {
    const newStateOfTOS = !this.state.hasAgreedToTOS;
    if (newStateOfTOS) {
      this.setState({ hasAgreedToTOS: !this.state.hasAgreedToTOS, tosError: false });
    } else {
      this.setState({ hasAgreedToTOS: !this.state.hasAgreedToTOS });
    }
  };
  updatePhoneNumber = (event) => {
    this.setState({ phoneNumber: event.target.value });
  };

  verifyAndSubmitOnBoarding = () => {
    const { hasAgreedToTOS, phoneNumber } = this.state;

    const isValidPhone = phoneNumber && /^[0-9]\d{2}\d{3}\d{4}$/g.test(phoneNumber);

    let errors = {};
    if (!isValidPhone) {
      errors = { ...errors, phoneError: true };
    }
    if (!hasAgreedToTOS) {
      errors = { ...errors, tosError: true };
    }
    this.setState(
      () => ({ ...errors }),
      () => {
        if (errors.phoneError || errors.tosError) {
          // do not call server
        } else {
          // no issues submit to server here
          const onBoardingDetails = {
            phone: { phoneNumber: this.state.phoneNumber },
            agreedToTOS: this.state.hasAgreedToTOS,
          };

          this.props.updateOnBoardingDetails(onBoardingDetails);
        }
      },
    );
  };

  render() {
    const { displayName } = this.props;
    const { allowAutoDetect, phoneNumber, hasAgreedToTOS, phoneError, tosError } = this.state;
    return (
      <div id="ONBOARDING_CONTAINER">
        <div className="pyro">
          <div className="before" />
          <div className="after" />
        </div>
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Welcome to BidOrBoo {displayName}</h1>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 800 }} className="container">
          <div
            style={{ padding: '1rem', background: 'rgba(255,255,255,0.4)' }}
            className="card disabled"
          >
            <div className="card-content">
              <div className="content">
                <h2 className="has-text-centered subtitle has-text-grey has-text-weight-normal">
                  Let's Get you Started
                </h2>

                <div className="field has-text-left">
                  <label className="label">
                    Enter Your Phone <span className="has-text-grey">(required)</span>
                  </label>

                  <div className="control has-icons-left">
                    <input
                      onChange={this.updatePhoneNumber}
                      className={`input ${phoneError ? 'is-danger' : ''} `}
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-mobile-alt" />
                    </span>
                  </div>
                  {phoneError ? (
                    <p className="help is-danger">
                      * Invalid phone number, it must be of the format 6133334444
                    </p>
                  ) : (
                    <React.Fragment>
                      <p style={{ marginBottom: 0 }} className="help">
                        * enter a valid phone number, for example : 6130001111
                      </p>
                      <p className="help">* we will send you a verification code shortly</p>
                    </React.Fragment>
                  )}
                </div>

                <br />
                <div>
                  <div className="control">
                    <label style={{ lineHeight: 1.5 }} className="checkbox">
                      <input
                        onChange={this.toggleHasAgreedToTOS}
                        type="checkbox"
                        value={hasAgreedToTOS}
                      />
                      {` I confirm that I have read and agreed to`}
                      <a target="_blank" rel="noopener noreferrer" href="bidorbooserviceAgreement">
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
                <br />
                <div className="has-text-centered">
                  <a
                    onClick={this.verifyAndSubmitOnBoarding}
                    className="button is-success is-large"
                  >
                    Get Me Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
