import React from 'react';
import PropTypes from 'prop-types';

import TextareaAutosize from 'react-autosize-textarea';
import * as C from '../constants/constants';

export default class OtherUserDetails extends React.Component {
  static propTypes = {
    otherUserDetails: PropTypes.shape({
      profileImage: PropTypes.any,
      displayName: PropTypes.any,
      email: PropTypes.any,
      personalParagraph: PropTypes.any,
      membershipStatus: PropTypes.any,
      phoneNumber: PropTypes.any,
    }).isRequired,
    breadCrumb: PropTypes.node,
    cardTitle: PropTypes.node,
    cardFooter: PropTypes.node,
  };

  static defaultProps = {
    breadCrumb: null,
    cardFooter: null,
    cardTitle: null,
  };

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

const OtherUserProfileCard = ({ otherUserDetails, cardFooter, cardTitle }) => {
  const { profileImage, displayName, membershipStatus } = otherUserDetails;

  const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

  return (
    <div className="columns is-centered">
      <div className="column is-half">
        <div className="card is-clipped">
          {cardTitle}
          <div className="card-content">
            <div className="has-text-centered">
              <img
                src={`${profileImage.url}`}
              />
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
    email,
    phoneNumber = 'none provided',
    personalParagraph = 'none provided',
  } = otherUserDetails;
  return (
    <React.Fragment>
      <HeaderTitle title="Member Details" />
      <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
      <DisplayLabelValue labelText="Email:" labelValue={email} />
      <DisplayLabelValue labelText="Phone Number:" labelValue={phoneNumber} />
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
