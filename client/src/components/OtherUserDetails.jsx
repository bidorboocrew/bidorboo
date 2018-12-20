import React from 'react';

import TextareaAutosize from 'react-autosize-textarea';
import * as C from '../constants/constants';

export default class OtherUserDetails extends React.Component {
  render() {
    const { breadCrumb } = this.props;
    return (
      <div className="slide-in-left" id="bdb-user-under-review">
        {/* if user passes breadcrumb use it */}
        {breadCrumb}

        <section className="bdbPage">
          <OtherUserProfileCard {...this.props} />
        </section>
      </div>
    );
  }
}

const HeaderTitle = (props) => {
  const { title, specialMarginVal } = props;
  return (
    <p
      className="has-text-grey is-size-7"
      style={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      {title}
    </p>
  );
};
const DisplayLabelValue = (props) => {
  return (
    <p>
      <div className="has-text-grey is-size-7">{props.labelText}</div>
      <div className="is-size-6"> {props.labelValue || 'none provided'}</div>
    </p>
  );
};

const OtherUserProfileCard = ({ otherUserDetails, cardFooter, cardTitle }) => {
  const { profileImage, displayName, membershipStatus } = otherUserDetails;

  const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

  return (
    <div className="columns is-multiline">
      <div className="column is-half">
        <div className="card is-clipped">
          {cardTitle}
          <div className="card-content">
            <div className="has-text-centered">
              <img src={`${profileImage.url}`} />
              <div>{displayName}</div>
              <DisplayLabelValue
                labelText="Membership Status:"
                labelValue={membershipStatusDisplay}
              />
            </div>

            <div className="content has-text-centered">
              <UserDetails otherUserDetails={otherUserDetails} />
            </div>
          </div>

          {cardFooter}
        </div>
      </div>
    </div>
  );
};

const UserDetails = ({ otherUserDetails }) => {
  const {
    displayName,
    email = { emailAddress: 'none provided' },
    phone = { phoneNumber: 'none provided' },
    personalParagraph = 'none provided',
  } = otherUserDetails;
  
  return (
    <React.Fragment>
      <br />
      <HeaderTitle title="Member Details" />

      <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
      <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
      <DisplayLabelValue labelText="Phone Number:" labelValue={phone.phoneNumber} />
      <HeaderTitle specialMarginVal={8} title="About Me" />
      <TextareaAutosize
        value={personalParagraph}
        className="textarea is-marginless is-paddingless has-text-centered"
        style={{
          resize: 'none',
          border: 'none',
          color: '#4a4a4a',
          background: 'white',
        }}
        readOnly
      />
    </React.Fragment>
  );
};
