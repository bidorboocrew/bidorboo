import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import moment from 'moment';
import ReactDOM from 'react-dom';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import OtherUserDetails from '../OtherUserDetails';

export default class AwardedJobFullDetailsCard extends React.Component {
  static propTypes = {
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
      showConnectToBidderDialog: false,
    };

    autoBind(this, 'toggleConnecToBidderDialog');
  }
  toggleConnecToBidderDialog(e) {
    e.preventDefault(e);

    this.setState({ showConnectToBidderDialog: !this.state.showConnectToBidderDialog });
  }

  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
  }

  render() {
    const { job, currentUser, breadCrumb } = this.props;

    if (!job || !job._id || !job.awardedBid || !job.awardedBid._bidderRef) {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
      return null;
    }

    const { _bidderRef } = job.awardedBid;
    const bidText = `${job.awardedBid.bidAmount.value} ${job.awardedBid.bidAmount.currency}`;
    const cardTitle = () => {
      return (
        <header className="card-header">
          <p className="card-header-title">
            <span className="has-text-primary is-capitalized has-text-weight-bold ">
              {`Bidder details (${bidText})`}
            </span>
          </p>
        </header>
      );
    };

    const cardFooter = () => (
      <React.Fragment>
        <div className="has-text-centered is-size-2 ">
          bid amount :
          <span className="has-text-primary is-capitalized has-text-weight-bold">
            {` ${bidText}`}
          </span>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <a
              onClick={this.toggleConnecToBidderDialog}
              className="button is-primary is-fullwidth is-large"
            >
              Contact
            </a>
          </div>
          <div className="card-footer-item">
            <a
              onClick={() => switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage)}
              className="button is-danger is-outlined is-fullwidth is-large"
            >
              Go Back
            </a>
          </div>
        </footer>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {this.state.showConnectToBidderDialog &&
          ReactDOM.createPortal(
            <ContactMeDialog user={_bidderRef} close={this.toggleConnecToBidderDialog} />,
            this.appRoot
          )}

        {breadCrumb}
        {/* <React.Fragment>
        <h2 style={{ marginBottom: 2 }} className="subtitle">
          Bids List
        </h2>
        <BidsTable
          bidList={job._bidsListRef}
          currentUser={currentUser}
          showReviewModal={this.showReviewModal}
        />
      </React.Fragment> */}
        {_bidderRef && (
          <OtherUserDetails
            otherUserDetails={_bidderRef}
            cardFooter={cardFooter()}
            cardTitle={cardTitle()}
          />
        )}

        <br />

        <AwardedJobDetails job={job} currentUser={currentUser} />
      </React.Fragment>
    );
  }
}

const ContactMeDialog = ({ user, close }) => {
  const { displayName, email, phoneNumber = 'none provided' } = user;

  return (
    <div className="modal is-active">
      <div onClick={close} className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Bidder Contact Info</p>
          <button onClick={close} className="delete" aria-label="close" />
        </header>
        <section className="modal-card-body">
          <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
          <DisplayLabelValue labelText="Email:" labelValue={email} />
          <DisplayLabelValue labelText="Phone Number:" labelValue={phoneNumber} />

          <NotesDisplayAndValue
            labelText="We Advice You To:"
            labelValue={
              <React.Fragment>
                <p>1) Make sure to agree on all necessary details about the task</p>
                <p>2) Make sure to specify exact day and time</p>
                <p>
                  3) Confirm that the final price is the one listed against this job and not a dime
                  more
                </p>
              </React.Fragment>
            }
          />
          <br />
          <NotesDisplayAndValue
            labelText="notes*"
            labelValue={
              <React.Fragment>
                <p>
                  - To ensure quality you will get to rate the Bidder once they fullfilled the job.
                </p>
                <p>
                  - Tasks are expected to match the scope in the listing and the final price is not
                  negotiable
                </p>
                <p className="has-text-weight-bold has-text-info">
                  - For safety we will handled payments automatically throught our service.
                </p>
              </React.Fragment>
            }
          />
        </section>
        <footer className="modal-card-foot">
          <button onClick={close} className="button is-success">
            Got It!
          </button>
          <button onClick={close} className="button">
            Go Back
          </button>
        </footer>
      </div>
    </div>
  );
};

class AwardedJobDetails extends React.Component {
  componentDidCatch() {
    switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
  }

  render() {
    const { job, currentUser } = this.props;

    if (!job || !job._id) {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
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
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="card is-clipped">
            <header
              style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
              className="card-header"
            >
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

const DisplayLabelValue = (props) => {
  return (
    <div style={{ padding: 4, marginBottom: 4 }}>
      <div style={{ color: 'grey', fontSize: 12 }}>{props.labelText}</div>
      <div className="has-text-weight-bold" style={{ fontSize: 14 }}>
        {props.labelValue}
      </div>
    </div>
  );
};

const NotesDisplayAndValue = (props) => {
  return (
    <div style={{ padding: 4, marginBottom: 4 }}>
      <div style={{ color: 'grey', fontSize: 12 }}>{props.labelText}</div>
      <div className="has-text-weight-bold" style={{ fontSize: 10 }}>
        {props.labelValue}
      </div>
    </div>
  );
};
