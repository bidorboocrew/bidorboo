import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import TextareaAutosize from 'react-autosize-textarea';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import * as Constants from '../../constants/constants';

export default class OwnersJobDetailsCard extends React.Component {
  static propTypes = {
    awardBidder: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.appRoot = document.querySelector('#bidorboo-root-view');

    this.state = {
      showReviewBidModal: false,
      bidText: '',
      bidId: null,
      userUnderReview: null,
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
    const { bidId } = this.state;
    e.preventDefault();
    awardBidder && awardBidder(job._id, bidId);
    this.closeReviewModal({ preventDefault: () => null });
  }

  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.ENTRY);
  }

  render() {
    const { job, currentUser } = this.props;

    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myjobs);
      return null;
    }

    return (
      <section className="mainSectionContainer">
        {/* show award modal */}
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
          <div className="columns is-multiline">
            <div className="column is-4">
              <h2 style={{ marginBottom: 2 }} className="subtitle">
                Job Details
              </h2>
              <JobDetailsView job={job} currentUser={currentUser} />
            </div>
            <div className="column is-8">
              <h2 style={{ marginBottom: 2 }} className="subtitle">
                Bids List
              </h2>
              <BidsTable
                bidList={job._bidsListRef}
                currentUser={currentUser}
                showReviewModal={this.showReviewModal}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class BidsTable extends React.Component {
  render() {
    const { bidList, currentUser, showReviewModal } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;
    if (areThereAnyBids) {
      // find lowest bid details
      let tableRows =
        bidList &&
        bidList.map((bid) => {
          return (
            <tr
              key={bid._id || Math.random()}
              style={
                bid._bidderRef._id === currentUser._id
                  ? { backgroundColor: '#00d1b2', wordWrap: 'break-word' }
                  : { wordWrap: 'break-word' }
              }
            >
              <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
                {bid._bidderRef &&
                  bid._bidderRef.profileImage &&
                  bid._bidderRef.profileImage.url && (
                    <figure style={{ margin: '0 auto' }} className="image is-64x64">
                      <img alt="profile" src={bid._bidderRef.profileImage.url} />
                    </figure>
                  )}
              </td>
              <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
                {bid._bidderRef && bid._bidderRef.globalRating}
              </td>
              <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
                {bid.bidAmount && bid.bidAmount.value} {bid.bidAmount && bid.bidAmount.currency}
              </td>

              <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
                {bid._bidderRef &&
                  bid.bidAmount && (
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
                  )}
              </td>
            </tr>
          );
        });

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
              <th className="has-text-centered">Award a Bidder</th>
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
  if (!user) {
    return null;
  }
  const {
    profileImage = 'none',
    displayName = 'none',
    email = 'none provided',
    personalParagraph = 'none provided',
    membershipStatus = 'none',
    phoneNumber = 'none provided',
  } = user;
  const membershipStatusDisplay = Constants.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];
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
      {profileImage &&
        profileImage.url && (
          <figure style={{ margin: '0 auto' }} className="image  is-128x128">
            <img alt="profile" src={profileImage.url} />
          </figure>
        )}

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
  displayName = 'none',
  email = 'none',
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

class JobDetailsView extends React.Component {
  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.ENTRY);
  }

  render() {
    const { job, currentUser } = this.props;

    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myjobs);
      return null;
    }

    const {
      createdAt,
      fromTemplateId,
      durationOfJob,
      startingDateAndTime,
      title,
      detailedDescription,
    } = job;

    let temp = currentUser ? currentUser : { profileImage: '', displayName: '' };
    const { profileImage, displayName } = temp;

    const { hours, minutes, period } = startingDateAndTime;
    let daysSinceCreated = '';
    let createdAtToLocal = '';

    try {
      daysSinceCreated = createdAt
        ? moment.duration(moment().diff(moment(createdAt))).humanize()
        : 0;
      createdAtToLocal = moment(createdAt)
        .local()
        .format('YYYY-MM-DD hh:mm A');
    } catch (e) {
      console.error(e);
    }

    return (
      <div className="card">
        <header style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} className="card-header">
          <p className="card-header-title">
            <i style={{ marginRight: 4 }} className="fab fa-reddit-alien" />
            Details: {title || 'Job Title'}
          </p>
        </header>
        <div className="card-image is-clipped">
          <figure className="image is-3by1">
            <img
              src={
                templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
                  ? templatesRepo[fromTemplateId].imageUrl
                  : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
              }
              alt="Placeholder"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure style={{ margin: '0 auto' }} className="image is-32x32">
                <img src={profileImage.url} alt="user" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-12">{displayName}</p>
            </div>
          </div>

          <div className="content">
            <p className="heading">
              <span>Job Type</span>
              <br />
              <span className="has-text-weight-semibold">
                {templatesRepo[fromTemplateId].title || 'not specified'}
              </span>
            </p>
            <p className="heading">
              <span>Active since</span>
              <br />
              <span className="has-text-weight-semibold">
                {createdAtToLocal}
                <span style={{ fontSize: '10px', color: 'grey' }}>
                  {` (${daysSinceCreated} ago)`}
                </span>
              </span>
            </p>
            <p className="heading">
              <span>Start Date</span>
              <br />
              <span className="has-text-weight-semibold">
                {startingDateAndTime && moment(startingDateAndTime.date).format('MMMM Do YYYY')}
              </span>
            </p>
            <p className="heading">
              <span>Start Time</span>
              <br />
              <span className="has-text-weight-semibold">
                {hours}:{minutes === 0 ? '00' : minutes} {period}
              </span>
            </p>
            <p className="heading">
              <span>Duration Required</span>
              <br />
              <span className="has-text-weight-semibold">{durationOfJob || 'not specified'}</span>
            </p>
            <p className="heading">
              <span>Detailed Description</span>
              <br />
              <span className="has-text-weight-semibold">
                {detailedDescription || 'not specified'}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
