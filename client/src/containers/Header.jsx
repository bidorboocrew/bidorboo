import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import { onLogout } from '../app-state/actions/authActions';
import LoginOrRegisterModal from '../LoginOrRegisterModal';
import { showLoginDialog } from '../app-state/actions/uiActions';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { NotificationsModal } from './index';
import logoImg from '../assets/images/android-chrome-192x192.png';

const HREF_TO_TABID = {
  PROVIDE_A_SERVICE: 'PROVIDE_A_SERVICE',
  MY_BIDS: 'MY_BIDS',
  REQUEST_A_SERVICE: 'REQUEST_A_SERVICE',
  MY_REQUESTS: 'MY_REQUESTS',
  HOME: 'HOME',
  PAYMENT_SETTINGS: 'PAYMENT_SETTINGS',
  MY_PROFILE: 'MY_PROFILE',
  ARCHIVE: 'ARCHIVE',
};
class Header extends React.Component {
  static propTypes = {
    userEmail: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    userDetails: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
    showLoginDialog: PropTypes.func.isRequired,
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
      isNotificationMenuActive: false,
      activeNavBarMenuId: '',
    };
  }

  componentDidMount() {
    this.modalRootNode = document.querySelector('#bidorboo-root-modals');
  }
  closeMenuThenExecute = (func) => {
    this.setState(
      { isHamburgerOpen: false, isProfileMenuActive: false, isNotificationMenuActive: false },
      func,
    );
  };
  toggleLoginDialog = () => {
    this.props.showLoginDialog(!this.props.shouldShowLoginDialog);
  };

  toggleProfileMenu = () => {
    this.setState({ isProfileMenuActive: !this.state.isProfileMenuActive });
  };

  toggleNotificationMenu = () => {
    this.setState({ isNotificationMenuActive: !this.state.isNotificationMenuActive });
  };

  static getDerivedStateFromProps(nextProp, prevState) {
    if (nextProp.history && nextProp.history.location && nextProp.history.location.pathname) {
      if (nextProp.history.location.pathname.includes('bdb-request')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.REQUEST_A_SERVICE) {
          return { activeNavBarMenuId: HREF_TO_TABID.REQUEST_A_SERVICE };
        }
      }
      if (nextProp.history.location.pathname.includes('bdb-offer')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.PROVIDE_A_SERVICE) {
          return { activeNavBarMenuId: HREF_TO_TABID.PROVIDE_A_SERVICE };
        }
      }
      if (nextProp.history.location.pathname.includes('my-open-jobs')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.MY_REQUESTS) {
          return { activeNavBarMenuId: HREF_TO_TABID.MY_REQUESTS };
        }
      }
      if (nextProp.history.location.pathname.includes('my-bids')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.MY_BIDS) {
          return { activeNavBarMenuId: HREF_TO_TABID.MY_BIDS };
        }
      }
      if (nextProp.history.location.pathname.includes('payment-settings')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.PAYMENT_SETTINGS) {
          return { activeNavBarMenuId: HREF_TO_TABID.PAYMENT_SETTINGS };
        }
      }
      if (nextProp.history.location.pathname.includes('my-archive')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.ARCHIVE) {
          return { activeNavBarMenuId: HREF_TO_TABID.ARCHIVE };
        }
      }
      if (nextProp.history.location.pathname.includes('my-profile')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.MY_PROFILE) {
          return { activeNavBarMenuId: HREF_TO_TABID.MY_PROFILE };
        }
      }
      if (nextProp.history.location.pathname.includes('BidOrBoo')) {
        if (prevState.activeNavBarMenuId !== 'HREF_TO_TABID.HOME') {
          return { activeNavBarMenuId: 'HREF_TO_TABID.HOME ' };
        }
        // make cool effect on the logo
        // if (prevState.activeNavBarMenuId !== HREF_TO_TABID.HOME) {
        //   return { activeNavBarMenuId: HREF_TO_TABID.HOME };
        // }
      }
    }
    return null;
  }

  render() {
    const {
      displayName,
      isLoggedIn,
      userDetails,
      onLogout,
      shouldShowLoginDialog,
      notificationFeed,
      userAppView,
    } = this.props;

    const { profileImage } = userDetails;

    const {
      isHamburgerOpen,
      isProfileMenuActive,
      isNotificationMenuActive,
      activeNavBarMenuId,
    } = this.state;

    const {
      jobIdsWithNewBids,
      myBidsWithNewStatus,
      jobsHappeningToday,
      bidsHappeningToday,
    } = notificationFeed;

    const isThereJobsHappeningToday = jobsHappeningToday && jobsHappeningToday.length > 0;
    const isThereBidsHappeningToday = bidsHappeningToday && bidsHappeningToday.length > 0;
    const isAnythingHappeningToday = isThereJobsHappeningToday || isThereBidsHappeningToday;

    const jobRecievedNewBids = jobIdsWithNewBids && jobIdsWithNewBids.length > 0;
    const bidsGotAwardedToMe = myBidsWithNewStatus && myBidsWithNewStatus.length > 0;

    const showNotificationButton =
      isAnythingHappeningToday || jobRecievedNewBids || bidsGotAwardedToMe;

    const isActingAsBidder = userAppView === 'BIDDER';

    let hideMobileNavButtons =
      window.location.href.includes('BidOrBoo') ||
      window.location.href.includes('my-profile') ||
      window.location.href.includes('my-archive');

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
        {/* is-spaced is a good prop to add  */}
        <nav
          id="BID_OR_BOO_APP_HEADER"
          className={`navbar is-fixed-top ${isActingAsBidder ? 'bidderAppBar' : ''}  `}
        >
          <LoginOrRegisterModal
            isActive={shouldShowLoginDialog}
            handleCancel={this.toggleLoginDialog}
          />

          <div className="navbar-brand">
            <a
              style={{ paddingRight: 4 }}
              id="BidOrBoo-logo-step"
              onClick={() => {
                this.closeMenuThenExecute(() => {
                  switchRoute(ROUTES.CLIENT.HOME);
                });
              }}
              className={`navbar-item ${
                activeNavBarMenuId === HREF_TO_TABID.HOME ? 'is-active' : ''
              }`}
            >
              <img
                src={logoImg}
                alt="BidOrBoo"
                width="34"
                height="auto"
                style={{ maxHeight: 'unset' }}
              />
            </a>
            <div
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                flexGrow: 1,
              }}
              className="navbar-item has-text-grey"
            >
              <div className={`${isActingAsBidder ? 'has-text-grey-lighter' : 'has-text-dark'}`}>
                {/* {ROUTES.getRouteTitle()} */}
                <div style={{ fontSize: 24, fontWeight: 400 }} className="is-hidden-touch">
                  BidOrBoo
                </div>
              </div>
            </div>
            {hideMobileNavButtons && (
              <>
                <a
                  id={'viewDependentNavBarItems'}
                  className={`navbar-item ${
                    activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
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
                  <span>Request</span>
                </a>
                <a
                  className={`navbar-item ${
                    activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
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
                  <span>Bid</span>
                </a>
              </>
            )}

            {!hideMobileNavButtons && (
              <div className="navbar-item is-hidden-desktop">
                {!isActingAsBidder && (
                  <React.Fragment>
                    <a
                      id={'viewDependentNavBarItems'}
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
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
                      <span>Request</span>
                    </a>
                    {isLoggedIn && (
                      <a
                        id={'viewDependentNavBarItems'}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.MY_REQUESTS ? 'is-active' : ''
                        }`}
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
                          });
                        }}
                      >
                        <span style={{ position: 'relative' }} className="icon">
                          <i className="fas fa-list" />
                          {jobRecievedNewBids && (
                            <span
                              style={{
                                fontSize: 8,
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                borderRadius: '100%',
                                textAlign: 'center',
                              }}
                              className="icon has-text-danger"
                            >
                              <i className="fas fa-circle" />
                            </span>
                          )}
                        </span>
                        <span>Req. Inbox</span>
                      </a>
                    )}
                  </React.Fragment>
                )}

                {isActingAsBidder && (
                  <React.Fragment>
                    <a
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
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
                      <span>Bid</span>
                    </a>
                    {isLoggedIn && (
                      <a
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.MY_BIDS ? 'is-active' : ''
                        }`}
                      >
                        <span style={{ position: 'relative' }} className="icon">
                          <i className="fas fa-money-check-alt" />
                          {bidsGotAwardedToMe && (
                            <span
                              style={{
                                fontSize: 8,
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                borderRadius: '100%',
                                textAlign: 'center',
                              }}
                            >
                              <span className="has-text-danger icon">
                                <i className="fas fa-circle" />
                              </span>
                            </span>
                          )}
                        </span>
                        <span>Bids Inbox</span>
                      </a>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}

            {!isLoggedIn && (
              <div className="is-hidden-desktop navbar-item">
                <a
                  className="button is-success"
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
            {/* {isLoggedIn && showNotificationButton && (
              <div className="navbar-item">
                <a
                  style={{ borderRadius: '100%' }}
                  onClick={this.toggleNotificationMenu}
                  className="button is-danger is-small"
                >
                  <span className="icon">
                    <i className="fas fa-bell" />
                  </span>
                </a>
              </div>
            )} */}

            {isNotificationMenuActive &&
              ReactDOM.createPortal(
                <NotificationsModal onClose={this.toggleNotificationMenu} />,
                this.modalRootNode,
              )}

            <a
              onClick={(e) => {
                this.setState({ isHamburgerOpen: !isHamburgerOpen });
              }}
              id="mobile-nav-burger"
              className={classNames('navbar-burger', {
                'is-active': isHamburgerOpen,
              })}
              data-target="navbarmenu"
              role="button"
              aria-label="menu"
              aria-expanded={isHamburgerOpen}
            >
              <span style={{ position: 'relative' }} aria-hidden="true">
                {(jobRecievedNewBids || bidsGotAwardedToMe) && (
                  <i
                    style={{ position: 'absolute', top: -5, right: -5, fontSize: 8 }}
                    className="has-text-danger fas fa-circle"
                  />
                )}
              </span>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>

          <div
            id="navbarmenu"
            style={{ padding: 0 }}
            className={classNames('navbar-menu', {
              'is-active': isHamburgerOpen,
            })}
          >
            {/* <div className="navbar-start" /> */}
            {/* end */}
            <div className="navbar-end">
              <div className="navbar-item is-hidden-touch">
                {!isActingAsBidder && (
                  <React.Fragment>
                    <a
                      id={'viewDependentNavBarItems'}
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
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
                      <span>New Request</span>
                    </a>
                    {isLoggedIn && (
                      <a
                        id={'viewDependentNavBarItems'}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.MY_REQUESTS ? 'is-active' : ''
                        }`}
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
                          });
                        }}
                      >
                        <span style={{ position: 'relative' }} className="icon">
                          <i className="fas fa-list" />
                          {jobRecievedNewBids && (
                            <span
                              style={{
                                fontSize: 8,
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                borderRadius: '100%',
                                textAlign: 'center',
                              }}
                              className="icon has-text-danger"
                            >
                              <i className="fas fa-circle" />
                            </span>
                          )}
                        </span>
                        <span>Requests Inbox</span>
                      </a>
                    )}
                  </React.Fragment>
                )}

                {isActingAsBidder && (
                  <React.Fragment>
                    <a
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
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
                      <span>New Bid</span>
                    </a>
                    {isLoggedIn && (
                      <a
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            return switchRoute(ROUTES.CLIENT.BIDDER.mybids);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.MY_BIDS ? 'is-active' : ''
                        }`}
                      >
                        <span style={{ position: 'relative' }} className="icon">
                          <i className="fas fa-money-check-alt" />
                          {bidsGotAwardedToMe && (
                            <span
                              style={{
                                fontSize: 8,
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                borderRadius: '100%',
                                textAlign: 'center',
                              }}
                            >
                              <span className="has-text-danger icon">
                                <i className="fas fa-circle" />
                              </span>
                            </span>
                          )}
                        </span>
                        <span>Bids Inbox</span>
                      </a>
                    )}
                  </React.Fragment>
                )}
              </div>
              <React.Fragment>
                {isLoggedIn && (
                  <React.Fragment>
                    <div
                      id="myprofile-step"
                      className={`navbar-item dropdown is-right  ${
                        isProfileMenuActive ? 'is-active' : ''
                      }`}
                    >
                      <nav>
                        <div className="navbar-item has-dropdown">
                          <a onClick={this.toggleProfileMenu} className="navbar-link">
                            <span>
                              <figure className="image is-32x32">
                                <img
                                  style={{
                                    paddingRight: 4,
                                    borderRadius: '100%',
                                  }}
                                  src={profileImage.url}
                                />
                              </figure>
                            </span>
                            <span>{displayName}</span>
                          </a>

                          <div
                            className={`navbar-dropdown is-boxed ${
                              isProfileMenuActive ? 'is-active' : ''
                            }`}
                          >
                            {isLoggedIn && (
                              <React.Fragment>
                                {isActingAsBidder ? (
                                  <a
                                    id="switch-role-step"
                                    onClick={(e) =>
                                      this.closeMenuThenExecute(() => {
                                        switchRoute(ROUTES.CLIENT.PROPOSER.root);
                                      })
                                    }
                                    className="navbar-item"
                                  >
                                    <span style={{ position: 'relative' }} className="icon">
                                      <i className="fab fa-nintendo-switch" />
                                      {jobRecievedNewBids && (
                                        <span
                                          style={{
                                            fontSize: 8,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            borderRadius: '100%',
                                            textAlign: 'center',
                                          }}
                                          className="has-text-info"
                                        >
                                          <i className="fas fa-circle" />
                                        </span>
                                      )}
                                    </span>
                                    <span>Switch to Requester View</span>
                                  </a>
                                ) : (
                                  <a
                                    id="switch-role-step"
                                    onClick={(e) =>
                                      this.closeMenuThenExecute(() => {
                                        switchRoute(ROUTES.CLIENT.BIDDER.root);
                                      })
                                    }
                                    className="navbar-item"
                                  >
                                    <span style={{ position: 'relative' }} className="icon">
                                      <i className="fab fa-nintendo-switch" />
                                      {bidsGotAwardedToMe && (
                                        <div
                                          style={{
                                            fontSize: 8,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            borderRadius: '100%',
                                            textAlign: 'center',
                                          }}
                                          className="has-text-info"
                                        >
                                          <i className="fas fa-circle" />
                                        </div>
                                      )}
                                    </span>
                                    <span>Switch to Tasker View</span>
                                  </a>
                                )}
                              </React.Fragment>
                            )}
                            <hr className="navbar-divider" />
                            <a
                              id="myprofile-step"
                              onClick={() => {
                                this.closeMenuThenExecute(() => {
                                  switchRoute(ROUTES.CLIENT.MY_PROFILE.basicSettings);
                                });
                              }}
                              className={`navbar-item ${
                                activeNavBarMenuId === HREF_TO_TABID.MY_PROFILE ? 'is-active' : ''
                              }`}
                            >
                              <span className="icon">
                                <i className="far fa-user" aria-hidden="true" />
                              </span>
                              <span>My Profile</span>
                            </a>
                            <hr className="navbar-divider" />
                            <a
                              onClick={() => {
                                this.closeMenuThenExecute(() => {
                                  switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
                                });
                              }}
                              className={`navbar-item ${
                                activeNavBarMenuId === HREF_TO_TABID.PAYMENT_SETTINGS
                                  ? 'is-active'
                                  : ''
                              }`}
                            >
                              <span className="icon">
                                <i className="far fa-credit-card" aria-hidden="true" />
                              </span>
                              <span>Payment Settings</span>
                            </a>
                            <hr className="navbar-divider" />
                            <a
                              onClick={(e) =>
                                this.closeMenuThenExecute(() => {
                                  onLogout();
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
                  <div className="is-hidden-touch navbar-item">
                    <a
                      className="button is-success"
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
    userAppView: uiReducer.userAppView,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: bindActionCreators(onLogout, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Header),
);
