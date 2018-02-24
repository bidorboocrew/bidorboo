import React from 'react';
import {
  toggleSideNav,
  toggleLoginRegistrationForm
} from '../app-state/actions/uiActions';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoginOrRegisterModal } from '../components';
import {
  onSubmitRegistrationForm,
  onSubmitLoginForm
} from '../app-state/actions/authActions';

import classnames from 'classnames';
import './styles/header.css';

class Header extends React.Component {


  render() {
    const {
      a_onSubmitLoginForm,
      a_onSubmitRegistrationForm,
      a_toggleSideNav,
      a_toggleLoginRegistrationForm,
      s_isSideNavOpen,
      s_userName,
      s_isLoggedIn,
      s_loginClickSrc,
      s_isLoginRegistrationDialogOpen } = this.props;

    return (
      <nav>
        <div className="applicationBar-FC">
          <div
            onClick={() => a_toggleSideNav(s_isSideNavOpen)}
            className="__logo"
          >
            <i className="material-icons">menu</i>
          </div>
          <div className="__name">B.o.B</div>
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
              <a
                onClick={() => a_toggleLoginRegistrationForm(true,'register')}
                className="bdb-button flat medium hover-effect"
              >
                Signup
              </a>
              {/* <a className="bdb-button flat medium hover-effect" href="/auth/google">
                {s_loginClickSrc ? userName : 'login'}

              </a> */}
              <a
                onClick={() => a_toggleLoginRegistrationForm(true,'login')}
                className="bdb-button flat medium hover-effect"
              >
                Login
              </a>
              {s_isLoggedIn && (
                <a
                  className="bdb-button flat medium hover-effect"
                  href="/auth/logout"
                >
                  logout
                </a>
              )}
            </div>
          </div>
          <LoginOrRegisterModal
            onClose={() => a_toggleLoginRegistrationForm(false, '')}
            open={s_isLoginRegistrationDialogOpen}
            source={s_loginClickSrc}
            onSubmitRegistrationForm={a_onSubmitRegistrationForm}
            onSubmitLoginForm={a_onSubmitLoginForm}
          />
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ uiReducer, authReducer }) => {
  return {
    s_isSideNavOpen: uiReducer.isSideNavOpen,
    s_isLoginRegistrationDialogOpen: uiReducer.isLoginRegistrationDialogOpen,
    s_loginClickSrc: uiReducer.loginClickSrc,
    s_userName: authReducer.userName,
    s_isLoggedIn: authReducer.isLoggedIn
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_onSubmitLoginForm: bindActionCreators(onSubmitLoginForm, dispatch),
    a_onSubmitRegistrationForm: bindActionCreators(
      onSubmitRegistrationForm,
      dispatch
    ),
    a_toggleSideNav: bindActionCreators(toggleSideNav, dispatch),
    a_toggleLoginRegistrationForm: bindActionCreators(
      toggleLoginRegistrationForm,
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
