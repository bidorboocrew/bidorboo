import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './sideBar.css';
import defaultUserImage from '../assets/images/img_avatar2.png';
import { Link } from 'react-router-dom';

class SideBar extends React.Component {
  static PropTypes = {
    imageURL: PropTypes.string,
    loginAction: PropTypes.func,
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
    loginAction: () => null,
    logoutAction: () => null
  };

  render() {
    const classNames_sidenav = classnames('animated slideInLeft');
    const { imageURL, loginAction, logoutAction, actionList } = this.props;

    return (
      <div id="side-nav" className={classNames_sidenav}>
        <div className="sideBarContentWrapper_FC">
          <div className="profileImg">
            {/* use the user image if one exists  */}
            {imageURL && (
              <img
                height="52px"
                width="52px"
                src={imageURL}
                style={{ borderRadius: '50%' }}
              />
            )}
            {/* default image  */}
            {!imageURL && (
              <img
                height="52px"
                width="52px"
                src={defaultUserImage}
                style={{ borderRadius: '50%' }}
              />
            )}
            {/* image container */}
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
