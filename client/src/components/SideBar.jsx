import React from 'react';
import PropTypes from 'prop-types';

// import defaultUserImage from '../assets/images/img_avatar2.png';

import './styles/sideBar.css';

class SideBar extends React.Component {
  static propTypes = {
    userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired,
    actionList: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        action: PropTypes.func.isRequired
      })
    ).isRequired,
    isUserLoggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    onshowLoginDialog: PropTypes.func.isRequired
  };

  render() {
    const {
      userDetails,
      isUserLoggedIn,
      onLogout,
      onshowLoginDialog
    } = this.props;

    const { profileImgUrl, displayName } = userDetails;

    return (
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
            {isUserLoggedIn && (
              <div className="action col-xs-12">
                <i className="material-icons md-24">create</i>
                <span>Post a job</span>
              </div>
            )}
            {isUserLoggedIn && (
              <div className="action col-xs-12">
                <i className="material-icons md-24">pan_tool</i>
                <span>Bid on a job</span>
              </div>
            )}
            {!isUserLoggedIn && (
              <div
                onClick={() => onshowLoginDialog(true)}
                style={{ verticalAlign: 'bottom' }}
                className="show-on-small-and-down hide-on-small-and-up action col-xs-12"
              >
                <i className="material-icons md-24">insert_emoticon</i>
                <span>login</span>
              </div>
            )}
            {isUserLoggedIn && (
              <div onClick={() => onLogout()} className="action col-xs-12">
                <i className="material-icons md-24">power_settings_new</i>
                <span>Logout</span>
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
    );
  }
}

export default SideBar;
