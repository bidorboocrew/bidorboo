import React from 'react';
import { toggleSideNav, showLoginDialog } from '../app-state/actions/uiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
    a_showLoginDialog: PropTypes.func.isRequired
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
      s_isLoginDialogOpen
    } = this.props;

    return (
      <nav style={{ fontSize: 22 }} className="navbar is-fixed-top">
        <div className="navbar-brand">
          <a
            onClick={() => a_toggleSideNav(s_isSideNavOpen)}
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

          <div
            onClick={() => {
              this.setState({ isHamburgerOpen: !this.state.isHamburgerOpen });
            }}
            className="navbar-burger burger"
            data-target="navbarmenu"
          >
            <span />
            <span />
            <span />
          </div>
        </div>

        <div
          id="navbarmenu"
          className={classNames('navbar-menu', {
            'is-active': this.state.isHamburgerOpen
          })}
        >
          <div className="navbar-start" />

          <div className="navbar-end">
            <div className="navbar-item">
              {s_isLoggedIn && (
                <div style={{ paddingRight: 0 }} className="navbar-item">
                  {s_displayName}
                </div>
              )}
              {!s_isLoggedIn && (
                <div className="field is-grouped">
                  <div style={{ paddingRight: 0 }} className="navbar-item">
                    Sign up
                  </div>
                  <div style={{ paddingRight: 0 }} className="navbar-item">
                    <a
                      style={{ fontSize: 20 }}
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
                      style={{ fontSize: 20 }}
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

const mapStateToProps = ({ uiReducer, authReducer }) => {
  return {
    s_isSideNavOpen: uiReducer.isSideNavOpen,
    s_isLoginDialogOpen: uiReducer.isLoginDialogOpen,
    s_displayName: authReducer.userDetails.displayName,
    s_isLoggedIn: authReducer.isLoggedIn
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_toggleSideNav: bindActionCreators(toggleSideNav, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
