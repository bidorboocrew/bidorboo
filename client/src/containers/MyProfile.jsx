import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails } from '../app-state/actions/userModelActions';
import * as C from '../constants/constants';
import autoBind from 'react-autobind';

import ProfileForm from '../components/forms/ProfileForm';

class MyProfile extends React.Component {
  static propTypes = {
    s_userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImgUrl: PropTypes.string.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false
    };
    autoBind(this, 'toggleEditProfile', 'closeFormAndSubmit');
  }

  toggleEditProfile() {
    this.setState({ isEditProfile: !this.state.isEditProfile });
  }
  closeFormAndSubmit(vals) {
    this.toggleEditProfile();
    this.props.a_updateProfileDetails(vals);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { s_userDetails } = this.props;

    const {
      profileImgUrl,
      displayName,
      email,
      // address,
      personalParagraph,
      // creditCards,
      membershipStatus,
      phoneNumber
    } = s_userDetails;

    // const creditCardsString =
    //   creditCards && creditCards.length > 0
    //     ? `${creditCards}`
    //     : 'edit your profile to add';
    const membershipStatusDisplay =
      C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    return (
      <div className="fade-in" id="bdb-myprofile">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Profile
              </h1>
            </div>
          </div>
        </section>
        <section className="section mainSectionContainer">
          <div className="container" id="bdb-profile-content">
            <div className="columns">
              <div className="column is-one-quarter">
                <div className=" has-text-centered">
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
                      className="starRating"
                    />
                  </div>
                  <div>{displayName}</div>
                  <div>{email}</div>
                </div>
              </div>
              {/* user details */}
              <div className="column">
                <div>
                  {!this.state.isEditProfile && (
                    <div>
                      <HeaderTitle title="General Information" />
                      <DisplayLabelValue
                        labelText="User Name:"
                        labelValue={displayName}
                      />
                      <DisplayLabelValue
                        labelText="Membership Status:"
                        labelValue={membershipStatusDisplay}
                      />
                      <DisplayLabelValue
                        labelText="Phone Number:"
                        labelValue={phoneNumber || 'not provided'}
                      />
                      <HeaderTitle specialMarginVal={8} title="About Me" />
                      <TextareaAutosize
                        value={
                          personalParagraph
                            ? personalParagraph
                            : 'none provided'
                        }
                        className="textarea is-marginless is-paddingless"
                        style={{
                          resize: 'none',
                          border: 'none',
                          color: '#4a4a4a'
                        }}
                        readOnly
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
                      <HeaderTitle title="Edit Profile Details" />

                      <ProfileForm
                        userDetails={s_userDetails}
                        onCancel={this.toggleEditProfile}
                        onSubmit={this.closeFormAndSubmit}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* advertisement */}
              <div className="column is-one-quarter">
                <div style={{ textAlign: 'center' }}>
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
      </div>
    );
  }
}

const mapStateToProps = ({ userModelReducer }) => {
  return {
    s_userDetails: userModelReducer.userDetails
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

const HeaderTitle = props => {
  const { title, specialMarginVal } = props;
  return (
    <h2
      style={{
        marginTop: specialMarginVal || 0,
        marginBottom: 4,
        fontWeight: 500,
        fontSize: 20,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      {title}
    </h2>
  );
};
const DisplayLabelValue = props => {
  return (
    <div style={{ padding: 4, marginBottom: 4 }}>
      <div style={{ color: 'grey', fontSize: 14 }}>{props.labelText}</div>
      <div style={{ fontSize: 16 }}> {props.labelValue}</div>
    </div>
  );
};
