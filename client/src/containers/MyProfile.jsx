import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../app-state/actions/userModelActions';
import * as C from '../constants/constants';
import autoBind from 'react-autobind';
import ProfileForm from '../components/forms/ProfileForm';
import axios from 'axios';
import PaymentForm from '../components/forms/PaymentForm';
import FileUploaderComponent from '../components/FileUploaderComponent';
// import PaymentHandling from './PaymentHandling';
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
          <div className="columns">
            <div className="column is-2">
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
              </section>
              <br />
              <section style={{ backgroundColor: 'white', padding: '1rem' }}>
                {!showAddPaymentDetails && (
                  <div>
                    <HeaderTitle title="Payout Details" />
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
              </section>
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
      <div style={{ backgroundColor: 'white', padding: '0.25rem' }} className="has-text-centered">
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

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFieldValue: '',
      isSubmitting: false,
      wrongCode: false,
      isResendDisabled: false,
    };
  }

  handleInputChange = (e) => {
    e.preventDefault();
    let inputText = e.target.value;
    this.setState({ inputFieldValue: inputText });
  };

  handleVerify = async () => {
    try {
      const { inputFieldValue } = this.state;
      const { getCurrentUser } = this.props;
      const verifyReq = await axios.post(ROUTES.API.USER.POST.verifyEmail, {
        data: { code: inputFieldValue },
      });

      if (verifyReq && verifyReq.data && verifyReq.data.success) {
        getCurrentUser();
      } else {
        this.setState({ wrongCode: true, isSubmitting: false });
      }
    } catch (e) {
      alert('we are unable to verify you, please contact bidorboocrew@gmail.com');
      this.setState({ isSubmitting: false });
    }
  };
  handleSendNewCode = async () => {
    this.setState({ isResendDisabled: true }, async () => {
      try {
        const verifyReq = await axios.post(ROUTES.API.USER.POST.resendVerificationEmail);
        if (verifyReq && verifyReq.success) {
          alert('you should recieve an email shortly , please give 10-15 minutes');
        }
      } catch (e) {
        // some alert
        alert(
          'we are unable to send the verification email, please contact bidorboocrew@gmail.com',
        );
        this.setState({ isSubmitting: false });
      }
    });
  };
  render() {
    const { inputFieldValue, isSubmitting, wrongCode, isResendDisabled } = this.state;

    const submitButtonClass = `button is-success ${isSubmitting ? 'is-loading ' : null}`;
    const resendButtonClass = `button is-info is-outlined ${isSubmitting ? 'is-loading ' : null}`;
    const inputFieldClass = `${!wrongCode ? 'input is-success' : 'input is-danger'}`;

    const helpField = !wrongCode ? (
      <span className="help">* we sent a verification code to your email</span>
    ) : (
      <span className="help is-danger">* invalid Code. check again or request a new code</span>
    );

    return (
      <div className="field is-horizontal">
        {/* <div className="field">
          <p>
            <input
              disabled={isSubmitting}
              value={inputFieldValue}
              className={inputFieldClass}
              type="text"
              placeholder="Verification code"
              onChange={this.handleInputChange}
            />
            {helpField}
          </p>
        </div> */}
        <div className="field-body">
          <div className="field">
            <p className="control">
              {/* <button
                onClick={this.handleVerify}
                style={{ marginLeft: 6 }}
                className={submitButtonClass}
              >
                verify email
              </button> */}
              <button
                onClick={this.handleSendNewCode}
                style={{ marginLeft: 6 }}
                className={resendButtonClass}
                disabled={isResendDisabled}
              >
                {`${isResendDisabled ? 'code sent' : 'resend code'}`}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

class VerifyPhone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFieldValue: '',
      isSubmitting: false,
      wrongCode: false,
      isResendDisabled: false,
    };
  }

  handleInputChange = (e) => {
    e.preventDefault();
    let inputText = e.target.value;
    this.setState({ inputFieldValue: inputText });
  };

  handleVerify = async () => {
    try {
      const { inputFieldValue } = this.state;
      const { getCurrentUser } = this.props;

      const verifyReq = await axios.post(ROUTES.API.USER.POST.verifyPhone, {
        data: { code: inputFieldValue },
      });
      debugger;
      if (verifyReq && verifyReq.data && verifyReq.data.success) {
        getCurrentUser();
      } else {
        this.setState({ wrongCode: true, isSubmitting: false });
      }
    } catch (e) {
      alert('we are unable to send the verification text, please contact bidorboocrew@gmail.com');
      this.setState({ isSubmitting: false });
    }
  };
  handleSendNewCode = async () => {
    this.setState({}, async () => {
      try {
        const verifyReq = await axios.post(ROUTES.API.USER.POST.resendVerificationMsg);
        if (verifyReq && verifyReq.success) {
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
    const { inputFieldValue, isSubmitting, wrongCode, isResendDisabled } = this.state;

    const submitButtonClass = `button is-success ${isSubmitting ? 'is-loading ' : null}`;
    const resendButtonClass = `button is-info is-outlined ${isSubmitting ? 'is-loading ' : null}`;
    const inputFieldClass = `${!wrongCode ? 'input is-success' : 'input is-danger'}`;

    const helpField = !wrongCode ? (
      <span className="help">* we sent a pincode to your phone number</span>
    ) : (
      <span className="help is-danger">* invalid Code. check again or request a new code</span>
    );

    return (
      <div className="field is-horizontal">
        {/* <div className="field">
          <p>
            <input
              disabled={isSubmitting}
              value={inputFieldValue}
              className={inputFieldClass}
              type="text"
              placeholder="PIN code"
              onChange={this.handleInputChange}
            />
            {helpField}
          </p>
        </div> */}
        <div className="field-body">
          <div className="field">
            <p className="control">
              {/* <button
                onClick={this.handleVerify}
                style={{ marginLeft: 6 }}
                className={submitButtonClass}
              >
                verify phone
              </button> */}
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
