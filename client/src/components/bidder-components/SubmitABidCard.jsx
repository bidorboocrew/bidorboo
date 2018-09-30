import React from 'react';
import moment from 'moment';

import * as ROUTES from '../../constants/frontend-route-consts';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import PostYourBid from '../forms/PostYourBid';
import { switchRoute } from '../../utils';
import CommonJobDetailedCard from '../CommonJobDetailedCard';

export default class SubmitABidCard extends React.Component {
  render() {
    const { jobDetails, onSubmit } = this.props;

    if (!jobDetails || !jobDetails._ownerId) {
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
        <CommonJobDetailedCard job={jobDetails} />
      </React.Fragment>
    );
  }
}
