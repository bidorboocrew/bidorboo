import React from 'react';
import { toggleSideNav, showLoginDialog } from '../app-state/actions/uiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoginOrRegisterModal } from '../components';
import PropTypes from 'prop-types';

import './styles/header.css';

class Header extends React.Component {
  static PropTypes = {
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

  render() {
    const {
      a_toggleSideNav,
      a_showLoginDialog,
      s_isSideNavOpen,
      s_userEmail,
      s_isLoggedIn,
      s_isLoginDialogOpen
    } = this.props;

    return (
      <nav>
        <div className="applicationBar-FC">
          <div
            onClick={() => a_toggleSideNav(s_isSideNavOpen)}
            className="__logo"
          >
            <i className="material-icons">menu</i>
          </div>
          <div className="__name">BidOrBoo</div>
          {/*
          SEARCH BAR to be moved to anoteher place later
          <div className="__search">
            <div className="search-wrapper">
              <input className="app-bar-main-search" />
              <div className="search-results" />
            </div>
          </div> */}
          <div className="__button_FC hide-on-small-and-down">
            <div className="__buttons">
              {!s_isLoggedIn && (
                <a
                  rel="noopener"
                  onClick={() => a_showLoginDialog(true)}
                  className="bdb-button flat medium hover-effect"
                >
                  Signup
                </a>
              )}
              {s_isLoggedIn && (
                <a
                  rel="noopener"
                  className="bdb-button flat medium hover-effect"
                  href="/auth/google"
                >
                  {s_userEmail}
                </a>
              )}
              {!s_isLoggedIn && (
                <a
                  rel="noopener"
                  onClick={() => a_showLoginDialog(true)}
                  className="bdb-button flat medium hover-effect"
                >
                  Login
                </a>
              )}
              {s_isLoggedIn && (
                <a
                  rel="noopener"
                  className="bdb-button flat medium hover-effect"
                  href="/auth/logout"
                >
                  logout
                </a>
              )}
            </div>
          </div>
          <LoginOrRegisterModal
            onClose={() => a_showLoginDialog(false)}
            open={s_isLoginDialogOpen}
          />
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ uiReducer, authReducer }) => {
  return {
    s_isSideNavOpen: uiReducer.isSideNavOpen,
    s_isLoginDialogOpen: uiReducer.isLoginDialogOpen,
    s_userEmail: authReducer.userDetails.email,
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
