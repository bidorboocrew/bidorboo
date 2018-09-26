import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import { Proptypes_jobModel } from '../../client-server-interfaces';

export default class MyCurrentPostedJobCardWithDetails extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    jobDetails: Proptypes_jobModel,
    switchRoute: PropTypes.func.isRequired,
    userDetails: PropTypes.object
  };

  render() {
    const { jobDetails,  userDetails } = this.props;
    return (
      <JobCard
        userDetails={userDetails}
        key={jobDetails._id}
        jobObj={jobDetails}
        jobCounterIndex={1}
      />
    );
  }
}

const JobCard = props => {
  const { jobObj, jobCounterIndex, userDetails } = props;
  return (
      <SummaryView
        userDetails={userDetails}
        jobCounterIndex={jobCounterIndex}
        jobObj={jobObj}
      />
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

    const bidsRows =
      bidList &&
      bidList.length > 0 &&
      bidList.map((bid, index) => {
        return (
          <tr key={bid._id}>
            <td>{index}</td>
            <td>
              {bid._bidderId && bid._bidderId.globalRating
                ? `${bid._bidderId.globalRating} stars`
                : 'No Ratings Yet'}
            </td>
            <td>
              {bid.bidAmount.value} {bid.bidAmount.currency}
            </td>
          </tr>
        );
      });

    const BidsTable =
      bidList && bidList.map && bidList.length > 0 ? (
        <table className="table is-fullwidth is-hoverable">
          <thead style={{ background: '#00d1b2' }}>
            <tr>
              <th>#</th>
              <th>Bidder Rating</th>
              <th>Bid Amount</th>
            </tr>
          </thead>

          <tbody>{bidsRows}</tbody>
        </table>
      ) : (
        <table className="table is-fullwidth">
          <thead style={{ backgroundColor: '#bdbdbd' }}>
            <tr>
              <th>No Bidders</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                No Bids Yet, Keep an eye and check again in a little while
              </td>
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
