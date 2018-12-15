import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onLogout } from '../app-state/actions/authActions';
import { LoginOrRegisterModal } from '../components/LoginOrRegisterModal';
import { showLoginDialog } from '../app-state/actions/uiActions';
import autoBind from 'react-autobind';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { switchRoute } from '../utils';
import * as ROUTES from '../constants/frontend-route-consts';

class Header extends React.Component {
  static propTypes = {
    userEmail: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImage: PropTypes.shape({
        url: PropTypes.string.isRequired,
        public_id: PropTypes.string,
      }),
    }).isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userEmail: '',
  };

  constructor(props) {
    super(props);
    autoBind(this, 'toggleLoginDialog', 'closeMenuThenExecute');
    this.state = {
      isHamburgerOpen: false,
    };
  }

  closeMenuThenExecute(func) {
    this.setState({ isHamburgerOpen: false }, func);
  }
  toggleLoginDialog() {
    this.props.a_showLoginDialog(!this.props.shouldShowLoginDialog);
  }

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

    let navbarStylesBasedOnRoute = classNames('navbar is-fixed-top nav-bottom-border');

    return (
      <React.Fragment>
        <nav style={{ height: '3.25rem' }} className={navbarStylesBasedOnRoute}>
          {/* brand */}
          <LoginOrRegisterModal
            isActive={shouldShowLoginDialog}
            handleCancel={this.toggleLoginDialog}
          />
          <div className="navbar-brand">
            <a
              onClick={(e) => {
                e.preventDefault();
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
                width="24"
                height="24"
              />
              <span style={{ paddingLeft: 6 }}>BidOrBoo</span>
            </a>

            {/* show on mobile if not  */}
            {!isLoggedIn && (
              <div className="is-hidden-desktop navbar-item">
                <a
                  className="button is-danger heartbeat"
                  onClick={(e) => {
                    e.preventDefault();
                    this.closeMenuThenExecute(() => {
                      this.toggleLoginDialog();
                    });
                  }}
                >
                  Login
                </a>
              </div>
            )}

            {notificationFeed &&
              ((notificationFeed.myBidsWithNewStatus &&
                notificationFeed.myBidsWithNewStatus.length > 0) ||
                (notificationFeed.jobIdsWithNewBids &&
                  notificationFeed.jobIdsWithNewBids.length > 0)) && (
                <div className="is-hidden-desktop navbar-item">
                  <span
                    style={{
                      marginLeft: 4,
                      width: 24,
                      borderRadius: 100,
                    }}
                    className="tag is-dark has-text-weight-semibold"
                  >
                    <i className="far fa-bell" />
                  </span>
                </div>
              )}
            {/* burger menu */}
            <a
              onClick={(e) => {
                e.preventDefault();
                this.setState({ isHamburgerOpen: !this.state.isHamburgerOpen });
              }}
              className={classNames('navbar-burger', {
                'is-active': this.state.isHamburgerOpen,
              })}
              data-target="navbarmenu"
              role="button"
              aria-label="menu"
              aria-expanded={this.state.isHamburgerOpen}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>

            {/* end of burger */}
          </div>

          <div
            id="navbarmenu"
            className={classNames('navbar-menu', {
              'is-active': this.state.isHamburgerOpen,
            })}
          >
            {/* start */}

            <div className="navbar-start">
              <div className="navbar-item has-dropdown is-hoverable">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.PROPOSER.root);
                    });
                  }}
                  className="navbar-link"
                >
                  <span style={{ marginRight: 4 }}>
                    <i className="fa fa-child" aria-hidden="true" />
                  </span>
                  <span>Requests</span>
                  {notificationFeed &&
                    notificationFeed.jobIdsWithNewBids &&
                    notificationFeed.jobIdsWithNewBids.length > 0 && (
                      <span
                        style={{
                          marginLeft: 4,
                          width: 24,
                          borderRadius: 100,
                        }}
                        className="tag is-dark has-text-weight-semibold"
                      >
                        <i className="far fa-bell" />
                      </span>
                    )}
                </a>
                <div className="navbar-dropdown is-boxed">
                  <a
                    className="navbar-item"
                    onClick={(e) => {
                      e.preventDefault();
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.PROPOSER.root);
                      });
                    }}
                  >
                    <span style={{ marginRight: 4 }}>
                      <i className="far fa-plus-square" />
                    </span>
                    <span>Add a Request</span>
                  </a>
                  {isLoggedIn && (
                    <React.Fragment>
                      <a
                        className="navbar-item"
                        onClick={(e) => {
                          e.preventDefault();
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
                          });
                        }}
                      >
                        <span style={{ marginRight: 4 }}>
                          <i className="fas fa-list" />
                        </span>
                        <span>My Requests</span>
                        {notificationFeed &&
                          notificationFeed.jobIdsWithNewBids &&
                          notificationFeed.jobIdsWithNewBids.length > 0 && (
                            <span style={{ marginLeft: 4 }} className="tag is-dark">
                              {notificationFeed.jobIdsWithNewBids.length}
                            </span>
                          )}
                      </a>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.BIDDER.root);
                    });
                  }}
                  className="navbar-link"
                >
                  <span style={{ marginRight: 4 }}>
                    <i className="fa fa-hand-paper" aria-hidden="true" />
                  </span>
                  <span>Bids</span>
                  {notificationFeed &&
                    notificationFeed.myBidsWithNewStatus &&
                    notificationFeed.myBidsWithNewStatus.length > 0 && (
                      <span
                        style={{
                          marginLeft: 4,
                          width: 24,
                          borderRadius: 100,
                        }}
                        className="tag is-dark has-text-weight-semibold"
                      >
                        <i className="far fa-bell" />
                      </span>
                    )}
                </a>
                <div className="navbar-dropdown is-boxed">
                  <a
                    className="navbar-item"
                    onClick={(e) => {
                      e.preventDefault();
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.BIDDER.root);
                      });
                    }}
                  >
                    <span style={{ marginRight: 4 }}>
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span>Add a Bid</span>
                  </a>
                  {isLoggedIn && (
                    <React.Fragment>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.BIDDER.mybids);
                          });
                        }}
                        className="navbar-item"
                      >
                        <span style={{ marginRight: 4 }}>
                          <i className="fas fa-money-check-alt" />
                        </span>
                        <span>My Bids</span>
                        {notificationFeed &&
                          notificationFeed.myBidsWithNewStatus &&
                          notificationFeed.myBidsWithNewStatus.length > 0 && (
                            <span style={{ marginLeft: 4 }} className="tag is-dark">
                              {notificationFeed.myBidsWithNewStatus.length}
                            </span>
                          )}
                      </a>
                      {/* <a
                        className="navbar-item"
                        onClick={(e) => {
                          e.preventDefault();
                          this.closeMenuThenExecute(() => {
                            switchRoute(ROUTES.CLIENT.BIDDER.myAwardedBids);
                          });
                        }}
                      >
                        <span style={{ marginRight: 4 }}>
                          <i className="fas fa-handshake" />
                        </span>
                        <span>Scheduled Work</span>
                      </a> */}
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>

            {/* end */}
            <div className="navbar-end">
              <div className="navbar-item">
                {isLoggedIn && (
                  <div className="field is-grouped">
                    <div className="navbar-item">
                      <div className="navbar-item has-dropdown is-hoverable">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            this.closeMenuThenExecute(() => {
                              switchRoute(ROUTES.CLIENT.MY_PROFILE);
                            });
                          }}
                          className="navbar-link"
                        >
                          <figure style={{ margin: '0 auto' }} className="image is-32x32">
                            <img
                              style={{ paddingRight: 4 }}
                              src={profileImage.url}
                              alt="BidOrBoo"
                            />
                          </figure>
                          {displayName}
                        </a>
                        <div className="navbar-dropdown is-boxed">
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              this.closeMenuThenExecute(() => {
                                switchRoute(ROUTES.CLIENT.MY_PROFILE);
                              });
                            }}
                            className="navbar-item"
                          >
                            <span style={{ marginRight: 4 }}>
                              <i className="far fa-user" aria-hidden="true" />
                            </span>
                            <span>My Profile</span>
                          </a>
                          <hr className="dropdown-divider" />
                          <a
                            onClick={(e) =>
                              this.closeMenuThenExecute(() => {
                                a_onLogout();
                              })
                            }
                            className="navbar-item"
                          >
                            <span style={{ marginRight: 4 }}>
                              <i className="fas fa-sign-out-alt" />
                            </span>
                            <span>Logout</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!isLoggedIn && (
                  <div className="navbar-item">
                    <a
                      className="button is-danger is-medium heartbeat"
                      onClick={(e) => {
                        e.preventDefault();
                        this.closeMenuThenExecute(() => {
                          this.toggleLoginDialog();
                        });
                      }}
                    >
                      Login
                    </a>
                  </div>
                )}
              </div>
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
