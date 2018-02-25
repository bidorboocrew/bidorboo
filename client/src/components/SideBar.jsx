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

    return (
      <div id="side-nav" className={classNames_sidenav}>
        <div className="row center-xs">
          <div className="col-xs-12">
            {/* use the user image if one exists  */}
            {profileImgUrl && (
              <img
                src={profileImgUrl}
                className="profileImg col-xs-12"
                style={{ borderRadius: '50%' }}
              />
            )}
          </div>
          <div className="col-xs-12">
            {/* use the user image if one exists  */}
            {profileImgUrl && (
              <img
                src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
                className="starRating col-xs-12"
              />
            )}
          </div>
          <div className="item col-xs-12">
           {email}
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
