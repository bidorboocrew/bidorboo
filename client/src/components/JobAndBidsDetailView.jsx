import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import JobDetailsView from './JobDetailsView';

export default class JobAndBidsDetailView extends React.Component {
  render() {
    const { job, currentUser } = this.props;
    const dontShowRoute = !job || !currentUser || !job._bidsListRef;
    if (dontShowRoute) {
      switchRoute(ROUTES.CLIENT.ENTRY);
    }
    return dontShowRoute ? null : (
      <section className="mainSectionContainer">
        <div className="container">
          <div>
            <BidsTable bidList={job._bidsListRef} currentUser={currentUser} />
          </div>
          <br />
          <div>
            <JobDetailsView job={job} currentUser={currentUser} />
          </div>
        </div>
      </section>
    );
  }
}

class BidsTable extends React.Component {
  render() {
    const { bidList, currentUser } = this.props;
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
