import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { updateOnBoardingDetails } from '../../app-state/actions/userModelActions';
import logoImg from '../../assets/images/android-icon-192x192.png';
import SetupYourProfileFormSteps from './SetupYourProfileFormSteps';
export class FirstTimeUser extends React.Component {
  render() {
    const { authIsInProgress } = this.props;
    if (authIsInProgress) {
      return null;
    }

    const { isLoggedIn, userDetails } = this.props;

    if (!isLoggedIn || !userDetails) {
      return switchRoute(`${ROUTES.CLIENT.HOME}`);
    }

    return (
      <div className="hero is-white slide-in-top has-text-centered is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            {/* <img
                        src={logoImg}
                        alt="BidOrBoo"
                        width="48"
                        height="48"
                        style={{ maxHeight: 'unset' }}
                      /> */}

            <SetupYourProfileFormSteps {...this.props} />
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
    dispatch,
    updateOnBoardingDetails: bindActionCreators(updateOnBoardingDetails, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeUser);
