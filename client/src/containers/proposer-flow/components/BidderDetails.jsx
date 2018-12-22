import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import * as C from '../../../constants/constants';

export default class BidderDetails extends React.Component {
  render() {
    const { breadCrumb, cardFooter } = this.props;
    return (
      <div id="bdb-user-under-review">
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
    <React.Fragment>
      <div className="has-text-grey is-size-7">{props.labelText}</div>
      <div className="is-size-6"> {props.labelValue || 'none provided'}</div>
    </React.Fragment>
  );
};

const OtherUserProfileCard = ({ otherUserDetails, cardFooter, cardTitle }) => {
  const { profileImage, displayName, membershipStatus } = otherUserDetails;

  const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];
  const {
    rating,

    email = { emailAddress: 'none provided' },
    phone = { phoneNumber: 'none provided' },
    personalParagraph = 'none provided',
  } = otherUserDetails;
  return (
    <React.Fragment>
      {cardFooter}
      <br />
      <div className="card disabled is-clipped">
        {cardTitle}
        <div className="card-content">
          <div>
            <img src={`${profileImage.url}`} />
            <div>{displayName}</div>
            <DisplayLabelValue
              labelText="Membership Status:"
              labelValue={membershipStatusDisplay}
            />
            <DisplayLabelValue labelText="Rating:" labelValue={rating.globalRating} />
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
          </div>
          {/*
          <HeaderTitle title="Member Details" />


          <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
          <DisplayLabelValue labelText="Phone Number:" labelValue={phone.phoneNumber} />
         */}
        </div>
      </div>
    </React.Fragment>
  );
};
