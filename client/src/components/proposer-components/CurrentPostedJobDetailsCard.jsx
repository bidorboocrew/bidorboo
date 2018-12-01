import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import OtherUserDetails from '../OtherUserDetails';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

export default class CurrentPostedJobDetailsCard extends React.Component {
  static propTypes = {
    awardBidder: PropTypes.func.isRequired,
    markBidAsSeen: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
    breadCrumb: PropTypes.node,
    hideBidTable: PropTypes.bool,
  };

  static defaultProps = {
    breadCrumb: null,
    hideBidTable: false,
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
    const { job, currentUser, breadCrumb, markBidAsSeen, hideBidTable } = this.props;

    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
      return null;
    }

    const reviewBidderbreadCrumb = () => {
      return (
        <div style={{ marginBottom: '1rem' }}>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
                  }}
                >
                  My Requests
                </a>
              </li>
              <li>
                <a onClick={this.closeReviewModal} aria-current="page">
                  {job.title}
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Bidder</a>
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
              Review Bidder
            </span>
          </p>
        </header>
      );
    };

    const cardFooter = () => {
      return (
        <React.Fragment>
          <div className="has-text-centered is-size-2 ">
            Bid Amount :
            <span className="has-text-primary is-capitalized has-text-weight-bold ">
              {` ${this.state.bidText}`}
            </span>
          </div>
          <footer className="card-footer">
            <div className="card-footer-item">
              <a onClick={this.awardBidderHandler} className="button is-primary is-fullwidth ">
                Accept Bid
              </a>
            </div>
            <div className="card-footer-item">
              <a onClick={this.closeReviewModal} className="button is-danger is-outlined ">
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
        <div>
          {!hideBidTable && (
            <BidsTable
              jobId={job._id}
              bidList={job._bidsListRef}
              currentUser={currentUser}
              showReviewModal={this.showReviewModal}
              markBidAsSeen={markBidAsSeen}
            />
          )}
          <PostedJobsDetails job={job} currentUser={currentUser} />
        </div>
      </React.Fragment>
    );

    return <React.Fragment>{pageContent}</React.Fragment>;
  }
}

class BidsTable extends React.Component {
  render() {
    const { bidList, showReviewModal, markBidAsSeen, jobId } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;
    if (areThereAnyBids) {
      // find lowest bid details
      let tableRows =
        bidList &&
        bidList.map((bid) => {
          return (
            <tr key={bid._id || Math.random()} style={{ wordWrap: 'break-word' }}>
              <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
                <div>
                  {bid._bidderRef &&
                    bid._bidderRef.profileImage &&
                    bid._bidderRef.profileImage.url && (
                      <figure style={{ margin: '0 auto' }} className="image is-48x48">
                        <img alt="profile" src={bid._bidderRef.profileImage.url} />
                      </figure>
                    )}
                </div>
                <div>
                  {bid._bidderRef && bid._bidderRef.rating
                    ? `${bid._bidderRef.rating.globalRating}`
                    : null}
                </div>
              </td>

              <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
                <div>
                  {bid.bidAmount && bid.bidAmount.value} {bid.bidAmount && bid.bidAmount.currency}
                </div>
                {bid.isNewBid ? (
                  <div
                    style={{ verticalAlign: 'middle', marginLeft: 4, fontWeight: 100 }}
                    className="tag is-info"
                  >
                    new bid
                    {/* <button
                      onClick={(e) => {
                        e.preventDefault();
                        markBidAsSeen(jobId, bid._id);
                      }}
                      className="delete"
                    /> */}
                  </div>
                ) : null}
              </td>

              <td style={{ verticalAlign: 'middle' }} className="has-text-centered">
                {bid._bidderRef && bid.bidAmount && (
                  <a
                    onClick={(e) => {
                      markBidAsSeen(jobId, bid._id);

                      showReviewModal(
                        e,
                        bid._bidderRef,
                        `${bid.bidAmount.value} ${bid.bidAmount.currency}`,
                        bid._id,
                      );
                    }}
                    className="button is-primary is-outlined"
                  >
                    Review Bid
                  </a>
                )}
              </td>
            </tr>
          );
        });

      return (
        <div className="columns  is-multiline">
          <div className="column is-half">
            <table
              style={{ border: '1px solid rgba(10, 10, 10, 0.1)' }}
              className="table is-hoverable table is-striped is-fullwidth"
            >
              <thead>
                <tr>
                  <th className="has-text-centered">Bidder</th>
                  <th className="has-text-centered">$</th>
                  <th className="has-text-centered">Bid Details</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        </div>
      );
    }
    // no bids yet
    return (
      <div className="columns  is-multiline">
        <div className="column is-half">
          <table className="table is-hoverable table is-striped is-fullwidth">
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
        </div>
      </div>
    );
  }
}

class PostedJobsDetails extends React.Component {
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
      jobImages,
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

    let carouselItems = null;

    if (jobImages && jobImages.length > 0) {
      carouselItems = jobImages.map((imgObj) => (
        <img
          key={Math.random()}
          onClick={() => {
            window.open(imgObj.url, '_blank');
          }}
          src={`${imgObj.url}`}
          className="bdb-cover-img"
        />
      ));
    }

    return (
      <div className="columns  is-multiline">
        <div className="column is-half">
          <div className="card noShadow is-clipped">
            <header
              style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
              className="card-header"
            >
              <p className="card-header-title">Request Details</p>
            </header>
            {!jobImages && !(jobImages.length > 0) && (
              <div className="card-image is-clipped">
                <img
                  className="bdb-cover-img"
                  src={`${
                    templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
                      ? templatesRepo[fromTemplateId].imageUrl
                      : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
                  }`}
                />
              </div>
            )}

            {jobImages && jobImages.length > 0 && (
              <Carousel
                className="bdb-carousel-img-arrow"
                showStatus={false}
                showThumbs={false}
                emulateTouch={true}
              >
                {carouselItems}
              </Carousel>
            )}
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure style={{ margin: '0 auto' }} className="image is-48x48">
                    <img src={profileImage.url} alt="user" />
                  </figure>
                </div>
                <div className="media-content">
                  <p className="title is-12">{displayName}</p>
                </div>
              </div>

              <div className="content">
                <p className="heading">
                  <span>Service Type</span>
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
                  <span className="has-text-weight-semibold">
                    {durationOfJob || 'not specified'}
                  </span>
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
        </div>
      </div>
    );
  }
}
