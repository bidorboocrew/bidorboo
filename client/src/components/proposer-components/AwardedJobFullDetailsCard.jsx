import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import OtherUserDetails from '../OtherUserDetails';

export default class AwardedJobFullDetailsCard extends React.Component {
  static propTypes = {
    awardBidder: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
    breadCrumb: PropTypes.node,
  };

  static defaultProps = {
    breadCrumb: null,
  };

  constructor(props) {
    super(props);
    this.appRoot = document.querySelector('#bidorboo-root-view');

    this.state = {
      showReviewBidder: false,
      bidText: '',
      bidId: null,
      userUnderReview: null,
    };
    autoBind(this, 'closeReviewModal', 'showReviewModal', 'awardBidderHandler');
  }

  showReviewModal(e, userUnderReview, bidText, bidId) {
    e.preventDefault();
    this.setState({ showReviewBidder: true, userUnderReview, bidText: bidText, bidId });
  }

  closeReviewModal(e) {
    e.preventDefault();
    this.setState({ showReviewBidder: false, userUnderReview: null, bidText: '', bidId: null });
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
    const { job, currentUser, breadCrumb } = this.props;

    debugger
    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
      return null;
    }

    const reviewBidderbreadCrumb = () => {
      return (
        <div style={{ marginBottom: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
                  }}
                >
                  Awarded Jobs
                </a>
              </li>
              <li>
                <a onClick={this.closeReviewModal} aria-current="page">
                  {job.title}
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Agreement Details</a>
              </li>
            </ul>
          </nav>
        </div>
      );
    };

    const cardTitle = () => {
      return (
        <header className="card-header">
          <p className="card-header-title">
            <span className="has-text-primary is-capitalized has-text-weight-bold ">
              {`Bidder details (${this.state.bidText})`}
            </span>
          </p>
        </header>
      );
    };

    const cardFooter = () => {
      return (
        <React.Fragment>
          <div className="has-text-centered is-size-5 ">
            bid amount :
            <span className="has-text-primary is-capitalized has-text-weight-bold ">
              {` ${this.state.bidText}`}
            </span>
          </div>
          <footer className="card-footer">
            <div className="card-footer-item">
              <a
                onClick={this.awardBidderHandler}
                className="button is-primary is-fullwidth is-large"
              >
                Accept Bid
              </a>
            </div>
            <div className="card-footer-item">
              <a
                onClick={this.closeReviewModal}
                className="button is-danger is-outlined is-fullwidth is-large"
              >
                Go Back
              </a>
            </div>
          </footer>
        </React.Fragment>
      );
    };

    let pageContent = this.state.showReviewBidder ? (
      <OtherUserDetails
        otherUserDetails={this.state.userUnderReview}
        breadCrumb={reviewBidderbreadCrumb()}
        cardFooter={cardFooter()}
        cardTitle={cardTitle()}
      />
    ) : (
      <React.Fragment>
        {breadCrumb}
        <div className="container">
          <React.Fragment>
            <h2 style={{ marginBottom: 2 }} className="subtitle">
              Bids List
            </h2>
            <BidsTable
              bidList={job._bidsListRef}
              currentUser={currentUser}
              showReviewModal={this.showReviewModal}
            />
          </React.Fragment>

          <React.Fragment>
            <h2 style={{ marginBottom: 2 }} className="subtitle">
              Job Details
            </h2>
            <JobDetailsView job={job} currentUser={currentUser} />
          </React.Fragment>
        </div>
      </React.Fragment>
    );

    return <React.Fragment>{pageContent}</React.Fragment>;
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

class JobDetailsView extends React.Component {
  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.ENTRY);
  }

  render() {
    const { job, currentUser } = this.props;

    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
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
      <div className="card is-clipped">
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
