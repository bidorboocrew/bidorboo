import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser, onLogout } from '../app-state/actions/authActions';
import { showLoginDialog, toggleSideNav } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';

import * as ROUTES from '../constants/route_const';

import ProfileForm from '../components/forms/ProfileForm';

const onSubmit = () => {};
class MyProfileContainer extends React.Component {
  static propTypes = {
    s_userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired,
    // actionList: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     text: PropTypes.string.isRequired,
    //     action: PropTypes.func.isRequired
    //   })
    // ).isRequired,
    s_isLoggedIn: PropTypes.bool.isRequired,
    a_onLogout: PropTypes.func.isRequired,
    a_showLoginDialog: PropTypes.func.isRequired,
    s_isSideNavOpen: PropTypes.bool.isRequired,
    a_switchRoute: PropTypes.func.isRequired
  };

  render() {
    const {
      s_userDetails,
      s_isLoggedIn,
      a_showLoginDialog,
      a_onLogout,
      s_isSideNavOpen,
      a_switchRoute
    } = this.props;

    const {
      profileImgUrl,
      displayName,
      email,
      address,
      personalParagraph,
      creditCards,
      membershipStatus,
      phoneNumber
    } = s_userDetails;

    const creditCardsString =
      creditCards && creditCards.length > 0
        ? `${creditCards}`
        : 'noCredit card found on file';

    return (
      <section className="section">
      <div id="bdb-profile-content">
        <div className="inner row center-xs center-sm start-md start-lg">
          <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
            <div className="row center-xs center-sm start-md start-lg">
              <div
                style={{ padding: 20 }}
                className="col-xs-12
                col-sm-12
                col-md-5
                col-lg-4"
              >
                <div className="col-xs-12">
                  <img
                    alt="profile pic"
                    src={profileImgUrl}
                    className="profileImg"
                  />
                </div>
                <div className="col-xs-12">
                  <img
                    alt="star rating"
                    src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
                    className="starRating col-xs-12"
                  />
                </div>
                <div className="col-xs-12">{displayName}</div>
                <div className="col-xs-12">{email}</div>
                <button>edit profile</button>
              </div>
              <div className="col-xs-12
                col-sm-12
                col-md-7
                col-lg-8">
                <div className="row center-xs center-sm start-md start-lg">
                  <h2
                    className="col-xs-12"
                    style={{ border: '1px solid grey' }}
                  >
                    General Information
                  </h2>
                  <div className="col-xs-12">user name {displayName}</div>
                  <div className="col-xs-12">
                    membership status {membershipStatus}
                  </div>
                  <div className="col-xs-12">phonenumber {phoneNumber}</div>
                  <h2
                    style={{ border: '1px solid grey' }}
                    className="col-xs-12"
                  >
                    Address Section
                  </h2>
                  <div className="col-xs-12">
                    {!address
                      ? 'noaddress'
                      : `${address.unit} ${address.city} ${address.province} ${
                          address.state
                        } ${address.postalCode} ${address.country} ${
                          address.extras
                        }`}
                  </div>
                  <h2
                    style={{ border: '1px solid grey' }}
                    className="col-xs-12"
                  >
                    Payment details
                  </h2>
                  <div className="col-xs-12"> {creditCardsString}</div>
                  <h2
                    style={{ border: '1px solid grey' }}
                    className="col-xs-12"
                  >
                    self description
                  </h2>
                  <div className="col-xs-12"> {personalParagraph ? personalParagraph : 'no description'}</div>
                </div>
                {/* <ProfileForm onSubmit={onSubmit} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    );
  }
}

const mapStateToProps = ({ uiReducer, authReducer, routerReducer }) => {
  return {
    s_isSideNavOpen: uiReducer.isSideNavOpen,
    s_isLoggedIn: authReducer.isLoggedIn,
    s_userDetails: authReducer.userDetails,
    s_currentRoute: routerReducer.currentRoute
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_onLogout: bindActionCreators(onLogout, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_toggleSideNav: bindActionCreators(toggleSideNav, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileContainer);
