import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../app-state/actions/userModelActions';
import * as C from '../constants/constants';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import axios from 'axios';
import ProfileForm from '../components/forms/ProfileForm';
import FileUploaderComponent from '../components/FileUploaderComponent';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false,
      showImageUploadDialog: false,
    };
    autoBind(this, 'toggleEditProfile', 'closeFormAndSubmit', 'toggleShowUploadProfileImageDialog');

    this.widget = window.cloudinary.createUploadWidget(
      {
        uploadSignature: (callback, paramsToSign) => {
          debugger;
          axios
            .get('/api/user/paramstosign', { params: paramsToSign })
            .then((res) => {
              if (res && res.data) {
                const { signature } = res.data;
                debugger;
                callback(signature);
              }
            })
            .catch((e) => {
              debugger;
            });
        },
        cloudName: 'hr6bwgs1p',
        uploadPreset: 'saveCropped',
        apiKey: '199892955566316',
        sources: ['local'],
        maxFiles: '1',
        multiple: 'false',
        folder: 'Profile',
        tag: 'profile-pic',
        resourceType: 'image',
        cropping: true,
        clientAllowedFormats: ['png', 'gif', 'jpeg', 'tiff', 'jpg', 'bmp'],
        maxFileSize: 3000000, // 3MB
        maxImageWidth: 800,
        maxImageHeight: 600,
        minImageWidth: 100,
        minImageHeight: 100,
        validateMaxWidthHeight: true,
        croppingValidateDimensions: true,
        croppingShowDimensions: true,
        croppingShowBackButton: true,
        croppingCoordinatesMode: 'custom',
        // showCompletedButton: true,
        showPoweredBy: false,
        text: {
          en: {
            or: 'Or',
            close: 'Close',
            menu: {
              files: 'MY Files',
            },
            selection_counter: {
              selected: 'selected',
            },
            actions: {
              upload: 'Upload',
              clear_all: 'Clear all',
              log_out: 'Log out',
            },
            notifications: {
              general_error: 'An error has occurred',
              general_prompt: 'Are you sure?',
              limit_reached: 'No more files can be selected',
              invalid_add_url: 'Added URL must be valid',
              invalid_public_id: 'Public ID cannot contain \\,?,&,#,%,<,>',
              no_new_files: 'File(s) have already been uploaded',
            },
            landscape_overlay: {
              title: "Landscape mode isn't supported",
              description: 'Rotate back to portrait mode to continue.',
            },
            local: {
              main_title: 'BidOrBoo upload profile pic',
            },
          },
        },
        theme: 'white',
        buttonClass: 'button is-primary is-large',
        buttonCaption: 'Upload image',
      },
      (error, result) => {
        if (result.event === 'success') {
          debugger;
          this.toggleShowUploadProfileImageDialog();
        } else {
          debugger;
        }
      },
    );
  }

  toggleEditProfile() {
    this.setState({ isEditProfile: !this.state.isEditProfile });
  }

  toggleShowUploadProfileImageDialog() {
    this.setState({ showImageUploadDialog: !this.state.showImageUploadDialog }, () => {
      this.state.showImageUploadDialog ? this.widget.open() : this.widget.close({ quiet: true });
    });
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
        {/* {uploadImageDialog(
          this.toggleShowUploadProfileImageDialog,
          this.state.showImageUploadDialog,
          a_updateProfileImage,
        )} */}

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
          <section className="bdbPage">
            <div className="container" id="bdb-profile-content">
              <div className="columns">
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
                )}
                {/* advertisement */}
                {/* {advertisement()} */}
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
    userDetails: userModelReducer.userDetails,
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
      <div className="column is-one-quarter">
        <div className="has-text-centered">
          <figure style={{ margin: '0 auto' }} className="image  is-128x128">
            <img alt="profile" src={profileImage.url} />
          </figure>
          <br />
          <a
            onClick={(e) => {
              e.preventDefault();
              toggleShowUploadProfileImageDialog();
            }}
            className="button is-outlined is-small"
          >
            edit Image
          </a>

          <div>
            <img
              alt="star rating"
              src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
              className="starRating"
            />
          </div>
          <div>{displayName}</div>
          <div>{email}</div>
          <DisplayLabelValue labelText="Membership Status:" labelValue={membershipStatusDisplay} />
        </div>
      </div>
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
) => {
  return (
    <div className="column">
      <div>
        {!isEditProfile && (
          <div>
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
                background: 'white',
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
              userDetails={userDetails}
              onCancel={toggleEditProfile}
              onSubmit={closeFormAndSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// const advertisement = () => {
//   return (
//     <div className="column is-one-quarter">
//       <div style={{ textAlign: 'center' }}>
//         <div>Ads</div>
//         <div>
//           <img
//             alt="profile"
//             src="https://digitalsynopsis.com/wp-content/uploads/2017/01/creative-print-ads-copywriting-challenge-8.png"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const uploadImageDialog = (toggleUploadDialog, showImageUploadDialog, updateProfileImage) => {

//   return showImageUploadDialog ? (
//     <div className="modal is-active">
//       <div onClick={toggleUploadDialog} className="modal-background" />
//       <div className="modal-card">
//         <header className="modal-card-head">
//           <p className="modal-card-title">Update Profile Image</p>
//           <button onClick={toggleUploadDialog} className="delete" aria-label="close" />
//         </header>
//         <section className="modal-card-body">
//           <FileUploaderComponent
//             closeDialog={toggleUploadDialog}
//             uploadFilesAction={updateProfileImage}
//           />
//         </section>
//       </div>
//     </div>
//   ) : null;
// };
