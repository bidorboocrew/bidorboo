import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onLogout } from '../app-state/actions/authActions';
import { switchRoute } from '../app-state/actions/routerActions';
import { LoginOrRegisterModal } from '../components/LoginOrRegisterModal';
import { showLoginDialog } from '../app-state/actions/uiActions';
import autoBind from 'react-autobind';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as ROUTES from '../constants/frontend-route-consts';

class Header extends React.Component {
  static propTypes = {
    s_userEmail: PropTypes.string,
    s_isLoggedIn: PropTypes.bool.isRequired,
    s_userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_switchRoute: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired
  };
  static defaultProps = {
    s_userEmail: ''
  };
  constructor(props) {
    super(props);
    autoBind(this, 'toggleLoginDialog', 'closeMenuThenExecute');
    this.state = {
      isHamburgerOpen: false
    };
  }

  closeMenuThenExecute(func) {
    this.setState({ isHamburgerOpen: false }, func);
  }
  toggleLoginDialog() {
    this.props.a_showLoginDialog(!this.props.s_shouldShowLoginDialog);
  }

  render() {
    const {
      s_displayName,
      s_isLoggedIn,
      s_userDetails,
      a_onLogout,
      a_switchRoute,
      s_currentRoute,
      s_shouldShowLoginDialog
    } = this.props;
    const { profileImgUrl } = s_userDetails;

    let navbarStylesBasedOnRoute = classNames(
      'navbar is-fixed-top nav-bottom-border'
    );
    let logoSubTitle = '';
    if (s_currentRoute && s_currentRoute.includes) {
      const isProposerRoutes = s_currentRoute.includes(
        ROUTES.FRONTENDROUTES.PROPOSER.root
      );
      const isBidderRoutes = s_currentRoute.includes(
        ROUTES.FRONTENDROUTES.BIDDER.root
      );
      navbarStylesBasedOnRoute = classNames(
        'navbar is-fixed-top nav-bottom-border',
        { 'color-change-2x-proposer': isProposerRoutes },
        { 'color-change-2x-bidder': isBidderRoutes }
      );
      if (isProposerRoutes) {
        logoSubTitle = '(Proposer View)';
      }
      if (isBidderRoutes) {
        logoSubTitle = '(Bidder View)';
      }
    }

    return (
      <nav style={{ height: '3.25rem' }} className={navbarStylesBasedOnRoute}>
        {/* brand */}
        <LoginOrRegisterModal
          isActive={s_shouldShowLoginDialog}
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
                    this.toggleLoginDialog();
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
            <span style={{ paddingLeft: 6 }}>BidOrBoo</span>
            <span
              className="is-hidden-desktop"
              style={{ paddingLeft: 6, color: '#DCDCDC' }}
            >
              {logoSubTitle}
            </span>
          </a>

          {/* show on mobile if not  */}
          {!s_isLoggedIn && (
            <div className="is-hidden-desktop navbar-item">
              <a
                className="button is-danger heartbeat"
                onClick={() => {
                  this.closeMenuThenExecute(() => {
                    this.toggleLoginDialog();
                  });
                }}
              >
                Login Now
              </a>
            </div>
          )}

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
              <div className="navbar-item has-dropdown is-hoverable">
                <a
                  onClick={() => {
                    this.closeMenuThenExecute(() => {
                      a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
                    });
                  }}
                  className="navbar-link"
                >
                  <i
                    style={{ marginRight: 4 }}
                    className="fa fa-child"
                    aria-hidden="true"
                  />
                  <span>Proposer</span>
                </a>
                <div className="navbar-dropdown is-boxed">
                  <a
                    style={{ marginleft: 4 }}
                    className="navbar-item"
                    onClick={() => {
                      this.closeMenuThenExecute(() => {
                        a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.myjobs);
                      });
                    }}
                  >
                    My Posted Jobs
                  </a>
                  <a
                    style={{ marginleft: 4 }}
                    className="navbar-item"
                    onClick={() => {
                      this.closeMenuThenExecute(() => {
                        a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
                      });
                    }}
                  >
                    Post jobs
                  </a>
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a
                  onClick={() => {
                    this.closeMenuThenExecute(() => {
                      a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
                    });
                  }}
                  className="navbar-link"
                >
                  <i
                    style={{ marginRight: 4 }}
                    className="fa fa-hand-paper"
                    aria-hidden="true"
                  />
                  <span>Bidder</span>
                </a>
                <div className="navbar-dropdown is-boxed">
                  <a
                    onClick={() => {
                      this.closeMenuThenExecute(() => {
                        a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.mybids);
                      });
                    }}
                    style={{ marginleft: 4 }}
                    className="navbar-item"
                  >
                    My Bids
                  </a>
                  <a
                    style={{ marginleft: 4 }}
                    className="navbar-item"
                    onClick={() => {
                      this.closeMenuThenExecute(() => {
                        a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
                      });
                    }}
                  >
                    Post A Bid
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* end */}
          <div className="navbar-end">
            <div className="navbar-item">
              {s_isLoggedIn && (
                <div className="field is-grouped">
                  <div className="navbar-item">
                    <div className="navbar-item has-dropdown is-hoverable">
                      <a className="navbar-link">
                        {profileImgUrl && (
                          <img
                            style={{ paddingRight: 4 }}
                            src={profileImgUrl}
                            alt="BidOrBoo"
                          />
                        )}
                        {s_displayName}
                      </a>
                      <div className="navbar-dropdown is-boxed">
                        <a
                          onClick={() => {
                            this.closeMenuThenExecute(() => {
                              a_switchRoute(ROUTES.FRONTENDROUTES.MY_PROFILE);
                            });
                          }}
                          className="navbar-item"
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
                          <i className="fas fa-sign-out-alt" />
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
                    className="button is-danger is-medium heartbeat"
                    onClick={() => {
                      this.closeMenuThenExecute(() => {
                        this.toggleLoginDialog();
                      });
                    }}
                  >
                    Login Now
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
    s_currentRoute: routerReducer.currentRoute,
    s_shouldShowLoginDialog: uiReducer.shouldShowLoginDialog
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_onLogout: bindActionCreators(onLogout, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
