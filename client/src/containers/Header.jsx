import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { onLogout } from '../app-state/actions/authActions';
import LoginOrRegisterModal from '../LoginOrRegisterModal';
import { showLoginDialog } from '../app-state/actions/uiActions';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { NotificationsModal } from './index';

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
      isNotificationMenuActive: false,
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
    this.props.a_showLoginDialog(!this.props.shouldShowLoginDialog);
  };

  toggleProfileMenu = () => {
    this.setState({ isProfileMenuActive: !this.state.isProfileMenuActive });
  };

  toggleNotificationMenu = () => {
    this.setState({ isNotificationMenuActive: !this.state.isNotificationMenuActive });
  };

  render() {
    const {
      displayName,
      isLoggedIn,
      userDetails,
      a_onLogout,
      shouldShowLoginDialog,
      notificationFeed,
      userAppView,
    } = this.props;

    const { profileImage } = userDetails;

    const { isHamburgerOpen, isProfileMenuActive, isNotificationMenuActive } = this.state;

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
          className="navbar is-fixed-top has-shadow nav-bottom-border"
        >
          <LoginOrRegisterModal
            isActive={shouldShowLoginDialog}
            handleCancel={this.toggleLoginDialog}
          />

          <div className="navbar-brand">
            <a
              id="BidOrBoo-logo-step"
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
                style={{
                  paddingLeft: 2,
                  marginBottom: -2,
                  transform: 'scaleY(1.1)',
                  fontWeight: 500,
                }}
                className="has-text-dark is-size-4 is-hidden-touch"
              >
                BidOrBoo
              </span>
              <span
                style={{
                  paddingLeft: 2,
                  marginBottom: -2,
                  transform: 'scaleY(1.1)',
                  fontWeight: 500,
                }}
                className="has-text-dark is-size-4 is-hidden-desktop"
              >
                B.O.B
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
            {/* {isLoggedIn && (
              <div className="navbar-item is-hidden-touch">
                <a
                  className={`button is-outline ${
                    window.location.pathname.includes('my-calendar') ? 'is-info' : ''
                  }`}
                  onClick={() => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.MYAGENDA);
                    });
                  }}
                >
                  <span className="icon">
                    <i className="far fa-calendar-alt" />
                  </span>
                  <span>My Agenda</span>
                </a>
              </div>
            )} */}

            {isLoggedIn && showNotificationButton && (
              <div className="navbar-item">
                <a
                  style={{ border: '1px solid rgb(238, 238, 238)' }}
                  onClick={this.toggleNotificationMenu}
                  className="button is-outlined is-info"
                >
                  <span className="icon">
                    <i className="fas fa-bell" />
                  </span>
                </a>
              </div>
            )}
            {isNotificationMenuActive &&
              ReactDOM.createPortal(
                <NotificationsModal onClose={this.toggleNotificationMenu} />,
                this.modalRootNode,
              )}

            {isLoggedIn && (
              <React.Fragment>
                {isActingAsBidder ? (
                  <a
                    onClick={(e) =>
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.PROPOSER.root);
                      })
                    }
                    className="navbar-item is-hidden-desktop"
                  >
                    <span style={{ position: 'relative' }} className="icon">
                      <i className="fas fa-sync-alt" />
                      {jobRecievedNewBids && (
                        <div
                          style={{ position: 'absolute', top: -6, right: -6, fontSize: 6 }}
                          className="has-text-danger"
                        >
                          <i className="fas fa-circle" />
                        </div>
                      )}
                    </span>
                    <span>
                      <i className="far fa-plus-square" />
                    </span>
                  </a>
                ) : (
                  <a
                    onClick={(e) =>
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.BIDDER.root);
                      })
                    }
                    className="navbar-item is-hidden-desktop"
                  >
                    <span style={{ position: 'relative' }} className="icon">
                      <i className="fas fa-sync-alt" />
                      {bidsGotAwardedToMe && (
                        <div
                          style={{ position: 'absolute', top: -2, right: -3, fontSize: 6 }}
                          className="has-text-danger"
                        >
                          <i className="fas fa-circle" />
                        </div>
                      )}
                    </span>
                    <span>
                      <i className="fas fa-hand-rock" />
                    </span>
                  </a>
                )}
              </React.Fragment>
            )}
            <a
              onClick={(e) => {
                this.setState({ isHamburgerOpen: !isHamburgerOpen });
              }}
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
            className={classNames('navbar-menu', {
              'is-active': isHamburgerOpen,
            })}
          >
            <div className="navbar-start" />

            {/* end */}
            <div className="navbar-end">
              <React.Fragment>
                {(!isActingAsBidder || !isLoggedIn) && (
                  <a
                    className={`navbar-item ${
                      window.location.pathname.includes('bdb-request') ? 'is-active' : ''
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
                )}
                {(isActingAsBidder || !isLoggedIn) && (
                  <a
                    className={`navbar-item ${
                      window.location.pathname.includes('bdb-offer') ? 'is-active' : ''
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
                    <span>Provide A Service</span>
                  </a>
                )}
                {isLoggedIn && (
                  <React.Fragment>
                    {!isActingAsBidder && (
                      <a
                        className={`navbar-item ${
                          window.location.pathname.includes('my-open-jobs') ? 'is-active' : ''
                        }`}
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.PROPOSER.getMyOpenJobsPostedJobsTab);
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
                        <span>My Requests</span>
                      </a>
                    )}
                    {isActingAsBidder && (
                      <a
                        onClick={(e) => {
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.BIDDER.mybids);
                          });
                        }}
                        className={`navbar-item ${
                          window.location.pathname.includes('my-bids') ? 'is-active' : ''
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
                        <span>My Bids</span>
                      </a>
                    )}

                    {isLoggedIn && (
                      <React.Fragment>
                        {isActingAsBidder ? (
                          <a
                            onClick={(e) =>
                              this.closeMenuThenExecute(() => {
                                switchRoute(ROUTES.CLIENT.PROPOSER.root);
                              })
                            }
                            className="navbar-item"
                          >
                            <span style={{ position: 'relative' }} className="icon">
                              <i className="fas fa-sync-alt" />
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
                            <span>Request A Service</span>
                          </a>
                        ) : (
                          <a
                            onClick={(e) =>
                              this.closeMenuThenExecute(() => {
                                switchRoute(ROUTES.CLIENT.BIDDER.root);
                              })
                            }
                            className="navbar-item"
                          >
                            <span style={{ position: 'relative' }} className="icon">
                              <i className="fas fa-sync-alt" />
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
                            <span>Provide A Service</span>
                          </a>
                        )}
                      </React.Fragment>
                    )}

                    <div
                      id="myprofile-step"
                      className={`navbar-item dropdown is-right  ${
                        isProfileMenuActive ? 'is-active' : ''
                      }`}
                    >
                      <nav>
                        <div className="navbar-item has-dropdown">
                          <a onClick={this.toggleProfileMenu} className="navbar-link">
                            <figure className="image is-32x32">
                              <img
                                style={{
                                  paddingRight: 4,
                                }}
                                src={profileImage.url}
                              />
                            </figure>
                            {displayName}
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
                              className="navbar-item"
                            >
                              <span className="icon">
                                <i className="far fa-user" aria-hidden="true" />
                              </span>
                              <span>My Profile</span>
                            </a>
                            <hr className="navbar-divider" />

                            {isActingAsBidder && (
                              <React.Fragment>
                                <a
                                  onClick={() => {
                                    this.closeMenuThenExecute(() => {
                                      switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
                                    });
                                  }}
                                  className="navbar-item"
                                >
                                  <span className="icon">
                                    <i className="far fa-credit-card" aria-hidden="true" />
                                  </span>
                                  <span>My Payouts</span>
                                </a>
                                <hr className="navbar-divider" />
                                {/* <a
                                  onClick={() => {
                                    this.closeMenuThenExecute(() => {
                                      switchRoute(ROUTES.CLIENT.MY_PROFILE.pastProvidedServices);
                                    });
                                  }}
                                  className="navbar-item"
                                >
                                  <span className="icon">
                                    <i className="fas fa-history" aria-hidden="true" />
                                  </span>
                                  <span>Fulfilled Offers</span>
                                </a>
                                <hr className="navbar-divider" /> */}
                              </React.Fragment>
                            )}
                            {/* {isLoggedIn && !isActingAsBidder && (
                              <React.Fragment>
                                <a
                                  onClick={() => {
                                    this.closeMenuThenExecute(() => {
                                      switchRoute(ROUTES.CLIENT.MY_PROFILE.pastRequestedServices);
                                    });
                                  }}
                                  className="navbar-item"
                                >
                                  <span className="icon">
                                    <i className="fas fa-history" aria-hidden="true" />
                                  </span>
                                  <span>Fulfilled Requests</span>
                                  <span />
                                </a>
                                <hr className="navbar-divider" />
                              </React.Fragment>
                            )} */}

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
        {/* <div className="is-hidden-touch" style={{ height: '0.75rem' }} /> */}
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
    a_onLogout: bindActionCreators(onLogout, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
