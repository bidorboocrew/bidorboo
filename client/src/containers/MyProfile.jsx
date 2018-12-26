import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../app-state/actions/userModelActions';
import * as C from '../constants/enumConstants';
import ProfileForm from '../components/forms/ProfileForm';
import axios from 'axios';
import PaymentSetupForm from '../components/forms/PaymentSetupForm';
import FileUploaderComponent from '../components/FileUploaderComponent';
import * as ROUTES from '../constants/frontend-route-consts';
import { getCurrentUser } from '../app-state/actions/authActions';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfile: false,
      showAddPaymentDetails: false,
      showImageUploadDialog: false,
    };
  }

  toggleEditProfile = () => {
    this.setState({ isEditProfile: !this.state.isEditProfile });
  };

  toggleAddPaymentDetails = () => {
    this.setState({ showAddPaymentDetails: !this.state.showAddPaymentDetails });
  };

  toggleShowUploadProfileImageDialog = () => {
    this.setState({ showImageUploadDialog: !this.state.showImageUploadDialog });
  };

  closeFormAndSubmit = (vals) => {
    this.toggleEditProfile();
    this.props.a_updateProfileDetails(vals);
  };

  render() {
    const { userDetails, a_updateProfileImage, isLoggedIn, a_getCurrentUser } = this.props;

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
    const { isEditProfile, showAddPaymentDetails } = this.state;
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
          <div className="container">
            <div className="columns is-gapless">
              <div className="column is-narrow">
                {userImageAndStats(
                  this.toggleShowUploadProfileImageDialog,
                  profileImage,
                  membershipStatusDisplay,
                  rating,
                  displayName,
                )}
              </div>
              <div className="column">
                <section style={{ backgroundColor: 'white', padding: '1rem' }}>
                  {!isEditProfile && (
                    <div className="field">
                      <HeaderTitle title="My Details" />
                      <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
                      <DisplayLabelValue
                        labelText="Email:"
                        labelValue={
                          <div>
                            <span>{email.emailAddress}</span>
                            {email.isVerified && (
                              <span style={{ marginLeft: 6 }} className="has-text-success">
                                <i className="fas fa-check is-success" />
                                <span style={{ marginLeft: 2 }}>Verified</span>
                              </span>
                            )}
                            {!email.isVerified && (
                              <span style={{ marginLeft: 6 }} className="has-text-grey">
                                <span style={{ marginLeft: 2 }}>Not Verified</span>
                              </span>
                            )}
                          </div>
                        }
                      />

                      {shouldShowEmailVerification && (
                        <VerifyEmail getCurrentUser={a_getCurrentUser} />
                      )}

                      <DisplayLabelValue
                        labelText="Phone Number:"
                        labelValue={
                          <div>
                            <span>{phoneNumber}</span>
                            {phone.isVerified && (
                              <span style={{ marginLeft: 6 }} className="has-text-success">
                                <i className="fas fa-check is-success" />
                                <span style={{ marginLeft: 2 }}>Verified</span>
                              </span>
                            )}
                            {!phone.isVerified && (
                              <span style={{ marginLeft: 6 }} className="has-text-grey">
                                <span style={{ marginLeft: 2 }}>Not Verified</span>
                              </span>
                            )}
                          </div>
                        }
                      />
                      {shouldShowPhoneVerification && (
                        <VerifyPhone getCurrentUser={a_getCurrentUser} />
                      )}

                      <HeaderTitle specialMarginVal={8} title="About Me" />
                      <TextareaAutosize
                        value={personalParagraph}
                        className="textarea is-marginless is-paddingless"
                        style={{
                          resize: 'none',
                          border: 'none',
                          color: '#4a4a4a',
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
                          <span style={{ marginLeft: 4 }}>Edit Details</span>
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
                <br />
                  {!showAddPaymentDetails && (
                    <div>
                      <HeaderTitle title="Payment Setup" />
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
                      <PaymentSetupForm
                        userDetails={userDetails}
                        onCancel={this.toggleAddPaymentDetails}
                        onSubmit={(vals) => console.log(vals)}
                      />
                    </div>
                  )}
                </section>
              </div>
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
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    a_updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
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
  membershipStatusDisplay,
  rating,
  displayName,
) => {
  const { canceledJobs, canceledBids, fulfilledBids, fulfilledJobs, globalRating } = rating;
  return (
    <React.Fragment>
      <div
        style={{ backgroundColor: 'white', padding: '0.25rem', height: '100%' }}
        className="has-text-centered"
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            toggleShowUploadProfileImageDialog();
          }}
        >
          <div>
            <img className="bdb-img-profile-pic" src={`${profileImage.url}`} />
          </div>

          <a className="button is-outlined is-small has-text-centered">
            <i className="far fa-edit" />
            <span style={{ marginLeft: 4 }}>Edit</span>
          </a>
        </div>
        <br />
        <div className="field has-text-centered">
          <label className="label">Name</label>
          <div className="control has-text-centered">
            <div className="control has-text-centered">{displayName}</div>
          </div>
        </div>
        <div className="field has-text-centered">
          <label className="label">Status</label>
          <div className="control has-text-centered">
            <div className="control has-text-centered">{membershipStatusDisplay}</div>
          </div>
        </div>
        <div className="field has-text-centered">
          <label className="label">Rating</label>
          <div className="control has-text-centered">{globalRating}</div>
        </div>
        {/* <div className="field has-text-centered">
          <label className="label">Fullfilled Jobs</label>
          <div className="control has-text-centered">{`${fulfilledJobs}`}</div>
        </div>
        <div className="field has-text-centered">
          <label className="label">Fulfilled Bids</label>
          <div className="control has-text-centered">{`${fulfilledBids}`}</div>
        </div>
        <div className="field has-text-centered">
          <label className="label">Cancelled Jobs</label>
          <div className="control has-text-centered">{`${canceledJobs}`}</div>
        </div>

        <div className="field has-text-centered">
          <label className="label">Cancelled Bids</label>
          <div className="control has-text-centered">{`${canceledBids}`}</div>
        </div> */}
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

class VerifyPhone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      isResendDisabled: false,
    };
  }

  handleSendNewCode = async () => {
    this.setState({ isSubmitting: true }, async () => {
      try {
        const resendVerificationReq = await axios.post(ROUTES.API.USER.POST.resendVerificationMsg);
        if (resendVerificationReq && resendVerificationReq.success) {
          alert('you should recieve a text shortly , please give 10-15 minutes');
          this.setState({ isSubmitting: true, isResendDisabled: true });
        }
      } catch (e) {
        // some alert
        alert('we are unable to send the verification text, please contact bidorboocrew@gmail.com');
        this.setState({ isSubmitting: false });
      }
    });
  };
  render() {
    const { isSubmitting, isResendDisabled } = this.state;

    const resendButtonClass = `button is-info is-outlined ${isSubmitting ? 'is-loading ' : null}`;
    return (
      <div className="field is-horizontal">
        <div className="field-body">
          <div className="field">
            <p className="control">
              <button
                onClick={this.handleSendNewCode}
                style={{ marginLeft: 6 }}
                className={resendButtonClass}
                disabled={isResendDisabled}
              >
                {`${isResendDisabled ? 'pin sent' : 'resend pin'}`}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      isResendDisabled: false,
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
          this.setState({ isSubmitting: true, isResendDisabled: true });
        }
      } catch (e) {
        // some alert
        alert('we are unable to send the verification text, please contact bidorboocrew@gmail.com');
        this.setState({ isSubmitting: false });
      }
    });
  };
  render() {
    const { isSubmitting, isResendDisabled } = this.state;

    const resendButtonClass = `button is-info is-outlined ${isSubmitting ? 'is-loading ' : null}`;
    return (
      <div className="field is-horizontal">
        <div className="field-body">
          <div className="field">
            <p className="control">
              <button
                onClick={this.handleSendNewCode}
                style={{ marginLeft: 6 }}
                className={resendButtonClass}
                disabled={isResendDisabled}
              >
                {`${isResendDisabled ? 'pin sent' : 'resend pin'}`}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
