import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import JobDetailsView from './JobDetailsView';

export default class JobAndBidsDetailView extends React.Component {
  render() {
    const { job, currentUser } = this.props;
    if (!job || !currentUser) {
      switchRoute(ROUTES.CLIENT.ENTRY);
    }
    return (
      <section className="mainSectionContainer">
        <div className="container">
          <div class="columns">
            <div class="column">
              <JobDetailsView job={job} currentUser={currentUser} />
            </div>
            <div class="column">
              <BidsTable bidList={job._bidsList} currentUser={currentUser} />
            </div>
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
    const specialRow = { backgroundColor: 'red' };
    if (areThereAnyBids) {
      // find lowest bid details
      let tableRows = bidList.map(bid => (
        <tr
          key={bid._id}
          style={bid._bidderId._id === currentUser._id ? specialRow : null}
        >
          <td className="has-text-centered">
            <figure style={{ margin: '0 auto' }} className="image  is-64x64">
              <img alt="profile" src={bid._bidderId.profileImage.url} />
            </figure>
          </td>
          <td className="has-text-centered">{bid._bidderId.globalRating}</td>
          <td className="has-text-centered">
            {bid.bidAmount.value} {bid.bidAmount.currency}
          </td>
        </tr>
      ));

      return (
        <table style={{boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34) !important'}} className="table is-fullwidth is-hoverable">
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
      <table tyle={{boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34) !important'}} className="table is-fullwidth">
        <thead>
          <tr>
            <th>Bids Table</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              No one has made a bid Yet, Keep an eye and check again in a little
              while
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
