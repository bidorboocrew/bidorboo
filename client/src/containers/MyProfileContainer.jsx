import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentUser, onLogout } from '../app-state/actions/authActions';
import { showLoginDialog, toggleSideNav } from '../app-state/actions/uiActions';
import { switchRoute } from '../app-state/actions/routerActions';

import ProfileForm from '../components/forms/ProfileForm';

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

  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false
    };

    this.toggleEditProfile = () => {
      this.setState({ isEditProfile: !this.state.isEditProfile });
    };
  }
  render() {
    const { s_userDetails } = this.props;

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
        <div className="container" id="bdb-profile-content">
          <div className="columns">
            <div className="column is-one-quarter">
              <div className="box" style={{ textAlign: 'center' }}>
                <div>
                  <img
                    alt="profile pic"
                    src={profileImgUrl}
                    className="profileImg"
                  />
                </div>
                <div>
                  <img
                    alt="star rating"
                    src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
                    className="starRating col-xs-12"
                  />
                </div>
                <div style={{ fontSize: 16 }}>{displayName}</div>
                <div style={{ fontSize: 16 }}>{email}</div>
                <div style={{ marginTop: 12 }}>
                  <a className="button is-primary">
                    <i
                      style={{ fontSize: 12 }}
                      className="fas fa-cloud-upload-alt"
                    />
                    <span style={{ marginLeft: 4 }}>Edit Picture</span>
                  </a>
                </div>
              </div>
            </div>
            {/* user details */}
            <div className="column">
              <div className="box">
                {!this.state.isEditProfile && (
                  <div>
                    <HeaderTitle title="General Information" />
                    <DisplayLabelValue
                      labelText="user name:"
                      labelValue={displayName}
                    />
                    <DisplayLabelValue
                      labelText="membership status:"
                      labelValue={membershipStatus}
                    />
                    <DisplayLabelValue
                      labelText="phonenumber:"
                      labelValue={phoneNumber || 'please add'}
                    />

                    <HeaderTitle specialMarginVal={8} title="Address Section" />
                    <DisplayLabelValue
                      labelText="address:"
                      labelValue={
                        !address
                          ? 'please add'
                          : `${address.unit} ${address.city} ${
                              address.province
                            } ${address.state} ${address.postalCode} ${
                              address.country
                            } ${address.extras}`
                      }
                    />

                    <HeaderTitle specialMarginVal={8} title="Payment Details" />
                    <DisplayLabelValue
                      labelText="credit card:"
                      labelValue={creditCardsString}
                    />
                    <HeaderTitle
                      specialMarginVal={8}
                      title="Self Description"
                    />
                    <DisplayLabelValue
                      labelText="personal paragraph:"
                      labelValue={
                        personalParagraph ? personalParagraph : 'no description'
                      }
                    />

                    <div style={{ marginTop: 12 }}>
                      <a
                        className="button is-primary"
                        onClick={() => {
                          this.toggleEditProfile();
                        }}
                      >
                        <i style={{ fontSize: 12 }} className="far fa-edit" />
                        <span style={{ marginLeft: 4 }}>
                          Edit Profile Details
                        </span>
                      </a>
                    </div>
                  </div>
                )}
                {this.state.isEditProfile && (
                  <div>
                    <HeaderTitle title="Edit Profile Deails" />

                    <ProfileForm
                      onCancel={this.toggleEditProfile}
                      onSubmit={onSubmit}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* advertisement */}
            <div className="column is-one-quarter">
              <div className="box" style={{ textAlign: 'center' }}>
                <div>Ads</div>
                <div>
                  <img
                    alt="profile pic"
                    src="https://digitalsynopsis.com/wp-content/uploads/2017/01/creative-print-ads-copywriting-challenge-8.png"
                    className="profileImg"
                  />
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

const onSubmit = () => {};
const HeaderTitle = props => {
  const { title, specialMarginVal } = props;
  return (
    <h2
      style={{
        marginTop: specialMarginVal || 0,
        marginBottom: 4,
        fontWeight: 500,
        fontSize: 18,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      {title}
    </h2>
  );
};
const DisplayLabelValue = props => {
  return (
    <div style={{ fontSize: 14, padding: 4, marginBottom: 4 }}>
      <span style={{ color: 'grey' }}>{props.labelText}</span>
      <span> {props.labelValue}</span>
    </div>
  );
};
// const EditProfile = props => {
//   const { isActive, title, handleCancel } = props;
//   const openModalClass = classNames('modal', { 'is-active': props.isActive });
//   return isActive ? (
//     <div className={openModalClass}>
//       <div onClick={handleCancel} className="modal-background" />
//       <div className="modal-card">
//         <header className="modal-card-head">
//           <p className="modal-card-title">{title}</p>
//           <button className="delete" aria-label="close" />
//         </header>
//         <section className="modal-card-body">
//           <ProfileForm onSubmit={onSubmit} />
//         </section>
//         <footer className="modal-card-foot">
//           <button className="button is-primary">Save Changes</button>
//           <button onClick={handleCancel} className="button">
//             Cancel
//           </button>
//         </footer>
//       </div>
//     </div>
//   ) : null;
// };
