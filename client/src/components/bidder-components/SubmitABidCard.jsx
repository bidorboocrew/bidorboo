import React from 'react';

import * as ROUTES from '../../constants/frontend-route-consts';
import PostYourBid from '../forms/PostYourBid';
import { switchRoute } from '../../utils';
import JobDetailsView from '../JobDetailsView';

export default class SubmitABidCard extends React.Component {
  render() {
    const { jobDetails, onSubmit } = this.props;

    if (!jobDetails || !jobDetails._ownerRef) {
      return null;
    }
    const { _id } = jobDetails;

    return (
      <React.Fragment>
        <PostYourBid
          onSubmit={values => {
            onSubmit({ jobId: _id, bidAmount: values.bidAmountField });
          }}
          onCancel={() => {
            switchRoute(ROUTES.CLIENT.BIDDER.root);
          }}
        />
        <JobDetailsView job={jobDetails} />
      </React.Fragment>
    );
  }
}
