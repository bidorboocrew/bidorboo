import React from 'react';
import { a_toggleSideNav } from '../app-state/actions/uiActions';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import classnames from 'classnames';
import './styles/header.css';

class Header extends React.Component {
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
          <div className="__name hide-on-small-and-down">B.o.B</div>
          <div className="__search">
            <div className="search-wrapper">
              <input className="app-bar-main-search" />
              <div className="search-results" />
            </div>
          </div>
          <div className="__button_FC hide-on-small-and-down">
            <div className="__buttons">
              <a className="btn flat medium hover-effect">Signup</a>
              <a className="btn flat medium hover-effect" href="/auth/facebook">
                {isLoggedIn ? userName : 'login'}
              </a>
            </div>
          </div>
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
