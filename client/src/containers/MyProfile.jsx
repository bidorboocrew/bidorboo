import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import {
  updateProfileDetails,
  updateProfileImage
} from '../app-state/actions/userModelActions';
import * as C from '../constants/constants';
import autoBind from 'react-autobind';
import classNames from 'classnames';

import ProfileForm from '../components/forms/ProfileForm';
import FileUploaderComponent from '../components/FileUploaderComponent';

class MyProfile extends React.Component {
  static propTypes = {
    s_userDetails: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      profileImage: PropTypes.shape({
        url: PropTypes.string.isRequired,
        public_id: PropTypes.string
      })
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false,
      showImageUploadDialog: false
    };
    autoBind(
      this,
      'toggleEditProfile',
      'closeFormAndSubmit',
      'toggleShowUploadProfileImageDialog'
    );
  }

  toggleEditProfile() {
    this.setState({ isEditProfile: !this.state.isEditProfile });
  }

  toggleShowUploadProfileImageDialog() {
    this.setState({ showImageUploadDialog: !this.state.showImageUploadDialog });
  }

  closeFormAndSubmit(vals) {
    this.toggleEditProfile();
    this.props.a_updateProfileDetails(vals);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { s_userDetails, a_updateProfileImage } = this.props;

    const {
      profileImage,
      displayName,
      email,
      personalParagraph,
      membershipStatus,
      phoneNumber
    } = s_userDetails;

    const membershipStatusDisplay =
      C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    return (
      <React.Fragment>
        {uploadImageDialog(
          this.toggleShowUploadProfileImageDialog,
          this.state.showImageUploadDialog,
          a_updateProfileImage
        )}

        <div className="slide-in-left" id="bdb-myprofile">
          <section className="hero is-small is-dark">
            <div className="hero-body">
              <div className="container">
                <h1 style={{ color: 'white' }} className="title">
                  My Profile
                </h1>
              </div>
            </div>
          </section>
          <section className="mainSectionContainer">
            <div className="container" id="bdb-profile-content">
              <div className="columns">
                {userImageAndStats(
                  this.toggleShowUploadProfileImageDialog,
                  profileImage,
                  displayName,
                  email,
                  membershipStatusDisplay
                )}
                {/* user details */}
                {userEditableInfo(
                  s_userDetails,
                  this.state.isEditProfile,
                  displayName,
                  email,
                  phoneNumber,
                  personalParagraph,
                  this.toggleEditProfile,
                  this.closeFormAndSubmit
                )}
                {/* advertisement */}
                {advertisement()}
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
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
    a_updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    a_updateProfileImage: bindActionCreators(updateProfileImage, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfile);

// profile components ----------------------------------------------------------------------------

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

const userImageAndStats = (
  toggleShowUploadProfileImageDialog,
  profileImage,
  displayName,
  email,
  membershipStatusDisplay
) => {
  return (
    <React.Fragment>
      <div className="column is-one-quarter">
        <div className=" has-text-centered">
          <div>
            <img
              alt="profile pic"
              src={profileImage.url}
              className="profileImg"
            />
          </div>
          <a
            onClick={e => {
              e.preventDefault();
              toggleShowUploadProfileImageDialog();
            }}
            className="button is-outlined is-fullwidth is-small"
          >
            upload a new Image
          </a>
          <br />
          <div>
            <img
              alt="star rating"
              src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
              className="starRating"
            />
          </div>
          <div>{displayName}</div>
          <div>{email}</div>
          <DisplayLabelValue
            labelText="Membership Status:"
            labelValue={membershipStatusDisplay}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

const userEditableInfo = (
  s_userDetails,
  isEditProfile,
  displayName,
  email,
  phoneNumber = 'none provided',
  personalParagraph = 'none provided',
  toggleEditProfile,
  closeFormAndSubmit
) => {
  return (
    <div className="column">
      <div>
        {!isEditProfile && (
          <div>
            <HeaderTitle title="General Information" />
            <DisplayLabelValue
              labelText="User Name:"
              labelValue={displayName}
            />
            <DisplayLabelValue labelText="Email:" labelValue={email} />
            <DisplayLabelValue
              labelText="Phone Number:"
              labelValue={phoneNumber}
            />
            <HeaderTitle specialMarginVal={8} title="About Me" />
            <TextareaAutosize
              value={personalParagraph}
              className="textarea is-marginless is-paddingless"
              style={{
                resize: 'none',
                border: 'none',
                color: '#4a4a4a',
                background: 'whitesmoke'
              }}
              readOnly
            />

            <div style={{ marginTop: 12 }}>
              <a
                className="button is-primary"
                onClick={() => {
                  toggleEditProfile();
                }}
              >
                <i style={{ fontSize: 12 }} className="far fa-edit" />
                <span style={{ marginLeft: 4 }}>Edit Profile Details</span>
              </a>
            </div>
          </div>
        )}
        {isEditProfile && (
          <div>
            <HeaderTitle title="Edit Profile Details" />

            <ProfileForm
              userDetails={s_userDetails}
              onCancel={toggleEditProfile}
              onSubmit={closeFormAndSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const advertisement = () => {
  return (
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
  );
};

const uploadImageDialog = (
  toggleUploadDialog,
  showImageUploadDialog,
  updateProfileImage
) => {
  return (
    <div
      className={classNames('modal', {
        'is-active': showImageUploadDialog
      })}
    >
      <div onClick={toggleUploadDialog} className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Update Profile Image</p>
          <button
            onClick={toggleUploadDialog}
            className="delete"
            aria-label="close"
          />
        </header>
        <section className="modal-card-body">
          <FileUploaderComponent
            closeDialog={toggleUploadDialog}
            uploadFilesAction={updateProfileImage}
          />
        </section>
      </div>
    </div>
  );
};
