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
      hasAgreedToTOS: false,
      tosError: false,
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
    const { hasAgreedToTOS, tosError } = this.state;
    return (
      <section
        style={{ paddingRight: '0.25rem', paddingLeft: '0.25rem' }}
        className="section"
        id="ONBOARDING_CONTAINER"
      >
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">BidOrBoo Family Welcomes</h1>
              <h2 className="has-text-centered subtitle has-text-grey">({displayName})</h2>
            </div>
          </div>
        </section>

        <div className="container" style={{ maxWidth: 800 }}>
          <div className="card disabled limitLargeMaxWidth">
            <div className="card-content">
              <div className="content">
                <div className="field">
                  <label className="label">
                    Get Started by reading our policies and terms of use
                  </label>
                  <div className="control">
                    <label style={{ lineHeight: 1.5 }} className="checkbox">
                      <input
                        style={{ marginRight: 4 }}
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
                  <a onClick={this.verifyAndSubmitOnBoarding} className="button is-success">
                    GET ME STARTED
                  </a>
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
