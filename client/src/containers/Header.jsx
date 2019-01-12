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
    };
  }

  closeMenuThenExecute = (func) => {
    this.setState({ isHamburgerOpen: false }, func);
  };
  toggleLoginDialog = () => {
    this.props.a_showLoginDialog(!this.props.shouldShowLoginDialog);
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

    return (
      <React.Fragment>
        {this.state.isHamburgerOpen && (
          <div
            style={{ zIndex: 10 }}
            onClick={(e) => {
              this.setState({ isHamburgerOpen: !this.state.isHamburgerOpen });
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
              onClick={(e) => {
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
                    className="tag is-danger has-text-weight-semibold"
                  >
                    <i className="far fa-bell" />
                  </span>
                </div>
              )}

            <a
              onClick={(e) => {
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
          </div>

          <div
            id="navbarmenu"
            className={classNames('navbar-menu', {
              'is-active': this.state.isHamburgerOpen,
            })}
          >
            <div className="navbar-start">
              <div className="navbar-item has-dropdown is-hoverable">
                <a
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.PROPOSER.root);
                    });
                  }}
                  className="navbar-link"
                >
                  <span className="icon">
                    <i className="fa fa-child" />
                  </span>
                  <span>Request a Service</span>

                  {notificationFeed &&
                    notificationFeed.jobIdsWithNewBids &&
                    notificationFeed.jobIdsWithNewBids.length > 0 && (
                      <span
                        style={{
                          marginLeft: 4,
                          width: 24,
                          borderRadius: 100,
                        }}
                        className="tag is-danger has-text-weight-semibold"
                      >
                        <i className="far fa-bell" />
                      </span>
                    )}
                </a>
                <div className="navbar-dropdown is-boxed">
                  <a
                    className="navbar-item"
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
                      className="navbar-item"
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
                          <span style={{ marginLeft: 4 }} className="tag is-danger">
                            {notificationFeed.jobIdsWithNewBids.length}
                          </span>
                        )}
                    </a>
                  )}
                </div>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a
                  onClick={(e) => {
                    this.closeMenuThenExecute(() => {
                      switchRoute(ROUTES.CLIENT.BIDDER.root);
                    });
                  }}
                  className="navbar-link"
                >
                  <span className="icon">
                    <i className="fa fa-hand-paper" aria-hidden="true" />
                  </span>
                  <span>Provide a Service</span>
                  {notificationFeed &&
                    notificationFeed.myBidsWithNewStatus &&
                    notificationFeed.myBidsWithNewStatus.length > 0 && (
                      <span
                        style={{
                          marginLeft: 4,
                          width: 24,
                          borderRadius: 100,
                        }}
                        className="tag is-danger has-text-weight-semibold"
                      >
                        <i className="far fa-bell" />
                      </span>
                    )}
                </a>
                <div className="navbar-dropdown is-boxed">
                  <a
                    className="navbar-item"
                    onClick={(e) => {
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.BIDDER.root);
                      });
                    }}
                  >
                    <span className="icon">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span>New Bid</span>
                  </a>
                  {isLoggedIn && (
                    <a
                      onClick={(e) => {
                        this.closeMenuThenExecute(() => {
                          switchRoute(ROUTES.CLIENT.BIDDER.mybids);
                        });
                      }}
                      className="navbar-item"
                    >
                      <span className="icon">
                        <i className="fas fa-money-check-alt" />
                      </span>
                      <span>My Bids</span>
                      {notificationFeed &&
                        notificationFeed.myBidsWithNewStatus &&
                        notificationFeed.myBidsWithNewStatus.length > 0 && (
                          <span style={{ marginLeft: 4 }} className="tag is-danger">
                            {notificationFeed.myBidsWithNewStatus.length}
                          </span>
                        )}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* end */}
            <div className="navbar-end">
              {isLoggedIn && (
                <div className="navbar-item has-dropdown is-hoverable">
                  <a
                    onClick={(e) => {
                      this.closeMenuThenExecute(() => {
                        switchRoute(ROUTES.CLIENT.MY_PROFILE);
                      });
                    }}
                    className="navbar-link"
                  >
                    <figure className="image is-32x32">
                      <img style={{ paddingRight: 4 }} src={profileImage.url} alt="BidOrBoo" />
                    </figure>
                    {displayName}
                  </a>
                  <div className="navbar-dropdown is-boxed">
                    <a
                      onClick={(e) => {
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
                    Login
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
        {/* this to make up for the flex size of the navbar on desktop */}
        <div className="is-hidden-touch" style={{ height: '1.8rem' }} />
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
