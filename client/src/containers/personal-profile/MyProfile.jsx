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

import VerifyEmailButton from './VerifyEmailButton';
import VerifyPhoneButton from './VerifyPhoneButton';
import { VerifiedVia } from '../commonComponents';

import OtherUserProfileForReviewPage from '../OtherUserProfileForReviewPage';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false,
      showImageUploadDialog: false,
    };
  }
  componentDidMount() {
    document.querySelector('body').setAttribute('style', 'background:white');
  }

  componentWillUnmount() {
    document.querySelector('body').setAttribute('style', 'background:#eeeeee');
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

        <div className="columns is-centered is-mobile">
          <div className="column limitLargeMaxWidth slide-in-right">
            {userImageAndStats(
              this.toggleShowUploadProfileImageDialog,
              profileImage,
              membershipStatusDisplay,
              rating,
              displayName,
              userDetails,
            )}

            <div className="card cardWithButton nofixedwidth">
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
              </header>
              <div className="card-content">
                <div className="content">
                  {!isEditProfile && (
                    <button
                      onClick={() => {
                        this.toggleEditProfile();
                      }}
                      className="button firstButtonInCard is-success"
                      aria-label="more options"
                    >
                      <span className="icon">
                        <i className="far fa-edit" />
                      </span>
                      <span>Edit Details</span>
                    </button>
                  )}
                  {!isEditProfile && (
                    <div>
                      <DisplayLabelValue labelText="User Name" labelValue={displayName} />

                      {/* <div className="group">
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
                              <span
                                className="has-text-danger"
                                style={{ marginLeft: 2, marginRight: 4 }}
                              >
                                (Not Verified)
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
                              <span
                                style={{ marginLeft: 2, marginRight: 4 }}
                                className="has-text-danger"
                              >
                                (Not Verified)
                              </span>
                            )}
                          </div>
                        }
                      />
                      <HeaderTitle title="About Me" />
                      <TextareaAutosize
                        value={personalParagraph}
                        className="textarea is-marginless is-paddingless control"
                        style={{
                          resize: 'none',
                          border: 'none',
                        }}
                        readOnly
                      />
                      <br />
                      <br />
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
            <br></br>

            <br></br>
            <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon is-small">
                      <i className="fas fa-wave-square" aria-hidden="true" />
                    </span>
                    <span>BidOrBoo Pulse</span>
                  </a>
                </li>
              </ul>
            </div>
            <OtherUserProfileForReviewPage
              isMyPersonalProfile
              match={{ params: { userId: userDetails._id } }}
            ></OtherUserProfileForReviewPage>
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
    dispatch,
    updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

const HeaderTitle = (props) => {
  const { title } = props;
  return (
    <h2
      style={{
        marginTop: 8,
        marginBottom: 4,
        fontSize: 16,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      {title}
    </h2>
  );
};
const DisplayLabelValue = ({ labelText, labelValue, renderExtraStuff }) => {
  return (
    <div className="group">
      <label className="label hasSelectedValue">
        {typeof labelText === 'function' ? labelText() : labelText}
      </label>
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
              <div style={{ marginBottom: 6 }}>
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
                    alt="user profile"
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
                <label className="label has-text-dark">({membershipStatusDisplay})</label>
                {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
                  <div className="has-text-warning" style={{ lineHeight: '52px', fontSize: 16 }}>
                    <span className="icon">
                      <i className="far fa-star" />
                    </span>
                    <span className="has-text-dark">--</span>
                  </div>
                ) : (
                  <div className="has-text-warning" style={{ lineHeight: '52px', fontSize: 16 }}>
                    <span className="icon">
                      <i className="far fa-star" />
                    </span>
                    <span className="has-text-dark">{globalRating}</span>
                  </div>
                )}
              </div>
            </div>
            <VerifiedVia width={300} userDetails={userDetails} showAll />
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
          <div className="modal-card-title">Update Your Pic</div>
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
