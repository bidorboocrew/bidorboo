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
    }
  }

  render() {
    const { authIsInProgress } = this.props;
    if (authIsInProgress) {
      return null;
    }
    return (
      <div className="columns is-multiline is-centered is-mobile">
        <div className="column limitLargeMaxWidth">
          <div id="ONBOARDING_CONTAINER">
            <section className="hero is-small has-text-centered">
              <div className="hero-body">
                <div className="HorizontalAligner-center">
                  <div className="bdb-flex-container">
                    <div className="flex-item">
                      <img
                        src={logoImg}
                        alt="BidOrBoo"
                        width="48"
                        height="48"
                        style={{ maxHeight: 'unset' }}
                      />
                      <div className="title" style={{ marginLeft: 4, margin: 0 }}>
                        <span style={{ color: '#ee2a36', fontWeight: 500 }}>B</span>id
                        <span style={{ color: '#ee2a36', fontWeight: 500 }}>O</span>r
                        <span style={{ color: '#ee2a36', fontWeight: 500 }}>B</span>oo
                      </div>
                    </div>
                  </div>
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
  const { userDetails, isLoggedIn } = userReducer;
  return {
    authIsInProgress: uiReducer.authIsInProgress,
    isLoggedIn,
    userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOnBoardingDetails: bindActionCreators(updateOnBoardingDetails, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeUser);
