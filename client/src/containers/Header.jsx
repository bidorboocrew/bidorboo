import React from 'react';
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
import logoImg from '../assets/images/android-icon-192x192.png';
import navbarBidOrBoo from '../assets/images/navbarBidOrBoo.png';

import ShareThisPageHeaderMenuItem from './ShareThisPageHeaderMenuItem.jsx';
import { getBugsnagClient } from '../index';

const pathsWhereWeDontShowPortalDetail = [
  '/BidOrBoo',
  '/terms-of-service',
  '/reset-password',
  '/my-profile',
  '/login-and-registration',
  '/on-boarding',
];
const HREF_TO_TABID = {
  PROVIDE_A_SERVICE: 'PROVIDE_A_SERVICE',
  MY_BIDS: 'MY_BIDS',
  REQUEST_A_SERVICE: 'REQUEST_A_SERVICE',
  MY_REQUESTS: 'MY_REQUESTS',
  HOME: 'HOME',
  PAYMENT_SETTINGS: 'PAYMENT_SETTINGS',
  MY_PROFILE: 'MY_PROFILE',
  ARCHIVE: 'ARCHIVE',
  NOTIFICATIONS: 'NOTIFICATIONS',
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
    this.modalRootNode = document.querySelector('body');

    if (
      this.props.history.location.pathname.includes('bdb-request/root') ||
      this.props.history.location.pathname.includes('bdb-request/create-request')
    ) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.REQUEST_A_SERVICE });
    } else if (
      this.props.history.location.pathname.includes('bdb-bidder/root') ||
      this.props.history.location.pathname.includes('bdb-bidder/bid-on-request')
    ) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.PROVIDE_A_SERVICE });
    } else if (
      this.props.history.location.pathname.includes('my-open-requests') ||
      this.props.history.location.pathname.includes('my-request')
    ) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.MY_REQUESTS });
    } else if (
      this.props.history.location.pathname.includes('my-bids') ||
      this.props.history.location.pathname.includes('bdb-bidder/awarded-bid-details')
    ) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.MY_BIDS });
    } else if (this.props.history.location.pathname.includes('my-profile/payment-settings')) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.PAYMENT_SETTINGS });
    } else if (this.props.history.location.pathname.includes('my-archive')) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.ARCHIVE });
    } else if (this.props.history.location.pathname.includes('my-profile/basic-settings')) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.MY_PROFILE });
    } else if (
      this.props.history.location.pathname.includes('BidOrBoo') ||
      this.props.history.location.pathname === '/'
    ) {
      this.setState({ activeNavBarMenuId: 'unspecified' });
    } else if (this.props.history.location.pathname.includes('my-profile/notification-settings')) {
      this.setState({ activeNavBarMenuId: HREF_TO_TABID.NOTIFICATIONS });
    } else {
      this.setState({ activeNavBarMenuId: 'unspecified' });
    }
  }
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb('componentDidCatch Header', { debugInfo: info });
    getBugsnagClient().notify(error);
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
      if (
        nextProp.history.location.pathname.includes('bdb-request/root') ||
        nextProp.history.location.pathname.includes('bdb-request/create-request')
      ) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.REQUEST_A_SERVICE) {
          return { activeNavBarMenuId: HREF_TO_TABID.REQUEST_A_SERVICE };
        }
      } else if (
        nextProp.history.location.pathname.includes('bdb-bidder/root') ||
        nextProp.history.location.pathname.includes('bdb-bidder/bid-on-request')
      ) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.PROVIDE_A_SERVICE) {
          return { activeNavBarMenuId: HREF_TO_TABID.PROVIDE_A_SERVICE };
        }
      } else if (
        nextProp.history.location.pathname.includes('my-open-requests') ||
        nextProp.history.location.pathname.includes('my-request')
      ) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.MY_REQUESTS) {
          return { activeNavBarMenuId: HREF_TO_TABID.MY_REQUESTS };
        }
      } else if (nextProp.history.location.pathname.includes('my-bids')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.MY_BIDS) {
          return { activeNavBarMenuId: HREF_TO_TABID.MY_BIDS };
        }
      } else if (nextProp.history.location.pathname.includes('my-profile/payment-settings')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.PAYMENT_SETTINGS) {
          return { activeNavBarMenuId: HREF_TO_TABID.PAYMENT_SETTINGS };
        }
      } else if (nextProp.history.location.pathname.includes('my-archive')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.ARCHIVE) {
          return { activeNavBarMenuId: HREF_TO_TABID.ARCHIVE };
        }
      } else if (nextProp.history.location.pathname.includes('my-profile/basic-settings')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.MY_PROFILE) {
          return { activeNavBarMenuId: HREF_TO_TABID.MY_PROFILE };
        }
      } else if (
        nextProp.history.location.pathname.includes('BidOrBoo') ||
        nextProp.history.location.pathname === '/'
      ) {
        if (prevState.activeNavBarMenuId !== 'unspecified') {
          return { activeNavBarMenuId: 'unspecified' };
        }
      } else if (nextProp.history.location.pathname.includes('my-profile/notification-settings')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.NOTIFICATIONS) {
          return { activeNavBarMenuId: HREF_TO_TABID.NOTIFICATIONS };
        }
      } else {
        if (prevState.activeNavBarMenuId !== 'unspecified') {
          return { activeNavBarMenuId: 'unspecified' };
        }
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
      location,
    } = this.props;

    const { profileImage } = userDetails;

    const {
      isHamburgerOpen,
      isProfileMenuActive,
      // isNotificationMenuActive,
      activeNavBarMenuId,
    } = this.state;

    const {
      requestIdsWithNewBids,
      myBidsWithNewStatus,
      // requestsHappeningToday,
      // bidsHappeningToday,
    } = notificationFeed;

    const installWebAppButton = document.querySelector('#bob-installWebApp');

    // const isThereRequestsHappeningToday =
    //   requestsHappeningToday && requestsHappeningToday.length > 0;
    // const isThereBidsHappeningToday = bidsHappeningToday && bidsHappeningToday.length > 0;
    // const isAnythingHappeningToday = isThereRequestsHappeningToday || isThereBidsHappeningToday;

    const requestRecievedNewBids = requestIdsWithNewBids && requestIdsWithNewBids.length > 0;
    const bidsGotAwardedToMe = myBidsWithNewStatus && myBidsWithNewStatus.length > 0;

    // const showNotificationButton =
    //   isAnythingHappeningToday || requestRecievedNewBids || bidsGotAwardedToMe;
    const isOnLoginPage = location.pathname === ROUTES.CLIENT.LOGIN_OR_REGISTER;
    const isActingAsTasker =
      userAppView === 'TASKER' || window.location.pathname.includes('bdb-bidder');

    let dontShowPortalHelper =
      window.location.pathname === '/' ||
      /(\/\?).*/.test(window.location.pathname) ||
      pathsWhereWeDontShowPortalDetail.some((path) => window.location.pathname.includes(path));

    const renderTaskerRequesterToggle = (
      <div className="navbar-item">
        <div className="tabs is-centered is-toggle is-toggle-rounded is-small is-mobile">
          <ul>
            <li className={`${!isActingAsTasker && !dontShowPortalHelper && 'is-active'}`}>
              <a
                style={{ padding: '0.25rem', width: 90 }}
                onClick={(e) => {
                  e.preventDefault();
                  this.closeMenuThenExecute(() => {
                    switchRoute(ROUTES.CLIENT.REQUESTER.root);
                  });
                }}
              >
                <span
                  className={`${
                    !isActingAsTasker && !dontShowPortalHelper ? 'has-text-weight-semibold' : ''
                  }`}
                >
                  REQUESTER
                </span>
              </a>
            </li>
            <li className={`${isActingAsTasker && !dontShowPortalHelper && 'is-active'}`}>
              <a
                style={{ padding: '0.25rem', width: 90 }}
                onClick={(e) => {
                  e.preventDefault();
                  this.closeMenuThenExecute(() => {
                    switchRoute(ROUTES.CLIENT.TASKER.root);
                  });
                }}
              >
                <span
                  className={`${
                    isActingAsTasker && !dontShowPortalHelper ? 'has-text-weight-semibold' : ''
                  }`}
                >
                  TASKER
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
    const loggedOutView = (
      <nav
        id="BID_OR_BOO_APP_HEADER"
        className="navbar is-fixed-top"
        style={{
          boxShadow: dontShowPortalHelper
            ? ' 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
            : '',
        }}
      >
        <LoginOrRegisterModal
          isActive={shouldShowLoginDialog && !isOnLoginPage}
          handleCancel={this.toggleLoginDialog}
        />
        <div style={{ flexGrow: 1, cursor: 'pointer' }} className="navbar-brand">
          <a
            style={{ paddingRight: 4, cursor: 'pointer' }}
            id="BidOrBoo-logo-step"
            onClick={() => {
              this.closeMenuThenExecute(() => {
                switchRoute(ROUTES.CLIENT.HOME);
              });
            }}
            className={`navbar-item`}
          >
            <img
              src={logoImg}
              alt="BidOrBoo"
              width="34"
              height="auto"
              style={{ maxHeight: 'unset' }}
            />
            <div
              onClick={() => {
                this.closeMenuThenExecute(() => {
                  switchRoute(ROUTES.CLIENT.HOME);
                });
              }}
            >
              <div
                onClick={() => {
                  this.closeMenuThenExecute(() => {
                    switchRoute(ROUTES.CLIENT.HOME);
                  });
                }}
                style={{ fontSize: 30, cursor: 'pointer', marginLeft: 4 }}
                className="is-hidden-touch"
              >
                <img
                  src={navbarBidOrBoo}
                  alt="BidOrBoo"
                  width="100"
                  height="auto"
                  style={{ maxHeight: 'unset', pointerEvents: 'none' }}
                />
              </div>
            </div>
          </a>

          {renderTaskerRequesterToggle}
          {!isOnLoginPage && (
            <div style={{ flexGrow: 1, flexDirection: 'row-reverse' }} className="navbar-item">
              <a
                style={{
                  borderRadius: 2,
                  fontWeight: 500,
                  border: '1px solid #eee',
                  // boxShadow: 'none',
                }}
                className="button is-link is-small"
                onClick={(e) => {
                  e.preventDefault();
                  switchRoute(ROUTES.CLIENT.LOGIN_OR_REGISTER, {
                    isLoggedIn: false,
                  });
                }}
              >
                LOGIN
              </a>
            </div>
          )}
        </div>
        {/* the switch view button */}
      </nav>
    );

    if (!isLoggedIn) {
      return loggedOutView;
    }

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
        <nav
          id="BID_OR_BOO_APP_HEADER"
          className="navbar is-fixed-top"
          style={{
            boxShadow: dontShowPortalHelper
              ? ' 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
              : '',
          }}
        >
          <LoginOrRegisterModal
            isActive={shouldShowLoginDialog}
            handleCancel={this.toggleLoginDialog}
          />

          <div style={{ flexGrow: 1, cursor: 'pointer' }} className="navbar-brand">
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
              }}
              className="navbar-item has-text-dark"
            >
              <div
                onClick={(e) => {
                  this.closeMenuThenExecute(() => {
                    switchRoute(ROUTES.CLIENT.HOME);
                  });
                }}
              >
                <div
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.HOME);
                    });
                  }}
                  style={{ fontSize: 30, cursor: 'pointer', marginLeft: 4 }}
                  className="is-hidden-touch"
                >
                  <img
                    src={navbarBidOrBoo}
                    alt="BidOrBoo"
                    width="100"
                    height="auto"
                    style={{ maxHeight: 'unset', pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </div>

            {renderTaskerRequesterToggle}

            <a
              onClick={(e) => {
                this.setState({ isHamburgerOpen: !isHamburgerOpen });
              }}
              id="mobile-nav-burger"
              className={classNames('navbar-burger BURGERMENU', {
                'is-active': isHamburgerOpen,
              })}
              data-target="navbarmenu"
              role="button"
              aria-label="menu"
              aria-expanded={isHamburgerOpen}
            >
              <span style={{ position: 'relative' }} aria-hidden="true">
                {(requestRecievedNewBids || bidsGotAwardedToMe) && (
                  <i
                    style={{ position: 'absolute', top: -5, right: -5, fontSize: 8 }}
                    className="has-text-danger fas fa-bell"
                  />
                )}
              </span>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>

          <div
            id="navbarmenu"
            style={{ padding: 0, flexGrow: 'unset' }}
            className={classNames('navbar-menu', {
              'is-active': isHamburgerOpen,
            })}
          >
            <div className="navbar-end">
              <div
                className={`navbar-item dropdown is-right  ${
                  isProfileMenuActive ? 'is-active' : ''
                }`}
              >
                <nav>
                  <div className="navbar-item has-dropdown">
                    <a onClick={this.toggleProfileMenu} className="navbar-link">
                      <span>
                        <figure className="image is-32x32" alt="user profile">
                          <img
                            style={{
                              paddingRight: 4,
                              borderRadius: '100%',
                            }}
                            src={profileImage.url}
                          />
                        </figure>
                      </span>
                      <span className="displayname">{displayName}</span>
                    </a>

                    <div
                      className={`navbar-dropdown is-boxed ${
                        isProfileMenuActive ? 'is-active' : ''
                      }`}
                    >
                      <a
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
                        <span>Profile</span>
                      </a>

                      <hr className="navbar-divider" />
                      <a
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.REQUESTER.root);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
                        }`}
                      >
                        {/* <span className="icon">
                          <i className="fas fa-bell"></i>
                        </span> */}
                        <span>Browse Services</span>
                      </a>
                      <a
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.MY_REQUESTS ? 'is-active' : ''
                        }`}
                      >
                        {requestRecievedNewBids && (
                          <span style={{ marginRight: 1 }} className="has-text-danger">
                            <i className="fas fa-bell"></i>
                          </span>
                        )}
                        <span>My Requests</span>
                      </a>
                      <hr className="navbar-divider" />
                      <a
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.TASKER.root);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
                        }`}
                      >
                        {/* <span className="icon">
                          <i className="fas fa-bell"></i>
                        </span> */}
                        <span>Explore Tasks</span>
                      </a>
                      <a
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.TASKER.mybids);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.MY_BIDS ? 'is-active' : ''
                        }`}
                      >
                        {bidsGotAwardedToMe && (
                          <span style={{ marginRight: 1 }} className="has-text-danger">
                            <i className="fas fa-bell"></i>
                          </span>
                        )}
                        <span>My Bids</span>
                      </a>
                      <hr className="navbar-divider" />

                      <a
                        // id="myprofile-step"
                        onClick={() => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.MY_PROFILE.myNotifications);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.NOTIFICATIONS ? 'is-active' : ''
                        }`}
                      >
                        <span className="icon">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span>{`Notifications`}</span>
                      </a>
                      <hr className="navbar-divider" />
                      <a
                        onClick={() => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
                          });
                        }}
                        className={`navbar-item ${
                          activeNavBarMenuId === HREF_TO_TABID.PAYMENT_SETTINGS ? 'is-active' : ''
                        }`}
                      >
                        <span className="icon">
                          <i className="far fa-credit-card" aria-hidden="true" />
                        </span>
                        <span>My Payouts</span>
                      </a>
                      <hr className="navbar-divider" />
                      <a
                        onClick={(e) =>
                          this.closeMenuThenExecute(() => {
                            if (!window.fcWidget.isOpen()) {
                              document.querySelector('#bob-ChatSupport') &&
                                document.querySelector('#bob-ChatSupport').click();
                              // window.fcWidget.open();
                            }
                          })
                        }
                        className="navbar-item"
                      >
                        <span className="icon">
                          <i className="far fa-comment-dots" />
                        </span>
                        <span>Support</span>
                      </a>
                      {installWebAppButton && (
                        <>
                          <hr className="navbar-divider" />

                          <a
                            className="navbar-item"
                            onClick={(e) => {
                              this.closeMenuThenExecute(() => {
                                installWebAppButton && installWebAppButton.click();
                              });
                            }}
                          >
                            <span style={{ position: 'relative' }} className="icon">
                              <i className="fas fa-mobile-alt"></i>
                            </span>
                            <span>Install APP</span>
                          </a>
                        </>
                      )}

                      {!window.location.pathname.includes('my-') && (
                        <>
                          <hr className="navbar-divider" />
                          <ShareThisPageHeaderMenuItem
                            closeMenuThenExecute={this.closeMenuThenExecute}
                          />
                        </>
                      )}

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
            </div>
          </div>
        </nav>
        {!dontShowPortalHelper && (
          <div id="bob-currentViewHelper">
            {!isActingAsTasker && (
              <div className="tabs is-centered is-mobile">
                <ul>
                  <li
                    className={`${
                      activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
                    }`}
                  >
                    <a
                      style={{
                        fontWeight:
                          activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? '600' : '300',
                      }}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.REQUESTER.root);
                        });
                      }}
                    >
                      <span>Browse Services</span>
                    </a>
                  </li>
                  <li
                    className={`${
                      activeNavBarMenuId === HREF_TO_TABID.MY_REQUESTS ? 'is-active' : ''
                    }`}
                  >
                    <a
                      style={{
                        fontWeight:
                          activeNavBarMenuId === HREF_TO_TABID.MY_REQUESTS ? '600' : '300',
                      }}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
                        });
                      }}
                    >
                      {requestRecievedNewBids && (
                        <span style={{ marginRight: 1 }} className="has-text-danger">
                          <i className="fas fa-bell"></i>
                        </span>
                      )}
                      <span>My Requests</span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
            {isActingAsTasker && (
              <div className="tabs is-centered is-mobile">
                <ul>
                  <li
                    className={`${
                      activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
                    }`}
                  >
                    <a
                      style={{
                        fontWeight:
                          activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? '600' : '300',
                      }}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.TASKER.root);
                        });
                      }}
                    >
                      <span>Explore Tasks</span>
                    </a>
                  </li>
                  <li
                    className={`${activeNavBarMenuId === HREF_TO_TABID.MY_BIDS ? 'is-active' : ''}`}
                  >
                    <a
                      style={{
                        fontWeight: activeNavBarMenuId === HREF_TO_TABID.MY_BIDS ? '600' : '300',
                      }}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.TASKER.mybids);
                        });
                      }}
                    >
                      {bidsGotAwardedToMe && (
                        <span style={{ marginRight: 1 }} className="has-text-danger">
                          <i className="fas fa-bell"></i>
                        </span>
                      )}
                      <span>My Bids</span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
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
    dispatch,
    onLogout: bindActionCreators(onLogout, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
