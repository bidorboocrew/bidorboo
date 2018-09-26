import React from 'react';

import PropTypes from 'prop-types';

import moment from 'moment';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import * as ROUTES from '../../constants/frontend-route-consts';
import { Proptypes_jobModel } from '../../client-server-interfaces';

class MyPostedJobCard extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    jobsList: PropTypes.arrayOf(Proptypes_jobModel),
    switchRoute: PropTypes.func.isRequired,
    userDetails: PropTypes.object
  };

  render() {
    const { jobsList, switchRoute, userDetails } = this.props;
    const MyJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        jobsList.map((job, index) => (
          <JobCard
            userDetails={userDetails}
            key={job._id}
            jobObj={job}
            jobCounterIndex={index}
          />
        ))
      ) : (
        <React.Fragment>
          <div>Sorry you have not posted any jobs</div>
          <div>
            <a
              className="button is-primary"
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            >
              post jobs
            </a>
          </div>
        </React.Fragment>
      );
    return (
      <section className="section">
        <div className="container">
          <div
            // style={{ alignItems: 'flex-end' }}
            className="columns is-multiline"
          >
            {MyJobsList}
          </div>
        </div>
      </section>
    );
  }
}

export default MyPostedJobCard;

const JobCard = props => {
  const { jobObj, jobCounterIndex, userDetails } = props;
  return (
    <div className="column is-one-third">
      <SummaryView
        userDetails={userDetails}
        jobCounterIndex={jobCounterIndex}
        jobObj={jobObj}
      />
    </div>
  );
};

class SummaryView extends React.Component {
  render() {
    const { jobCounterIndex, userDetails, jobObj } = this.props;
    const {
      startingDateAndTime,
      title,
      createdAt,
      _bidsList,
      fromTemplateId
    } = jobObj;

    const { profileImage, displayName, email } = userDetails;

    const areThereAnyBidders =
      _bidsList && _bidsList.map && _bidsList.length > 0;
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
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }

    return (
      // postedJobCard
      <div className="card">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header"
        >
          <p className="card-header-title">{title || 'Job Title'}</p>
        </header>
        <div className="card-image is-clipped">
          <figure className="image is-3by1">
            <img
              src={
                templatesRepo[fromTemplateId] &&
                templatesRepo[fromTemplateId].imageUrl
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
              <figure className="image is-32x32">
                <img src={profileImage.url} alt="user" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-6">{displayName}</p>
              <p className="subtitle is-6">{email}</p>
            </div>
          </div>

          <div className="content">
            <p className="heading"># {jobCounterIndex}</p>
            <p className="heading">
              Active since {createdAtToLocal}
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {` (${daysSinceCreated} ago)`}
              </span>
            </p>
            <p className="heading">
              Start Date
              {startingDateAndTime &&
                moment(startingDateAndTime.date).format('MMMM Do YYYY')}
            </p>
            {/* <p className="heading">Status {state}</p> */}
            {/* <p className="heading">
              last updated {moment(updatedAt).format('MMMM Do YYYY')}
            </p> */}
          </div>
        </div>

        <div className="has-text-centered" style={{ textAlign: 'center' }}>
          {/* show as disabled */}
          {!areThereAnyBidders && (
            <a
              disabled
              style={{ borderRadius: 0, backgroundColor: '#bdbdbd' }}
              className="button is-fullwidth is-large"
            >
              <span style={{ marginLeft: 4 }}>
                <i className="fa fa-hand-paper" /> Review Bids
              </span>
            </a>
          )}
          {/* show as enabled cuz there is bidders */}
          {areThereAnyBidders && (
            <React.Fragment>
              <a
                style={{ borderRadius: 0 }}
                className="button is-primary is-fullwidth is-large"
              >
                <span style={{ marginLeft: 4 }}>
                  <i className="fa fa-hand-paper" /> Review Bids
                </span>
              </a>
              <br />
            </React.Fragment>
          )}
        </div>
        <BidsTable
          bidList={_bidsList}
          areThereAnyBidders={areThereAnyBidders}
        />
      </div>
    );
  }
}

class BidsTable extends React.Component {
  render() {
    const { bidList } = this.props;

    const areThereAnyBids = bidList && bidList.length > 0;

    let lowestBidVal = -1;
    let lowestBidCurr = '';
    let bidderRating = '';

    if (areThereAnyBids) {
      const initialBid = bidList[0];
      lowestBidVal = initialBid.bidAmount.value;
      lowestBidCurr = initialBid.bidAmount.currency;
      bidderRating =
        initialBid._bidderId && initialBid._bidderId.globalRating
          ? `${initialBid._bidderId.globalRating} stars`
          : 'No Ratings Yet';
      // find lowest bid details
      bidList.forEach(bid => {
        if (bid.bidAmount.value < lowestBidVal) {
          lowestBidVal = bid.bidAmount.value;
          lowestBidCurr = bid.bidAmount.currency;
          bidderRating =
            bid._bidderId && bid._bidderId.globalRating
              ? `${bid._bidderId.globalRating} stars`
              : 'No Ratings Yet';
        }
      });
    }

    const BidsTable = areThereAnyBids ? (
      <table className="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th className="has-text-centered">Lowset Bid</th>
            <th className="has-text-centered">Bidder Rating</th>
            <th className="has-text-centered">Bids #</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="has-text-centered has-text-weight-semibold">
              {lowestBidVal} {lowestBidCurr}
            </td>
            <td className="has-text-centered">{bidderRating}</td>
            <td className="has-text-centered">{bidList.length}</td>
          </tr>
        </tbody>
      </table>
    ) : (
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>No Bids Yet</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>No Bids Yet, Keep an eye and check again in a little while</td>
          </tr>
        </tbody>
      </table>
    );
    return <React.Fragment>{BidsTable}</React.Fragment>;
  }
}

// class DetailedView extends React.Component {
//   render() {
//     const {
//       state,
//       addressText,
//       durationOfJob,
//       location,
//       startingDateAndTime,
//       title,
//       updatedAt,
//       whoSeenThis,
//       createdAt,
//       _bidsList,
//       _ownerId,
//       _id
//     } = this.props.jobObj;

//     return (
//       <div className="card">
//         <div className="card-content">
//           <div className="content">
//             <div> Development view , details </div>
//             <div>state : {state}</div>
//             <div>addressText : {addressText}</div>
//             <div>durationOfJob : {durationOfJob}</div>
//             <div>location : {JSON.stringify(location)}</div>
//             <div>title : {title}</div>
//             <div>whoSeenThis : {JSON.stringify(whoSeenThis)}</div>
//             <div>updatedAt : {updatedAt}</div>
//             <div>_bidsList : {JSON.stringify(_bidsList)}</div>
//             <div>_ownerId : {JSON.stringify(_ownerId)}</div>
//             <div>jobId : {JSON.stringify(_id)}</div>
//           </div>
//         </div>
//         <footer className="card-footer">
//           <div>
//             this is a dev view only and will be replaced with more user friendly
//             details soon
//           </div>
//         </footer>
//       </div>
//     );
//   }
// }
