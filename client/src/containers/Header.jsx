import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onLogout } from '../app-state/actions/authActions';
import { switchRoute } from '../app-state/actions/routerActions';
import { LoginOrRegisterModal } from '../components/LoginOrRegisterModal';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as ROUTES from '../constants/route_const';

import './styles/header.css';

class Header extends React.Component {
  static propTypes = {
    s_userEmail: PropTypes.string,
    s_isLoggedIn: PropTypes.bool.isRequired,
    s_userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_switchRoute: PropTypes.func.isRequired
  };
  static defaultProps = {
    s_userEmail: ''
  };
  constructor(props) {
    super(props);
    this.state = {
      isHamburgerOpen: false,
      isLoginDialogOpen: false
    };
    this.closeMenuThenExecute = func => {
      this.setState({ isHamburgerOpen: false }, func);
    };
    this.toggleLoginDialog = () => {
      this.setState({ isLoginDialogOpen: !this.state.isLoginDialogOpen });
    };
  }
  render() {
    const {
      s_displayName,
      s_isLoggedIn,
      s_userDetails,
      a_onLogout,
      a_switchRoute
    } = this.props;
    const { profileImgUrl } = s_userDetails;

    return (
      <nav
        style={{ fontSize: 18, minHeight: '3.25rem', maxHeight: '3.25rem' }}
        className="nav-bar-bottom navbar is-fixed-top"
      >
        {/* brand */}
        <LoginOrRegisterModal
          isActive={this.state.isLoginDialogOpen}
          handleCancel={this.toggleLoginDialog}
        />
        <div className="navbar-brand">
          <a
            onClick={() => {
              s_isLoggedIn
                ? this.closeMenuThenExecute(() => {
                    a_switchRoute(ROUTES.FRONTENDROUTES.HOME);
                  })
                : this.closeMenuThenExecute(() => {
                    this.toggleLoginDialog(true);
                  });
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
            <span style={{ paddingLeft: 6 }}> BidorBooHome </span>
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
          {s_isLoggedIn && (
            <div className="navbar-start">
              <a
                onClick={() => {
                  this.closeMenuThenExecute(() => {
                    a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER);
                  });
                }}
                className="navbar-item "
              >
                <i className="fa fa-child" aria-hidden="true" />
                <span style={{ marginLeft: 4 }}>Post a Job</span>
              </a>
              <a
                onClick={() => {
                  this.closeMenuThenExecute(() => {
                    a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER);
                  });
                }}
                className="navbar-item "
              >
                <i className="fa fa-hand-paper" aria-hidden="true" />
                <span style={{ marginLeft: 4 }}>Bid on Jobs</span>
              </a>
            </div>
          )}

          {/* end */}
          <div className="navbar-end">
            <div className="navbar-item">
              {s_isLoggedIn && (
                <div className="field is-grouped">
                  <div style={{ paddingRight: 0 }} className="navbar-item">
                    <div className="navbar-item has-dropdown is-hoverable">
                      <a className="navbar-link" style={{ paddingLeft: 6 }}>
                        {profileImgUrl && (
                          <img
                            style={{ paddingRight: 4 }}
                            src={profileImgUrl}
                            alt="BidOrBoo"
                          />
                        )}
                        {s_displayName}
                      </a>
                      <div className="navbar-dropdown">
                        <a
                          onClick={() => {
                            this.closeMenuThenExecute(() => {
                              a_switchRoute(ROUTES.FRONTENDROUTES.MY_PROFILE);
                            });
                          }}
                          className="navbar-item "
                        >
                          <i className="far fa-user" aria-hidden="true" />
                          <span style={{ marginLeft: 4 }}>My Profile</span>
                        </a>
                        <hr className="dropdown-divider" />
                        <a
                          onClick={() =>
                            this.closeMenuThenExecute(() => {
                              a_onLogout();
                            })
                          }
                          className="navbar-item"
                        >
                          <i
                            style={{ fontSize: 12 }}
                            className="fas fa-sign-out-alt"
                          />
                          <span style={{ marginLeft: 4 }}>Logout</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!s_isLoggedIn && (
                <div className="navbar-item">
                  <a
                    className="button is-outlined"
                    onClick={() => {
                      this.closeMenuThenExecute(() => {
                        this.toggleLoginDialog(true);
                      });
                    }}
                  >
                    login
                  </a>
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
    s_isLoggedIn: authReducer.isLoggedIn,
    s_userDetails: authReducer.userDetails,
    s_displayName: authReducer.userDetails.displayName,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_onLogout: bindActionCreators(onLogout, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
