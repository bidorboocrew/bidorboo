import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';

import JobDetailsViewForBidder from '../../components/bidder-components/JobDetailsViewForBidder';
import PostYourBid from '../../components/forms/PostYourBid';
import { switchRoute } from '../../utils';
import { updateBooedBy } from '../../app-state/actions/jobActions';
class BidOnJobPage extends React.Component {
  render() {
    const { jobDetails, a_submitBid, a_updateBooedBy } = this.props;

    //if user tried to manually set the url to this page without selecting a job
    if (!jobDetails || !jobDetails._ownerRef) {
      //reroute them to bidder root
      switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    return (
      <section className="section">
        <div className="container">
          {jobDetails && jobDetails._id && (
            <React.Fragment>
              <PostYourBid
                onSubmit={(values) => {
                  a_submitBid({ jobId: jobDetails._id, bidAmount: values.bidAmountField });
                }}
                onCancel={() => {
                  a_updateBooedBy(jobDetails);
                  switchRoute(ROUTES.CLIENT.BIDDER.root);
                }}
              />
              <JobDetailsViewForBidder job={jobDetails} />
              <br />
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
}
const mapStateToProps = ({ bidsReducer }) => {
  return {
    jobDetails: bidsReducer.jobDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_submitBid: bindActionCreators(submitBid, dispatch),
    a_updateBooedBy: bindActionCreators(updateBooedBy, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidOnJobPage);
