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
import logoImg from '../assets/images/android-chrome-192x192.png';
import ShareThisPageHeaderMenuItem from './ShareThisPageHeaderMenuItem.jsx';

const pathsWhereWeDontShowPortalDetail = [
  '/BidOrBoo',
  '/terms-of-service',
  '/reset-password',
  '/my-profile',
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
      if (nextProp.history.location.pathname.includes('bdb-request/root')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.REQUEST_A_SERVICE) {
          return { activeNavBarMenuId: HREF_TO_TABID.REQUEST_A_SERVICE };
        }
      } else if (nextProp.history.location.pathname.includes('bdb-bidder/root')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.PROVIDE_A_SERVICE) {
          return { activeNavBarMenuId: HREF_TO_TABID.PROVIDE_A_SERVICE };
        }
      } else if (nextProp.history.location.pathname.includes('my-open-requests')) {
        if (prevState.activeNavBarMenuId !== HREF_TO_TABID.MY_REQUESTS) {
          return { activeNavBarMenuId: HREF_TO_TABID.MY_REQUESTS };
        }
      } else if (nextProp.history.location.pathname.includes('my-bids')) {
        console.info('nextProp.history.location.pathname.includes(my-bids)');
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
      requestsHappeningToday,
      bidsHappeningToday,
    } = notificationFeed;

    const installWebAppButton = document.querySelector('#bob-installWebApp');

    const isThereRequestsHappeningToday =
      requestsHappeningToday && requestsHappeningToday.length > 0;
    const isThereBidsHappeningToday = bidsHappeningToday && bidsHappeningToday.length > 0;
    const isAnythingHappeningToday = isThereRequestsHappeningToday || isThereBidsHappeningToday;

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

    const loggedOutView = (
      <>
        <nav id="BID_OR_BOO_APP_HEADER" className="navbar is-fixed-top">
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
                  style={{ fontSize: 24, cursor: 'pointer', marginLeft: 4 }}
                  className="is-hidden-touch"
                >
                  <span style={{ color: '#ee2a36', fontWeight: 500 }}>B</span>id
                  <span style={{ color: '#ee2a36', fontWeight: 500 }}>O</span>r
                  <span style={{ color: '#ee2a36', fontWeight: 500 }}>B</span>oo
                </div>
              </div>
            </a>

            <div style={{ flexGrow: 1 }} className="navbar-item">
              {/* <a
                className={`navbar-item ${
                  activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
                }`}
                onClick={(e) => {
                  this.closeMenuThenExecute(() => {
                    switchRoute(ROUTES.CLIENT.REQUESTER.root);
                  });
                }}
              >
                <span className="icon">
                  <i className="far fa-plus-square" />
                </span>
                <span>REQUEST</span>
              </a>
              <a
                className={`navbar-item ${
                  activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
                }`}
                onClick={(e) => {
                  this.closeMenuThenExecute(() => {
                    switchRoute(ROUTES.CLIENT.TASKER.root);
                  });
                }}
              >
                <span className="icon">
                  <i className="fas fa-hand-rock" />
                </span>
                <span>BID</span>
              </a> */}
            </div>
            {!isOnLoginPage && (
              <div className=" navbar-item">
                <a
                  style={{ borderRadius: 2, fontWeight: 500, border: '1px solid #eee' }}
                  className="button is-link is-inverted is-small"
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
        </nav>
        {!dontShowPortalHelper && (
          <div id="bob-currentViewHelper">
            <div style={{ display: 'inline-block' }}>
              <div className="has-text-centered" style={{ display: 'inline-block' }}>
                <span
                  style={{ cursor: 'pointer', width: 135 }}
                  onClick={(e) => {
                    e.preventDefault();
                    switchRoute(ROUTES.CLIENT.REQUESTER.root);
                  }}
                  style={{
                    borderRadius: '25px 0 0 25px',
                    borderRight: '1px solid rgb(219, 219, 219)',
                    boxShadow: 'none',
                  }}
                  className="button is-small is-outlined"
                >
                  <span className="icon">
                    {!isActingAsTasker ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="far fa-circle"></i>
                    )}
                  </span>
                  <span
                    className={`${!isActingAsTasker ? 'has-text-weight-semibold' : null}`}
                    style={{ width: 100 }}
                  >
                    Requester View
                  </span>
                </span>
              </div>
              <div className="has-text-centered" style={{ display: 'inline-block' }}>
                <span
                  style={{ cursor: 'pointer', width: 135 }}
                  onClick={(e) => {
                    e.preventDefault();
                    switchRoute(ROUTES.CLIENT.TASKER.root);
                  }}
                  style={{
                    borderRadius: '0 25px 25px 0',
                    borderLeft: '1px solid rgb(219, 219, 219)',
                    boxShadow: 'none',
                  }}
                  className="button is-small is-outlined"
                >
                  <span
                    className={`${isActingAsTasker ? 'has-text-weight-semibold' : null}`}
                    style={{ marginRight: 4, width: 100 }}
                  >
                    Tasker View
                  </span>

                  <span className="icon">
                    {isActingAsTasker ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="far fa-circle"></i>
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </>
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
        {/* is-spaced is a good prop to add  */}
        <nav id="BID_OR_BOO_APP_HEADER" className="navbar is-fixed-top">
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
                  style={{ fontSize: 24, cursor: 'pointer', marginLeft: 4 }}
                  className="is-hidden-touch"
                >
                  <span style={{ color: '#ee2a36', fontWeight: 500 }}>B</span>id
                  <span style={{ color: '#ee2a36', fontWeight: 500 }}>O</span>r
                  <span style={{ color: '#ee2a36', fontWeight: 500 }}>B</span>oo
                </div>
              </div>
            </div>

            {/* {onlyShowReqAndBidButtons && (
              <div className="navbar-item">
                <a
                  className={`navbar-item ${
                    activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
                  }`}
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.REQUESTER.root);
                    });
                  }}
                >
                  <span style={{ position: 'relative' }} className="icon">
                    <i className="far fa-plus-square" />
                    {requestRecievedNewBids && (
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
                  <span>REQUEST</span>
                </a>
                <a
                  className={`navbar-item ${
                    activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
                  }`}
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.TASKER.root);
                    });
                  }}
                >
                  <span style={{ position: 'relative' }} className="icon">
                    <i className="fas fa-hand-rock" />
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
                        className="icon has-text-danger"
                      >
                        <i className="fas fa-circle" />
                      </span>
                    )}
                  </span>
                  <span>BID</span>
                </a>
              </div>
            )} */}

            <div className="navbar-item is-hidden-desktop">
              {!isActingAsTasker && (
                <React.Fragment>
                  <a
                    className={`navbar-item ${
                      activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
                    }`}
                    onClick={(e) => {
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.REQUESTER.root);
                      });
                    }}
                  >
                    <span className="icon">
                      <i className="far fa-plus-square" />
                    </span>
                    <span>REQUEST</span>
                  </a>

                  <a
                    className={`navbar-item ${
                      activeNavBarMenuId === HREF_TO_TABID.MY_REQUESTS ? 'is-active' : ''
                    }`}
                    onClick={(e) => {
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
                      });
                    }}
                  >
                    <span style={{ position: 'relative' }} className="icon">
                      <i className="fas fa-list" />
                      {requestRecievedNewBids && (
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
                    <span>MY REQS.</span>
                  </a>
                </React.Fragment>
              )}

              {isActingAsTasker && (
                <React.Fragment>
                  <a
                    className={`navbar-item ${
                      activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
                    }`}
                    onClick={(e) => {
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.TASKER.root);
                      });
                    }}
                  >
                    <span className="icon">
                      <i className="fas fa-hand-rock" />
                    </span>
                    <span>BID</span>
                  </a>

                  <a
                    onClick={(e) => {
                      this.closeMenuThenExecute(() => {
                        return switchRoute(ROUTES.CLIENT.TASKER.mybids);
                      });
                    }}
                    className={`navbar-item ${
                      activeNavBarMenuId === HREF_TO_TABID.MY_BIDS ? 'is-active' : ''
                    }`}
                  >
                    <span style={{ position: 'relative' }} className="icon">
                      <i className="fas fa-list" />
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
                    <span>MY BIDS</span>
                  </a>
                </React.Fragment>
              )}
            </div>

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

            {/* {isNotificationMenuActive &&
              ReactDOM.createPortal(
                <NotificationsModal onClose={this.toggleNotificationMenu} />,
                this.modalRootNode,
              )} */}

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
                {(requestRecievedNewBids || bidsGotAwardedToMe) && (
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
            <div className="navbar-end">
              {/* {!onlyShowReqAndBidButtons && ( */}
              <div className="navbar-item is-hidden-touch">
                {!isActingAsTasker && (
                  <>
                    <a
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.REQUEST_A_SERVICE ? 'is-active' : ''
                      }`}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.REQUESTER.root);
                        });
                      }}
                    >
                      <span className="icon">
                        <i className="far fa-plus-square" />
                      </span>
                      <span>REQUEST</span>
                    </a>
                    <a
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.MY_REQUESTS ? 'is-active' : ''
                      }`}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
                        });
                      }}
                    >
                      <span style={{ position: 'relative' }} className="icon">
                        <i className="fas fa-list" />
                        {requestRecievedNewBids && (
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
                      <span>MY REQUESTS</span>
                    </a>
                  </>
                )}

                {isActingAsTasker && (
                  <>
                    <a
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.PROVIDE_A_SERVICE ? 'is-active' : ''
                      }`}
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.TASKER.root);
                        });
                      }}
                    >
                      <span className="icon">
                        <i className="fas fa-hand-rock" />
                      </span>
                      <span>BID</span>
                    </a>
                    <a
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          return switchRoute(ROUTES.CLIENT.TASKER.mybids);
                        });
                      }}
                      className={`navbar-item ${
                        activeNavBarMenuId === HREF_TO_TABID.MY_BIDS ? 'is-active' : ''
                      }`}
                    >
                      <span style={{ position: 'relative' }} className="icon">
                        <i className="fas fa-list" />
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
                      <span>MY BIDS</span>
                    </a>
                  </>
                )}
              </div>
              {/* )} */}

              <div
                // id="myprofile-step"
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
                      {isLoggedIn && (
                        <React.Fragment>
                          {isActingAsTasker ? (
                            <a
                              id="switch-role-step"
                              onClick={(e) =>
                                this.closeMenuThenExecute(() => {
                                  switchRoute(ROUTES.CLIENT.REQUESTER.root);
                                })
                              }
                              className="navbar-item"
                            >
                              <span style={{ position: 'relative' }} className="icon">
                                <i className="fas fa-exchange-alt" />
                                {requestRecievedNewBids && (
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
                                  switchRoute(ROUTES.CLIENT.TASKER.root);
                                })
                              }
                              className="navbar-item"
                            >
                              <span style={{ position: 'relative' }} className="icon">
                                <i className="fas fa-exchange-alt" />
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
                        // id="myprofile-step"
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
                        <span>{`Profile`}</span>
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
                          <i className="fas fa-bell"></i>
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
                            <span>WEB APP</span>
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
            <div style={{ display: 'inline-block' }}>
              <div className="has-text-centered" style={{ display: 'inline-block' }}>
                <span
                  style={{ cursor: 'pointer', width: 135 }}
                  onClick={(e) => {
                    e.preventDefault();
                    switchRoute(ROUTES.CLIENT.REQUESTER.root);
                  }}
                  style={{
                    borderRadius: '25px 0 0 25px',
                    borderRight: '1px solid rgb(219, 219, 219)',
                    boxShadow: 'none',
                  }}
                  className="button is-small is-outlined"
                >
                  <span className="icon">
                    {!isActingAsTasker ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="far fa-circle"></i>
                    )}
                  </span>
                  <span
                    className={`${!isActingAsTasker ? 'has-text-weight-semibold' : null}`}
                    style={{ width: 100 }}
                  >
                    Requester View
                  </span>
                </span>
              </div>
              <div className="has-text-centered" style={{ display: 'inline-block' }}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    switchRoute(ROUTES.CLIENT.TASKER.root);
                  }}
                  style={{
                    borderRadius: '0 25px 25px 0',
                    borderLeft: '1px solid rgb(219, 219, 219)',
                    boxShadow: 'none',
                  }}
                  className="button is-small is-outlined"
                >
                  <span
                    className={`${isActingAsTasker ? 'has-text-weight-semibold' : null}`}
                    style={{ marginRight: 4, width: 100 }}
                  >
                    Tasker View
                  </span>

                  <span className="icon">
                    {isActingAsTasker ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="far fa-circle"></i>
                    )}
                  </span>
                </span>
              </div>
            </div>
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
