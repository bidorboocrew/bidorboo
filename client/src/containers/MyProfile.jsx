import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../app-state/actions/userModelActions';
import * as C from '../constants/constants';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import ProfileForm from '../components/forms/ProfileForm';
import FileUploaderComponent from '../components/FileUploaderComponent';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false,
      isEditPaymentInfo: false,
      showImageUploadDialog: false,
    };
    autoBind(this, 'toggleEditProfile', 'closeFormAndSubmit', 'toggleShowUploadProfileImageDialog');
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

  render() {
    const { userDetails, a_updateProfileImage } = this.props;

    const {
      profileImage,
      displayName,
      email,
      personalParagraph,
      membershipStatus,
      phoneNumber,
    } = userDetails;

    const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    return (
      <React.Fragment>
        {uploadImageDialog(
          this.toggleShowUploadProfileImageDialog,
          this.state.showImageUploadDialog,
          a_updateProfileImage,
        )}
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div>
              <h1 style={{ color: 'white' }} className="title">
                My Profile
              </h1>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container is-fluid" id="bdb-profile-content">
            <div>
              {userImageAndStats(
                this.toggleShowUploadProfileImageDialog,
                profileImage,
                displayName,
                email,
                membershipStatusDisplay,
              )}
              {/* user details */}
              {userEditableInfo(
                userDetails,
                this.state.isEditProfile,
                displayName,
                email,
                phoneNumber,
                personalParagraph,
                this.toggleEditProfile,
                this.closeFormAndSubmit,
                this.state.isEditPaymentInfo,
              )}
              {/* advertisement */}
              {/* {advertisement()} */}
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    userDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    a_updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyProfile);

// profile components ----------------------------------------------------------------------------

const HeaderTitle = (props) => {
  const { title, specialMarginVal } = props;
  return (
    <h2
      style={{
        marginTop: specialMarginVal || 0,
        marginBottom: 4,
        fontWeight: 500,
        fontSize: 20,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      {title}
    </h2>
  );
};
const DisplayLabelValue = (props) => {
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
  membershipStatusDisplay,
) => {
  return (
    <React.Fragment>
      <div style={{ width: '8rem', background: '#eeeeee' }}>
        <img className="bdb-img-profile-pic" src={`${profileImage.url}`} />
      </div>
      <div>
        <a
          onClick={(e) => {
            e.preventDefault();
            toggleShowUploadProfileImageDialog();
          }}
          className="button is-outlined is-small"
        >
          edit Image
        </a>
      </div>
      <div>{displayName}</div>
      <div>{email}</div>
      <div>{membershipStatusDisplay}</div>
    </React.Fragment>
  );
};

const userEditableInfo = (
  userDetails,
  isEditProfile,
  displayName,
  email,
  phoneNumber = 'none provided',
  personalParagraph = 'none provided',
  toggleEditProfile,
  closeFormAndSubmit,
  isEditPaymentInfo,
) => {
  return (
    <div>
      {!isEditProfile && (
        <section className="section">
          <HeaderTitle title="My Details" />
          <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
          <DisplayLabelValue labelText="Email:" labelValue={email} />
          <DisplayLabelValue labelText="Phone Number:" labelValue={phoneNumber} />
          <HeaderTitle specialMarginVal={8} title="About Me" />
          <TextareaAutosize
            value={personalParagraph}
            className="textarea is-marginless is-paddingless"
            style={{
              resize: 'none',
              border: 'none',
              color: '#4a4a4a',
              background: '#EEEEEE',
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
              <span style={{ marginLeft: 4 }}>Edit My Details</span>
            </a>
          </div>
        </section>
      )}
      {!isEditPaymentInfo && (
        <div>
          <div>
            Yacoub, add slider to enable adding/editing payment details
          </div>

          <HeaderTitle title="My Payment Details" />
        </div>
      )}
      {isEditProfile && (
        <div>
          <HeaderTitle title="Edit My Details" />

          <ProfileForm
            userDetails={userDetails}
            onCancel={toggleEditProfile}
            onSubmit={closeFormAndSubmit}
          />
        </div>
      )}
      {isEditPaymentInfo && (
        <div>
          <HeaderTitle title="Edit Payment Details" />

          {/* <ProfileForm
              userDetails={userDetails}
              onCancel={toggleEditProfile}
              onSubmit={closeFormAndSubmit}
            /> */}
        </div>
      )}
    </div>
  );
};

const uploadImageDialog = (toggleUploadDialog, showImageUploadDialog, updateProfileImage) => {
  return showImageUploadDialog ? (
    <div className="modal is-active">
      <div onClick={toggleUploadDialog} className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Update Profile Image</p>
          <button onClick={toggleUploadDialog} className="delete" aria-label="close" />
        </header>
        <section className="modal-card-body">
          <FileUploaderComponent
            closeDialog={toggleUploadDialog}
            uploadFilesAction={updateProfileImage}
          />
        </section>
      </div>
    </div>
  ) : null;
};
