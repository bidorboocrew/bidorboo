import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import defaultUserImage from '../assets/images/img_avatar2.png';

import './styles/sideBar.css';

class SideBar extends React.Component {
  static PropTypes = {
    userDetails: PropTypes.shape({
      email: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired,
    logoutAction: PropTypes.func,
    actionList: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.func.isRequired,
        callback: PropTypes.func.isRequired
      })
    ).isRequired
  };
  static defaultProps = {
    imageURL: '',
    logoutAction: () => null
  };

  render() {
    const classNames_sidenav = classnames('animated slideInLeft');
    const { userDetails, loginAction, logoutAction, actionList } = this.props;
    const { profileImgUrl, email } = userDetails;
    debugger;
    return (
      <div id="side-nav" className={classNames_sidenav}>
        <div className="sideBarContentWrapper_FC">
          <div className="profileImg">
            {/* use the user image if one exists  */}
            {profileImgUrl && (
              <img
                height="52px"
                width="52px"
                src={profileImgUrl}
                style={{ borderRadius: '50%' }}
              />
            )}
          </div>

          <div>{/* login button */}</div>
          <div>{/* register */}</div>
          <div>{/* logout */}</div>
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
