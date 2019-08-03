import React from 'react';
import ReactStars from 'react-stars';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import * as C from '../../constants/enumConstants';
import ProfileForm from '../../components/forms/ProfileForm';

import FileUploaderComponent from '../../components/FileUploaderComponent';

import { getCurrentUser } from '../../app-state/actions/authActions';
import NotificationSettings from './NotificationSettings';
import VerifyEmailButton from './VerifyEmailButton';
import VerifyPhoneButton from './VerifyPhoneButton';
import { VerifiedVia } from '../commonComponents';
import { switchRoute } from '../../utils';

import * as ROUTES from '../../constants/frontend-route-consts';
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
      picId,
      // autoDetectlocation,
    } = userDetails;

    personalParagraph = personalParagraph || 'not provided';
    let phoneNumber = phone.phoneNumber || 'not provided';

    // phone number is provided but it is not verified
    const shouldShowPhoneVerification = phone.phoneNumber && !phone.isVerified;
    // email is provided but it is not verified
    const shouldShowEmailVerification = email.emailAddress && !email.isVerified;

    const didUserProvidePicId = !!picId && picId.front && picId.back;
    const isPictureIdVerified = didUserProvidePicId && picId.isVerified;

    const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

    const { isEditProfile } = this.state;
    return (
      <React.Fragment>
        {uploadImageDialog(
          this.toggleShowUploadProfileImageDialog,
          this.state.showImageUploadDialog,
          updateProfileImage,
        )}

        <div>
          <div className="columns is-centered">
            <div className="column is-narrow has-text-centered">
              {userImageAndStats(
                this.toggleShowUploadProfileImageDialog,
                profileImage,
                membershipStatusDisplay,
                rating,
                displayName,
                userDetails,
              )}
            </div>
            <div className="column">
              <div className="card disabled">
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
                      <span>Edit Details</span>
                    </a>
                  )}
                </header>
                <div className="card-content">
                  <div className="content">
                    {!isEditProfile && (
                      <div>
                        <DisplayLabelValue labelText="User Name" labelValue={displayName} />

                        {/* <div className="group saidTest">
                          <label className="label">Auto Detect Location</label>
                          <div className="control">
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
                          </div>
                        </div> */}

                        <DisplayLabelValue
                          renderExtraStuff={() => (
                            <React.Fragment>
                              {shouldShowEmailVerification && (
                                <VerifyEmailButton getCurrentUser={getCurrentUser} />
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
                                <span style={{ marginLeft: 6 }} className="has-text-danger">
                                  <span style={{ marginLeft: 2 }}>(Not Verified)</span>
                                </span>
                              )}
                            </div>
                          }
                        />

                        <DisplayLabelValue
                          renderExtraStuff={() => (
                            <React.Fragment>
                              {shouldShowPhoneVerification && <VerifyPhoneButton />}
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
                                <span style={{ marginLeft: 6 }} className="has-text-danger">
                                  <span style={{ marginLeft: 2 }}>(Not Verified)</span>
                                </span>
                              )}
                            </div>
                          }
                        />

                        <DisplayLabelValue
                          labelText="ID verification (Optional)"
                          labelValue={
                            <div>
                              <span>{didUserProvidePicId ? 'Uploaded' : 'Not Provided'}</span>
                              {didUserProvidePicId && (
                                <React.Fragment>
                                  {isPictureIdVerified && (
                                    <span style={{ marginLeft: 6 }} className="has-text-success">
                                      <span className="icon">
                                        <i className="fas fa-check is-success" />
                                      </span>
                                      <span>(Verified)</span>
                                    </span>
                                  )}
                                  {!isPictureIdVerified && (
                                    <React.Fragment>
                                      <span style={{ marginLeft: 6 }} className="has-text-grey">
                                        <span style={{ marginLeft: 2 }}>(Not Verified)</span>
                                      </span>
                                      <div className="help">
                                        * BidOrBooCrew will get this verified in 3-5 business days
                                      </div>
                                    </React.Fragment>
                                  )}
                                </React.Fragment>
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

            <div className="column">
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
    <div className="group saidTest">
      <label className="label">{typeof labelText === 'function' ? labelText() : labelText}</label>
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
  userDetails,
) => {
  const { globalRating } = rating;
  return (
    <div className="card disabled">
      <div className="card-content">
        <div className="content">
          <div style={{ padding: '0.25rem', height: '100%' }} className="has-text-dark">
            <div className="has-text-centered">
              <figure
                onClick={(e) => {
                  e.preventDefault();
                  toggleShowUploadProfileImageDialog();
                }}
                style={{ margin: 'auto', width: 128, position: 'relative' }}
                className="image is-128x128"
              >
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 6,
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '100%',
                    color: '#eeeeee',
                    cursor: 'pointer',
                  }}
                >
                  <span className="icon is-medium">
                    <i className="fa fa-camera" />
                  </span>
                </div>
                <img
                  style={{
                    borderRadius: '100%',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                  }}
                  src={profileImage.url}
                />
              </figure>
              <div style={{ marginBottom: 0 }} className={`title`}>
                <span>{displayName}</span>
              </div>
              <div className={`has-text-grey`} style={{ fontWeight: 300 }}>
                ({membershipStatusDisplay})
              </div>
              {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                <div className="has-text-grey" style={{ lineHeight: '52px' }}>
                  - No Ratings Yet -
                </div>
              ) : (
                <ReactStars
                  className="ReactStars"
                  half
                  count={5}
                  value={globalRating}
                  edit={false}
                  size={35}
                  color1={'lightgrey'}
                  color2={'#ffd700'}
                />
              )}
            </div>

            <VerifiedVia userDetails={userDetails} showAll />
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
