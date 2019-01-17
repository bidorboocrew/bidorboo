import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { onLogout } from '../app-state/actions/authActions';
import LoginOrRegisterModal from '../LoginOrRegisterModal';
import { showLoginDialog } from '../app-state/actions/uiActions';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

class Header extends React.Component {
  static propTypes = {
    userEmail: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    userDetails: PropTypes.object.isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userEmail: '',
    isLoggedIn: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isHamburgerOpen: false,
      isProfileMenuActive: false,
    };
  }

  closeMenuThenExecute = (func) => {
    this.setState({ isHamburgerOpen: false, isProfileMenuActive: false }, func);
  };
  toggleLoginDialog = () => {
    this.props.a_showLoginDialog(!this.props.shouldShowLoginDialog);
  };

  toggleProfileMenu = () => {
    this.setState({ isProfileMenuActive: !this.state.isProfileMenuActive });
  };

  render() {
    const {
      displayName,
      isLoggedIn,
      userDetails,
      a_onLogout,
      shouldShowLoginDialog,
      notificationFeed,
    } = this.props;
    const { profileImage } = userDetails;

    const { isHamburgerOpen, isProfileMenuActive } = this.state;

    return (
      <React.Fragment>
        {isHamburgerOpen && (
          <div
            style={{ zIndex: 10 }}
            onClick={(e) => {
              this.setState({ isHamburgerOpen: !isHamburgerOpen });
            }}
            className="modal-background"
          />
        )}
        <nav className="navbar is-fixed-top has-shadow is-spaced nav-bottom-border">
          <LoginOrRegisterModal
            isActive={shouldShowLoginDialog}
            handleCancel={this.toggleLoginDialog}
          />

          <div className="navbar-brand">
            <a
              onClick={() => {
                this.closeMenuThenExecute(() => {
                  switchRoute(ROUTES.CLIENT.HOME);
                });
              }}
              style={{ paddingRight: 4 }}
              className="navbar-item"
            >
              <img
                src="https://image.flaticon.com/icons/svg/753/753078.svg"
                alt="BidOrBoo"
                width="32"
                height="32"
              />
              <span
                style={{ paddingLeft: 6 }}
                className="has-text-dark has-text-weight-bold is-size-4"
              >
                BidOrBoo
              </span>
            </a>

            {!isLoggedIn && (
              <div className="is-hidden-desktop navbar-item">
                <a
                  className="button is-danger heartbeat"
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      this.toggleLoginDialog();
                    });
                  }}
                >
                  Login / Sign Up
                </a>
              </div>
            )}
            {isLoggedIn && (
              <div className="navbar-item is-hidden-touch">
                <a
                  className={`button is-outline ${
                    window.location.pathname.includes('my-calendar') ? 'is-info' : ''
                  }`}
                  onClick={() => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.MYCALENDAR);
                    });
                  }}
                >
                  <span className="icon">
                    <i className="far fa-calendar-alt" />
                  </span>
                  <span>My Agenda</span>
                </a>
              </div>
            )}

            <a
              onClick={(e) => {
                this.setState({ isHamburgerOpen: !isHamburgerOpen });
              }}
              style={{ position: 'relative' }}
              className={classNames('navbar-burger', {
                'is-active': isHamburgerOpen,
              })}
              data-target="navbarmenu"
              role="button"
              aria-label="menu"
              aria-expanded={isHamburgerOpen}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              {notificationFeed &&
                ((notificationFeed.myBidsWithNewStatus &&
                  notificationFeed.myBidsWithNewStatus.length > 0) ||
                  (notificationFeed.jobIdsWithNewBids &&
                    notificationFeed.jobIdsWithNewBids.length > 0)) && (
                  <React.Fragment>
                    <div
                      style={{ position: 'absolute', top: 8, right: 8, fontSize: 10 }}
                      className="has-text-danger"
                    >
                      <i className="fas fa-circle" />
                    </div>
                  </React.Fragment>
                )}
            </a>
          </div>

          <div
            id="navbarmenu"
            className={classNames('navbar-menu', {
              'is-active': isHamburgerOpen,
            })}
          >
            <div className="navbar-start" />

            {/* end */}
            <div className="navbar-end">
              <React.Fragment>
                <a
                  className={`navbar-item ${
                    window.location.pathname.includes('proposer-root') ? 'is-active' : ''
                  }`}
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.PROPOSER.root);
                    });
                  }}
                >
                  <span className="icon">
                    <i className="far fa-plus-square" />
                  </span>
                  <span>Request a Service</span>
                </a>

                <a
                  className={`navbar-item ${
                    window.location.pathname.includes('bidder-root') ? 'is-active' : ''
                  }`}
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.BIDDER.root);
                    });
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-hand-rock" />
                  </span>
                  <span>Offer A Service</span>
                </a>

                {isLoggedIn && (
                  <React.Fragment>
                    <a
                      className={`navbar-item ${
                        window.location.pathname.includes('proposer/my-open-jobs/postedJobs')
                          ? 'is-active'
                          : ''
                      }`}
                      style={{ position: 'relative' }}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.PROPOSER.getMyOpenJobsPostedJobsTab());
                        });
                      }}
                    >
                      <span className="icon">
                        <i className="fas fa-list" />
                      </span>
                      <span>My Requests</span>
                      {notificationFeed &&
                        notificationFeed.jobIdsWithNewBids &&
                        notificationFeed.jobIdsWithNewBids.length > 0 && (
                          <span
                            style={{
                              fontSize: 10,
                              position: 'absolute',
                              top: 0,
                              left: 8,
                              background: 'red',
                              borderRadius: '100%',
                              minWidth: 15,
                              textAlign: 'center',
                            }}
                          >
                            <span className="has-text-white">{`${
                              notificationFeed.jobIdsWithNewBids.length > 9
                                ? '9+'
                                : notificationFeed.jobIdsWithNewBids.length
                            }`}</span>
                          </span>
                        )}
                    </a>

                    <a
                      style={{ position: 'relative' }}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.BIDDER.mybids);
                        });
                      }}
                      className={`navbar-item ${
                        window.location.pathname.includes('bidder/my-bids') ? 'is-active' : ''
                      }`}
                    >
                      <span className="icon">
                        <i className="fas fa-money-check-alt" />
                      </span>
                      <span>My Bids</span>
                      {notificationFeed &&
                        notificationFeed.myBidsWithNewStatus &&
                        notificationFeed.myBidsWithNewStatus.length > 0 && (
                          <span
                            style={{
                              fontSize: 10,
                              position: 'absolute',
                              top: 0,
                              left: 8,
                              background: 'red',
                              borderRadius: '100%',
                              minWidth: 15,
                              textAlign: 'center',
                            }}
                          >
                            <span className="has-text-white">{`${
                              notificationFeed.myBidsWithNewStatus.length > 9
                                ? '9+'
                                : notificationFeed.myBidsWithNewStatus.length
                            }`}</span>
                          </span>
                        )}
                    </a>

                    <div
                      className={`navbar-item dropdown is-right  ${
                        isProfileMenuActive ? 'is-active' : ''
                      }`}
                    >
                      <nav className="navbar" role="navigation" aria-label="dropdown navigation">
                        <div className="navbar-item has-dropdown">
                          <a onClick={this.toggleProfileMenu} className="navbar-link">
                            <figure className="image is-32x32">
                              <img
                                style={{ paddingRight: 4 }}
                                src={profileImage.url}
                                alt="BidOrBoo"
                              />
                            </figure>
                            {displayName}
                          </a>

                          <div
                            className={`navbar-dropdown ${isProfileMenuActive ? 'is-active' : ''}`}
                          >
                            <a
                              onClick={() => {
                                this.closeMenuThenExecute(() => {
                                  switchRoute(ROUTES.CLIENT.MY_PROFILE);
                                });
                              }}
                              className="navbar-item"
                            >
                              <span className="icon">
                                <i className="far fa-user" aria-hidden="true" />
                              </span>
                              <span>My Profile</span>
                            </a>
                            <a
                              onClick={(e) =>
                                this.closeMenuThenExecute(() => {
                                  a_onLogout();
                                })
                              }
                              className="navbar-item"
                            >
                              <span className="icon">
                                <i className="fas fa-sign-out-alt" />
                              </span>
                              <span>Logout</span>
                            </a>
                          </div>
                        </div>
                      </nav>
                    </div>
                  </React.Fragment>
                )}
                {!isLoggedIn && (
                  <div className="navbar-item">
                    <a
                      className="button is-danger is-medium heartbeat"
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          this.toggleLoginDialog();
                        });
                      }}
                    >
                      Login / Sign Up
                    </a>
                  </div>
                )}
              </React.Fragment>
            </div>
          </div>
        </nav>
        {/* this to make up for the flex size of the navbar on desktop */}
        <div className="is-hidden-touch" style={{ height: '0.75rem' }} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ userReducer, uiReducer }) => {
  const { userDetails } = userReducer;
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userDetails,
    displayName: userDetails.displayName,
    shouldShowLoginDialog: uiReducer.shouldShowLoginDialog,
    notificationFeed: uiReducer.notificationFeed,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_onLogout: bindActionCreators(onLogout, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
