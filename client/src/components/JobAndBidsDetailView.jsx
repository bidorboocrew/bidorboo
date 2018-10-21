import React from 'react';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';
import TextareaAutosize from 'react-autosize-textarea';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import JobDetailsView from './JobDetailsView';
import * as C from '../constants/constants';

export default class JobAndBidsDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.appRoot = document.querySelector('#bidorboo-root-view');

    this.state = {
      showReviewBidModal: false,
      userUnderReview: null,
      bidText: '',
      bidId: null,
    };
    autoBind(this, 'closeReviewModal', 'showReviewModal', 'awardBidderHandler');
  }

  showReviewModal(e, userUnderReview, bidText, bidId) {
    e.preventDefault();
    this.setState({ showReviewBidModal: true, userUnderReview, bidText: bidText, bidId });
  }

  closeReviewModal(e) {
    e.preventDefault();
    this.setState({ showReviewBidModal: false, userUnderReview: null, bidText: '', bidId: null });
  }

  awardBidderHandler(e) {
    const { awardBidder, job } = this.props;
    const { userUnderReview, bidId } = this.state;
    e.preventDefault();
    awardBidder && awardBidder(job._id, userUnderReview._id, bidId);
    this.closeReviewModal({ preventDefault: () => null });
  }

  render() {
    const { job, currentUser } = this.props;
    const dontShowRoute = !job || !currentUser || !job._bidsListRef;
    if (dontShowRoute) {
      switchRoute(ROUTES.CLIENT.ENTRY);
    }

    return dontShowRoute ? null : (
      <React.Fragment>
        <section className="mainSectionContainer">
          {this.state.showReviewBidModal &&
            ReactDOM.createPortal(
              <ReviewBidModal
                user={this.state.userUnderReview}
                bidText={this.state.bidText}
                onCloseHandler={this.closeReviewModal}
                awardBidderHandler={this.awardBidderHandler}
              />,
              this.appRoot
            )}
          <div className="container">
            <h2 style={{ marginBottom: 2 }} className="subtitle">
              Bids List
            </h2>
            <div>
              <BidsTable
                bidList={job._bidsListRef}
                currentUser={currentUser}
                isForJobOwber={currentUser.userId === job.ownerId}
                showReviewModal={this.showReviewModal}
              />
            </div>
            <br />
            <h2 style={{ marginBottom: 2 }} className="subtitle">
              Job Details
            </h2>
            <div>
              <JobDetailsView job={job} currentUser={currentUser} />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

class BidsTable extends React.Component {
  render() {
    const { bidList, currentUser, isForJobOwber, showReviewModal } = this.props;
    const areThereAnyBids = bidList && bidList.length > 0;

    if (areThereAnyBids) {
      // find lowest bid details
      let tableRows = bidList.map((bid) => (
        <tr
          key={bid._id}
          style={
            bid._bidderRef._id === currentUser._id
              ? { backgroundColor: '#00d1b2', wordWrap: 'break-word' }
              : { wordWrap: 'break-word' }
          }
        >
          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            <figure style={{ margin: '0 auto' }} className="image is-64x64">
              <img alt="profile" src={bid._bidderRef.profileImage.url} />
            </figure>
          </td>
          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            {bid._bidderRef.globalRating}
          </td>
          <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
            {bid.bidAmount.value} {bid.bidAmount.currency}
          </td>
          {isForJobOwber && (
            <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
              <a
                onClick={(e) => {
                  showReviewModal(
                    e,
                    bid._bidderRef,
                    `${bid.bidAmount.value} ${bid.bidAmount.currency}`,
                    bid._id
                  );
                }}
                className="button is-primary"
              >
                review details
              </a>
            </td>
          )}
        </tr>
      ));

      return (
        <table
          style={{ boxShadow: '0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)' }}
          className="table is-fullwidth is-hoverable"
        >
          <thead>
            <tr>
              <th className="has-text-centered">profile image</th>
              <th className="has-text-centered">Rating</th>
              <th className="has-text-centered">$</th>
              {isForJobOwber && <th className="has-text-centered">Award a Bidder</th>}
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      );
    }
    // no bids yet
    return (
      <table
        style={{ boxShadow: '0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)' }}
        className="table is-fullwidth"
      >
        <thead>
          <tr>
            <th>Bids Table</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'middle' }}>
              No one has made a bid Yet, Keep an eye and check again in a little while
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

const ReviewBidModal = ({ user, onCloseHandler, awardBidderHandler, bidText }) => {
  const {
    profileImage,
    displayName,
    email = 'none provided',
    personalParagraph = 'none provided',
    membershipStatus,
    phoneNumber = 'none provided',
  } = user;
  const membershipStatusDisplay = C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];
  return (
    <div className="modal is-active">
      <div onClick={onCloseHandler} className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Review Bidder Details</p>
          <button onClick={onCloseHandler} className="delete" aria-label="close" />
        </header>
        <section className="modal-card-body has-text-centered">
          {userImageAndStats(profileImage, displayName, email, membershipStatusDisplay)}
          {/* user details */}
          {userEditableInfo(displayName, email, phoneNumber, personalParagraph)}
        </section>
        <footer className="modal-card-foot">
          <button onClick={awardBidderHandler} className="button is-success">
            Award This Bidder <b> {bidText}</b>
          </button>
          <button onClick={onCloseHandler} className="button">
            Review Other Bidders
          </button>
        </footer>
      </div>
    </div>
  );
};

const userImageAndStats = (profileImage, displayName, email, membershipStatusDisplay) => {
  return (
    <div className="has-text-centered">
      <figure style={{ margin: '0 auto' }} className="image  is-128x128">
        <img alt="profile" src={profileImage.url} />
      </figure>
      <div>
        <img
          alt="star rating"
          src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
          className="starRating"
        />
      </div>
      <div>{displayName}</div>
      <div>{email}</div>
      <DisplayLabelValue labelText="Membership Status:" labelValue={membershipStatusDisplay} />
    </div>
  );
};

const userEditableInfo = (
  displayName,
  email,
  phoneNumber = 'none provided',
  personalParagraph = 'none provided'
) => {
  return (
    <div>
      <HeaderTitle title="General Information" />
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
          background: 'whitesmoke',
        }}
        readOnly
      />
    </div>
  );
};

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
