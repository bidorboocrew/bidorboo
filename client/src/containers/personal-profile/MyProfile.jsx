import React from 'react';
import ReactStars from 'react-stars';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import * as C from '../../constants/enumConstants';
import ProfileForm from '../../components/forms/ProfileForm';
import axios from 'axios';
import FileUploaderComponent from '../../components/FileUploaderComponent';
import * as ROUTES from '../../constants/frontend-route-consts';
import { getCurrentUser } from '../../app-state/actions/authActions';
import NotificationSettings from './NotificationSettings';
class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false,
      showImageUploadDialog: false,
    };
  }

  toggleEditProfile = () => {
    this.setState({ isEditProfile: !this.state.isEditProfile });
  };

  toggleShowUploadProfileImageDialog = () => {
    this.setState({ showImageUploadDialog: !this.state.showImageUploadDialog });
  };

  closeFormAndSubmit = (vals) => {
    this.toggleEditProfile();
    this.props.updateProfileDetails(vals);
  };

  render() {
    const { userDetails, updateProfileImage, isLoggedIn, getCurrentUser } = this.props;

    if (!isLoggedIn) {
      return null;
    }

    let {
      profileImage,
      displayName,
      email,
      personalParagraph,
      membershipStatus,
      phone,
      rating,
      autoDetectlocation,
    } = userDetails;

    personalParagraph = personalParagraph || 'not provided';
    let phoneNumber = phone.phoneNumber || 'not provided';

    // phone number is provided but it is not verified
    const shouldShowPhoneVerification = phone.phoneNumber && !phone.isVerified;
    // email is provided but it is not verified
    const shouldShowEmailVerification = email.emailAddress && !email.isVerified;

    const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    const { isEditProfile } = this.state;
    return (
      <React.Fragment>
        {uploadImageDialog(
          this.toggleShowUploadProfileImageDialog,
          this.state.showImageUploadDialog,
          updateProfileImage,
        )}

        <div className="container is-widescreen">
          <section className="hero is-white has-text-centered">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">My Profile</h1>
              </div>
            </div>
          </section>
          <hr className="divider" />
          <div className="columns is-centered">
            <div className="column is-narrow">
              {userImageAndStats(
                this.toggleShowUploadProfileImageDialog,
                profileImage,
                membershipStatusDisplay,
                rating,
                displayName,
              )}
            </div>
            <div className="column is-narrow">
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">
                    {!isEditProfile ? (
                      <React.Fragment>
                        <span className="icon">
                          <i className="far fa-user" />
                        </span>
                        <span>My Details</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <span className="icon">
                          <i className="far fa-edit" />
                        </span>
                        <span>Edit My Details</span>
                      </React.Fragment>
                    )}
                  </p>
                  {!isEditProfile && (
                    <a
                      onClick={() => {
                        this.toggleEditProfile();
                      }}
                      className="card-header-icon has-text-success"
                      aria-label="more options"
                    >
                      <span className="icon">
                        <i className="far fa-edit" />
                      </span>
                    </a>
                  )}
                </header>
                <div className="card-content">
                  <div className="content">
                    {!isEditProfile && (
                      <div>
                        <DisplayLabelValue labelText="User Name" labelValue={displayName} />
                        <DisplayLabelValue
                          labelValue={
                            <React.Fragment>
                              Auto Detect Location:
                              {autoDetectlocation && (
                                <span style={{ marginLeft: 6 }} className="has-text-success">
                                  <span className="icon">
                                    <i className="fas fa-check is-success" />
                                  </span>
                                  <span>Enabled</span>
                                </span>
                              )}
                              {!autoDetectlocation && (
                                <span style={{ marginLeft: 6 }} className="has-text-grey">
                                  <span style={{ marginLeft: 2 }}>Disabled</span>
                                </span>
                              )}
                            </React.Fragment>
                          }
                        />
                        <DisplayLabelValue
                          renderExtraStuff={() => (
                            <React.Fragment>
                              {shouldShowEmailVerification && (
                                <VerifyEmail getCurrentUser={getCurrentUser} />
                              )}
                            </React.Fragment>
                          )}
                          labelText="Email"
                          labelValue={
                            <div>
                              <span>{email.emailAddress}</span>
                              {email.isVerified && (
                                <span style={{ marginLeft: 6 }} className="has-text-success">
                                  <span className="icon">
                                    <i className="fas fa-check is-success" />
                                  </span>
                                  <span>(Verified)</span>
                                </span>
                              )}
                              {!email.isVerified && (
                                <span style={{ marginLeft: 6 }} className="has-text-grey">
                                  <span style={{ marginLeft: 2 }}>(Not Verified)</span>
                                </span>
                              )}
                            </div>
                          }
                        />

                        <DisplayLabelValue
                          renderExtraStuff={() => (
                            <React.Fragment>
                              {shouldShowPhoneVerification && (
                                <VerifyPhone getCurrentUser={getCurrentUser} />
                              )}
                            </React.Fragment>
                          )}
                          labelText="Phone Number"
                          labelValue={
                            <div>
                              <span>{phoneNumber}</span>
                              {phone.isVerified && (
                                <span style={{ marginLeft: 6 }} className="has-text-success">
                                  <span className="icon">
                                    <i className="fas fa-check is-success" />
                                  </span>
                                  <span>(Verified)</span>
                                </span>
                              )}
                              {!phone.isVerified && (
                                <span style={{ marginLeft: 6 }} className="has-text-grey">
                                  <span style={{ marginLeft: 2 }}>(Not Verified)</span>
                                </span>
                              )}
                            </div>
                          }
                        />

                        <HeaderTitle title="About Me" />
                        <TextareaAutosize
                          value={personalParagraph}
                          className="textarea is-marginless is-paddingless"
                          style={{
                            resize: 'none',
                            border: 'none',
                            color: '#4a4a4a',
                            height: 'auto',
                          }}
                          readOnly
                        />
                      </div>
                    )}
                    {isEditProfile && (
                      <ProfileForm
                        userDetails={userDetails}
                        onCancel={this.toggleEditProfile}
                        onSubmit={this.closeFormAndSubmit}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-narrow">
              <NotificationSettings />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyProfile);

const HeaderTitle = (props) => {
  const { title } = props;
  return (
    <h2
      style={{
        marginTop: 8,
        marginBottom: 4,
        fontSize: '1rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      {title}
    </h2>
  );
};
const DisplayLabelValue = ({ labelText, labelValue, renderExtraStuff }) => {
  return (
    <div className="field">
      <label className="label">{labelText}</label>
      <div className="control"> {labelValue}</div>
      {renderExtraStuff && renderExtraStuff()}
    </div>
  );
};

const userImageAndStats = (
  toggleShowUploadProfileImageDialog,
  profileImage,
  membershipStatusDisplay,
  rating,
  displayName,
) => {
  const { globalRating } = rating;
  return (
    <div className="card">
      <div className="card-content">
        <div className="content">
          <div style={{ padding: '0.25rem', height: '100%' }} className="has-text-dark">
            <div
              onClick={(e) => {
                e.preventDefault();
                toggleShowUploadProfileImageDialog();
              }}
            >
              <div>
                <img className="bdb-img-profile-pic" src={`${profileImage.url}`} />
              </div>
              <div className="has-text-centered">
                <a className="button is-fullwidth is-outlined is-small">
                  <span className="icon">
                    <i className="fa fa-camera" />
                  </span>
                  <span>change</span>
                </a>
              </div>
            </div>
            <br />
            <div className="field">
              <label className="label">Name</label>

              <div className="control">{displayName}</div>
            </div>
            <div className="field">
              <label className="label">Rating</label>
              {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                <div className="control">No Ratings Yet</div>
              ) : (
                <div className="control">
                  <span>
                    <ReactStars
                      half
                      count={5}
                      value={globalRating}
                      edit={false}
                      size={25}
                      color1={'lightgrey'}
                      color2={'#ffd700'}
                    />
                  </span>
                </div>
              )}
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">
                <div className="control">{membershipStatusDisplay}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const uploadImageDialog = (toggleUploadDialog, showImageUploadDialog, updateProfileImage) => {
  return showImageUploadDialog ? (
    <div className="modal is-active">
      <div onClick={toggleUploadDialog} className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <div className="modal-card-title">Update Profile Image</div>
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

class VerifyPhone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      showEnterPinModal: false,
    };
  }

  toggleShowEnterPinModal = () => {
    this.setState({ showEnterPinModal: !this.state.showEnterPinModal });
  };
  handleSendNewCode = async () => {
    this.setState({ isSubmitting: true }, async () => {
      try {
        const resendVerificationReq = await axios.post(ROUTES.API.USER.POST.resendVerificationMsg);
        if (resendVerificationReq && resendVerificationReq.success) {
          alert('you should recieve a text shortly , please give 10-15 minutes');
        }
      } catch (e) {
        // some alert
        alert('we are unable to send the verification text, please contact bidorboocrew@gmail.com');
        this.setState({ isSubmitting: false });
      }
    });
  };
  render() {
    const { isSubmitting } = this.state;

    return (
      <div style={{ marginTop: 2 }} className="control">
        <button
          style={{ marginRight: 4 }}
          onClick={this.toggleShowEnterPinModal}
          className="button is-info is-outlined is-small"
          disabled={isSubmitting}
        >
          Enter Your Pin
        </button>
        <button
          onClick={this.handleSendNewCode}
          className="button is-text is-outlined is-small"
          disabled={isSubmitting}
        >
          {`${isSubmitting ? 'pin sent' : 'resend pin'}`}
        </button>
      </div>
    );
  }
}

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
    };
  }

  handleSendNewCode = async () => {
    this.setState({ isSubmitting: true }, async () => {
      try {
        const resendVerificationReq = await axios.post(
          ROUTES.API.USER.POST.resendVerificationEmail,
        );
        if (resendVerificationReq && resendVerificationReq.success) {
          alert('you should recieve a text shortly , please give 10-15 minutes');
        }
      } catch (e) {
        // some alert
        alert('we are unable to send the verification text, please contact bidorboocrew@gmail.com');
        this.setState({ isSubmitting: false });
      }
    });
  };
  render() {
    const { isSubmitting } = this.state;

    return (
      <div style={{ marginTop: 2 }} className="control">
        <button
          style={{ marginRight: 4 }}
          onClick={this.toggleShowEnterPinModal}
          className="button is-info is-outlined is-small"
          disabled={isSubmitting}
        >
          Enter Your Pin
        </button>
        <button
          onClick={this.handleSendNewCode}
          className="button is-text is-outlined is-small"
          disabled={isSubmitting}
        >
          {`${isSubmitting ? 'pin sent' : 'resend pin'}`}
        </button>
      </div>
    );
  }
}
