import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser, onLogout } from '../app-state/actions/authActions';
import { showLoginDialog, toggleSideNav } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';

import * as ROUTES from '../constants/route_const';

// import defaultUserImage from '../assets/images/img_avatar2.png';
import './styles/sideBar.css';

class SideBar extends React.Component {
  static propTypes = {
    s_userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired,
    // actionList: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     text: PropTypes.string.isRequired,
    //     action: PropTypes.func.isRequired
    //   })
    // ).isRequired,
    s_isLoggedIn: PropTypes.bool.isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired,
    s_isSideNavOpen: PropTypes.bool.isRequired,
    a_switchRoute: PropTypes.func.isRequired
  };

  render() {
    const {
      s_userDetails,
      s_isLoggedIn,
      a_showLoginDialog,
      a_onLogout,
      s_isSideNavOpen,
      a_switchRoute
    } = this.props;

    const { profileImgUrl, displayName } = s_userDetails;

    return s_isSideNavOpen ? (
      <div id="side-nav" className="slide-in-left">
        <div className="sidenavContentWrapper">
          <div className="row center-xs">
            <div className="col-xs-12">
              {/* use the user image if one exists  */}
              {profileImgUrl && (
                <img
                  alt="profile pic"
                  src={profileImgUrl}
                  className="profileImg col-xs-12"
                />
              )}
            </div>
            <div className="col-xs-12">
              {/* use the user image if one exists  */}
              {profileImgUrl && (
                <img
                  alt="star rating"
                  src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
                  className="starRating col-xs-12"
                />
              )}
            </div>
            <div className="item username col-xs-12">{displayName}</div>
            <div className="divider col-xs-12" />
            {s_isLoggedIn && (
              <div
                className="action col-xs-12"
                onClick={() => a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER)}
              >
                <i className="material-icons md-24">create</i>
                <span>Post a job</span>
              </div>
            )}
            {s_isLoggedIn && (
              <div
                className="action col-xs-12"
                onClick={() => a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER)}
              >
                <i className="material-icons md-24">pan_tool</i>
                <span>Bid on a job</span>
              </div>
            )}
            {s_isLoggedIn && (
              <div
                className="action col-xs-12"
                onClick={() => a_switchRoute(ROUTES.FRONTENDROUTES.MY_PROFILE)}
              >
                <i className="material-icons md-24">account_circle</i>
                <span>My Profile</span>
              </div>
            )}
            {s_isLoggedIn && (
              <div onClick={() => a_onLogout()} className="action col-xs-12">
                <i className="material-icons md-24">power_settings_new</i>
                <span>Logout</span>
              </div>
            )}
            {!s_isLoggedIn && (
              <div
                onClick={() => a_showLoginDialog(true)}
                style={{ verticalAlign: 'bottom' }}
                className="show-on-small-and-down hide-on-small-and-up action col-xs-12"
              >
                <i className="material-icons md-24">insert_emoticon</i>
                <span>login</span>
              </div>
            )}
          </div>
        </div>
        {/* <ul>
          <li>
            <Link to="/">Home content</Link>
          </li>
          <li>
            <Link to="/bidder">bidder content</Link>
          </li>
          <li>
            <Link to="/proposer">proposer content</Link>
          </li>
        </ul> */}
      </div>
    ) : null;
  }
}

const mapStateToProps = ({ uiReducer, authReducer, routerReducer }) => {
  return {
    s_isSideNavOpen: uiReducer.isSideNavOpen,
    s_isLoggedIn: authReducer.isLoggedIn,
    s_userDetails: authReducer.userDetails,
    s_currentRoute: routerReducer.currentRoute,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_onLogout: bindActionCreators(onLogout, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_toggleSideNav: bindActionCreators(toggleSideNav, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
