import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../app-state/actions/userModelActions';
import * as C from '../constants/constants';
import autoBind from 'react-autobind';
import ProfileForm from '../components/forms/ProfileForm';

import PaymentForm from '../components/forms/PaymentForm';
import FileUploaderComponent from '../components/FileUploaderComponent';
import PaymentHandling from './PaymentHandling';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false,
      showAddPaymentDetails: false,
      showImageUploadDialog: false,
    };
    autoBind(
      this,
      'toggleAddPaymentDetails',
      'toggleEditProfile',
      'closeFormAndSubmit',
      'toggleShowUploadProfileImageDialog',
    );
  }

  toggleEditProfile() {
    this.setState({ isEditProfile: !this.state.isEditProfile });
  }

  toggleAddPaymentDetails() {
    this.setState({ showAddPaymentDetails: !this.state.showAddPaymentDetails });
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
    const { isEditProfile, showAddPaymentDetails, showImageUploadDialog } = this.state;
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
          <div className="columns">
            <div className="column is-2">
              {userImageAndStats(
                this.toggleShowUploadProfileImageDialog,
                profileImage,
                displayName,
                email,
                membershipStatusDisplay,
              )}
            </div>
            <div className="column">
              {!isEditProfile && (
                <div className="field">
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

                  <div>
                    <a
                      className="button is-primary"
                      onClick={() => {
                        this.toggleEditProfile();
                      }}
                    >
                      <i className="far fa-edit" />
                      <span style={{ marginLeft: 4 }}>Edit My Details</span>
                    </a>
                  </div>
                </div>
              )}
              {isEditProfile && (
                <div>
                  <HeaderTitle title="Edit My Details" />

                  <ProfileForm
                    userDetails={userDetails}
                    onCancel={this.toggleEditProfile}
                    onSubmit={this.closeFormAndSubmit}
                  />
                </div>
              )}

              {!showAddPaymentDetails && (
                <div>
                  <HeaderTitle title="My Payment Details" />
                  <a
                    className="button is-primary"
                    onClick={() => {
                      this.toggleAddPaymentDetails();
                    }}
                  >
                    <i className="far fa-edit" />
                    <span style={{ marginLeft: 4 }}>Add Payment Details</span>
                  </a>
                </div>
              )}
              {showAddPaymentDetails && (
                <div>
                  <HeaderTitle title="Add Payment Details" />
                  <React.Fragment>
                    Data is secured via
                    <a href="https://stripe.com/ca" target="_blank">
                      {` Stripe payment gateway.`}
                    </a>
                    {` BidOrBoo will NOT be storing any sensitive info.`}
                  </React.Fragment>
                  <br /> <br />
                  <PaymentForm
                    userDetails={userDetails}
                    onCancel={this.toggleAddPaymentDetails}
                    onSubmit={(vals) => console.log(vals)}
                  />
                </div>
              )}
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
      <div className="has-text-centered">
        <div>
          <img className="bdb-img-profile-pic" src={`${profileImage.url}`} />
        </div>

        <div style={{ marginBottom: 7 }}>
          <a
            onClick={(e) => {
              e.preventDefault();
              toggleShowUploadProfileImageDialog();
            }}
            className="button is-outlined is-small has-text-centered"
          >
            <i className="far fa-edit" />
            <span style={{ marginLeft: 4 }}>Edit</span>
          </a>
        </div>
        <div style={{ marginBottom: 7 }}>{membershipStatusDisplay}</div>
      </div>
    </React.Fragment>
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
