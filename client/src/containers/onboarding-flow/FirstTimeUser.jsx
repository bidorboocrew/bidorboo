import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';
import logoImg from '../../assets/images/android-chrome-192x192.png';
import SetupYourProfileFormSteps from './SetupYourProfileFormSteps';
export class FirstTimeUser extends React.Component {
  componentDidMount() {
    const { isLoggedIn, userDetails } = this.props;

    if (!isLoggedIn || !userDetails) {
      switchRoute(`${ROUTES.CLIENT.HOME}`);
    } else if (userDetails.membershipStatus !== 'NEW_MEMBER') {
      switchRoute(`${ROUTES.CLIENT.MY_PROFILE.basicSettings}`);
    }
  }

  render() {
    const { displayName } = this.props;
    return (
      <div className="columns is-multiline is-centered is-mobile">
        <div className="column limitLargeMaxWidth">
          <div id="ONBOARDING_CONTAINER">
            <section className="hero has-text-centered">
              <div style={{ padding: '1.5rem 0.5rem 0 0.5rem' }} className="hero-body">
                <div className="container has-text-centered">
                  <div className="title has-text-grey">
                    <img
                      src={logoImg}
                      alt="BidOrBoo"
                      width="24"
                      height="24"
                      style={{ maxHeight: 'unset' }}
                    />
                    <span style={{ marginLeft: 4 }}>BidOrBoo Welcomes</span>
                  </div>
                  <h2 className="has-text-centered title has-text-weight-semibold">
                    {displayName}
                  </h2>
                </div>
              </div>
            </section>

            <div
              style={{ height: 'unset' }}
              className="card cardWithButton limitLargeMaxWidth nofixedwidth"
            >
              <div className="card-content">
                <div className="content">
                  <SetupYourProfileFormSteps {...this.props} />
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
