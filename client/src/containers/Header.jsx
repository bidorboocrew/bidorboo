import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser, onLogout } from '../app-state/actions/authActions';
import { showLoginDialog, toggleSideNav } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';

import { LoginOrRegisterModal } from '../components';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as ROUTES from '../constants/route_const';

import './styles/header.css';

class Header extends React.Component {
  static propTypes = {
    s_isSideNavOpen: PropTypes.bool.isRequired,
    s_isLoginDialogOpen: PropTypes.bool.isRequired,
    s_userEmail: PropTypes.string,
    s_isLoggedIn: PropTypes.bool.isRequired,
    a_toggleSideNav: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired,
    s_userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired,
    a_switchRoute: PropTypes.func.isRequired
  };
  static defaultProps = {
    s_userEmail: ''
  };
  constructor(props) {
    super(props);
    this.state = {
      isHamburgerOpen: false
    };
  }
  render() {
    const {
      a_toggleSideNav,
      a_showLoginDialog,
      s_isSideNavOpen,
      s_displayName,
      s_isLoggedIn,
      s_isLoginDialogOpen,
      s_userDetails,
      a_onLogout,
      a_switchRoute
    } = this.props;
    const {
      profileImgUrl,
      displayName,
      email,
      address,
      personalParagraph,
      creditCards,
      membershipStatus,
      phoneNumber
    } = s_userDetails;

    return (
      <nav style={{ fontSize: 18 }} className="container navbar is-transparent">
        {/* brand */}
        <div className="navbar-brand">
          <a
            onClick={() => {
              !s_isLoggedIn ? a_showLoginDialog(true) : null;
            }}
            style={{ paddingRight: 4 }}
            className="navbar-item"
          >
            <img
              src="https://image.flaticon.com/icons/svg/753/753078.svg"
              alt="BidOrBoo"
              width="24"
              height="24"
            />
            <span style={{ paddingLeft: 6 }}> BidorBoo </span>
          </a>

          {/* burger menu */}
          <div
            onClick={() => {
              this.setState({ isHamburgerOpen: !this.state.isHamburgerOpen });
            }}
            className={classNames('navbar-burger burger', {
              'is-active': this.state.isHamburgerOpen
            })}
            data-target="navbarmenu"
          >
            <span />
            <span />
            <span />
          </div>
          {/* end of burger */}
        </div>

        <div
          id="navbarmenu"
          className={classNames('navbar-menu', {
            'is-active': this.state.isHamburgerOpen
          })}
        >
          {/* start */}
          <div className="navbar-start">
            <a className="navbar-item" href="https://bulma.io/">
              Post a Job
            </a>
            <a className="navbar-item" href="https://bulma.io/">
              Bid on job
            </a>
          </div>

          {/* end */}
          <div className="navbar-end">
            <div className="navbar-item">
              {s_isLoggedIn && (
                <div className="field is-grouped">
                  <div style={{ paddingRight: 0 }} className="navbar-item">
                    {profileImgUrl && (
                      <img
                        // style={{ borderRadius: '50%' }}
                        src={profileImgUrl}
                        alt="BidOrBoo"
                        width="32"
                        height="42"
                      />
                    )}
                    <div className="navbar-item has-dropdown is-hoverable">
                      <a className="navbar-link" style={{ paddingLeft: 6 }}>
                        {s_displayName}
                      </a>

                      <div className="navbar-dropdown">
                        <hr className="navbar-divider" />

                        <a onClick={() => a_onLogout()} className="navbar-item">
                          <i className="material-icons md-24">
                            power_settings_new
                          </i>
                          <span>Logout</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!s_isLoggedIn && (
                <div className="field is-grouped">
                  <div style={{ paddingRight: 0 }} className="navbar-item">
                    Sign up
                  </div>
                  <div style={{ paddingRight: 0 }} className="navbar-item">
                    <a
                      style={{ fontSize: 18 }}
                      className="button button is-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={ROUTES.BACKENDROUTES.AUTH.FACEBOOK}
                    >
                      <span className="icon">
                        <i className="fab fa-facebook" />
                      </span>
                      <span>facebook</span>
                    </a>
                  </div>
                  <div className="navbar-item">
                    <a
                      style={{ fontSize: 18 }}
                      className="button button is-danger"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={ROUTES.BACKENDROUTES.AUTH.GOOGLE}
                    >
                      <span className="icon">
                        <i className="fab fa-google" />
                      </span>
                      <span>google</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ uiReducer, authReducer, routerReducer }) => {
  return {
    s_isSideNavOpen: uiReducer.isSideNavOpen,
    s_isLoginDialogOpen: uiReducer.isLoginDialogOpen,
    s_isLoggedIn: authReducer.isLoggedIn,
    s_userDetails: authReducer.userDetails,
    s_displayName: authReducer.userDetails.displayName,
    s_currentRoute: routerReducer.currentRoute
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
