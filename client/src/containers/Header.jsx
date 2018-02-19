import React from 'react';
import { a_toggleSideNav } from '../app-state/actions/uiActions';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { LoginOrRegisterModal } from '../components';

import classnames from 'classnames';
import './styles/header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openLoginModal: false, loginClickSource: 'login' };
    this.openLoginModalDialog = this.openLoginModalDialog.bind(this);
    this.closeLoginModalDialog = this.closeLoginModalDialog.bind(this);
  }

  openLoginModalDialog(source) {
    this.setState({
      openLoginModal: true,
      loginClickSource: source
    });
  }

  closeLoginModalDialog() {
    this.setState({ openLoginModal: false });
  }

  render() {
    const { onToggleSideNav, isSideNavOpen, userName, isLoggedIn } = this.props;

    return (
      <nav>
        <div className="applicationBar-FC">
          <div
            onClick={() => onToggleSideNav(isSideNavOpen)}
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
                onClick={() => this.openLoginModalDialog('register')}
                className="bdb-button flat medium hover-effect"
              >
                Signup
              </a>
              {/* <a className="bdb-button flat medium hover-effect" href="/auth/google">
                {isLoggedIn ? userName : 'login'}

              </a> */}
              <a
                onClick={() => this.openLoginModalDialog('login')}
                className="bdb-button flat medium hover-effect"
              >
                Login
              </a>
              {isLoggedIn && (
                <a
                  className="bdb-button flat medium hover-effect"
                  href="/user/logout"
                >
                  logout
                </a>
              )}
            </div>
          </div>
          <LoginOrRegisterModal
            onClose={this.closeLoginModalDialog}
            open={this.state.openLoginModal}
            source={this.state.loginClickSource}
          />
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ uiReducer, authReducer }) => {
  return {
    isSideNavOpen: uiReducer.isSideNavOpen,
    userName: authReducer.userName,
    isLoggedIn: authReducer.isLoggedIn
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onToggleSideNav: bindActionCreators(a_toggleSideNav, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
