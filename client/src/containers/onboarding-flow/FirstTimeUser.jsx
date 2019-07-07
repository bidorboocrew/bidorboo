import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';
import logoImg from '../../assets/images/android-chrome-192x192.png';
import SetupYourProfileFormSteps from './SetupYourProfileFormSteps';
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

  render() {
    const { displayName } = this.props;
    const { hasAgreedToTOS, tosError } = this.state;
    return (
      <div className="columns is-multiline is-centered is-mobile">
        <div className="column limitLargeMaxWidth">
          <section id="ONBOARDING_CONTAINER">
            <section className="hero is-white has-text-centered">
              <div className="hero-body">
                <div className="container has-text-centered">
                  <div>
                    <img
                      src={logoImg}
                      alt="BidOrBoo"
                      width="24"
                      height="24"
                      style={{ maxHeight: 'unset' }}
                    />

                    <span style={{ marginLeft: 7 }} className="title">
                      BidOrBoo Welcomes
                    </span>
                  </div>
                  <h2 className="has-text-centered title has-text-grey">{displayName}</h2>
                </div>
              </div>
            </section>
            <div className="hero-body">
              <div className="container" style={{ maxWidth: 800 }}>
                <div className="card limitLargeMaxWidth">
                  <div className="card-content">
                    <div className="content">
                      <SetupYourProfileFormSteps {...this.props} />
                      {/* <div className="subtitle">Let's setup your profile</div>


                    <div className="field">
                      <div className="control">
                        <label style={{ lineHeight: 1.5 }} className="checkbox">
                          <input
                            style={{ marginRight: 4 }}
                            onChange={this.toggleHasAgreedToTOS}
                            type="checkbox"
                            value={hasAgreedToTOS}
                          />
                          {` I confirm that I have read and agreed to`}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${ROUTES.CLIENT.TOS}`}
                          >
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
                        GET ME STARTED
                      </a>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
