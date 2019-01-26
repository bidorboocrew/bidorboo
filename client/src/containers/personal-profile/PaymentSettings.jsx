import React from 'react';
import ReactStars from 'react-stars';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import * as C from '../../constants/enumConstants';
import ProfileForm from '../../components/forms/ProfileForm';
import axios from 'axios';
import PaymentSetupForm from '../../components/forms/PaymentSetupForm';
import FileUploaderComponent from '../../components/FileUploaderComponent';
import * as ROUTES from '../../constants/frontend-route-consts';
import { getCurrentUser } from '../../app-state/actions/authActions';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddPaymentDetails: false,
      showImageUploadDialog: false,
    };
  }

  toggleAddPaymentDetails = () => {
    this.setState({ showAddPaymentDetails: !this.state.showAddPaymentDetails });
  };

  render() {
    const { userDetails, isLoggedIn } = this.props;

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

    const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];
    const { showAddPaymentDetails } = this.state;
    return (
      <div className="container is-widescreen bidorbooContainerMargins">
        <div className="columns is-centered is-gapless">
          <div className="column is-narrow">
            {userImageAndStats(profileImage, membershipStatusDisplay, rating, displayName)}
          </div>
          <div className="column">
            <section style={{ backgroundColor: 'white', padding: '1rem' }}>
              <div>
                <HeaderTitle title="BidOrBoo Tasker" />
                <p className="is-size-6">
                  - Are you planning to become a BidOrBoo Tasker ?<br />
                  - Do you want to do things you like at the times you chose ?
                  <br />
                  - Are you looking for a side gig to earn more income? <br /> <br />
                  if you said <strong>YES</strong> to any of these questions then let's start by
                  setting up your payout details.
                </p>
                <br />
                <div class="field">
                  <input
                    id="switchRoundedSuccess"
                    type="checkbox"
                    name="switchRoundedSuccess"
                    class="switch is-rounded is-success"
                    checked={showAddPaymentDetails}
                    onClick={this.toggleAddPaymentDetails}
                  />
                  <label for="switchRoundedSuccess">Add Payout Details</label>
                </div>

                <div className="help">
                  * You only need this if you are planning to OFFER your Services and bid on jobs.
                </div>
                <div className="help">
                  * Your data is secured via
                  <a href="https://stripe.com/ca" target="_blank">
                    {` Stripe payment gateway.`}
                  </a>
                  {` A world class secure payment processing platform.`} <br />
                  {`BidOrBoo will not store or share any of your sensitive details`}
                </div>
              </div>
              <br />
              {showAddPaymentDetails && (
                <div>
                  <HeaderTitle title="Add Payout Details" />
                  <p className="help">
                    * To speed up verification and avoid delays in payout please
                    <strong>enter all your details accurately</strong>
                  </p>
                  <br />
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

const userImageAndStats = (profileImage, membershipStatusDisplay, rating, displayName) => {
  const { globalRating } = rating;
  return (
    <div style={{ padding: '0.25rem', height: '100%' }} className="has-text-dark">
      <div>
        <div>
          <img className="bdb-img-profile-pic" src={`${profileImage.url}`} />
        </div>
      </div>

      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <div className="control">{displayName}</div>
        </div>
      </div>
      <div className="field">
        <label className="label">Rating</label>
        {globalRating === 'No Ratings Yet' || globalRating === 0 ? (
          <p className="is-size-7">No Ratings Yet</p>
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
            <span style={{ color: 'black' }} className="has-text-weight-semibold">
              ({globalRating})
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
  );
};
