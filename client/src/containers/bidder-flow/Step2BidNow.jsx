import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';

import JobDetailsViewForBidder from '../../components/bidder-components/JobDetailsViewForBidder';
import PostYourBid from '../../components/forms/PostYourBid';
import { switchRoute } from '../../utils';
import BidderStepper from './BidderStepper';

class BidNow extends React.Component {
  render() {
    const { jobDetails, a_submitBid } = this.props;

    //if user tried to manually set the url to this page without selecting a job
    if (!jobDetails || !jobDetails._ownerRef) {
      //reroute them to bidder root
      switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    return (
      <React.Fragment>
        <BidderStepper currentStepNumber={2} />

        <div className="container bdbPage pageWithStepper desktop">
          <section className="bdbPage">
            <div className="container">
              <div className="columns  is-multiline">
                <div className="column is-6">
                  {jobDetails && jobDetails._id && (
                    <React.Fragment>
                      <PostYourBid
                        onSubmit={(values) => {
                          a_submitBid({ jobId: jobDetails._id, bidAmount: values.bidAmountField });
                        }}
                        onCancel={() => {
                          switchRoute(ROUTES.CLIENT.BIDDER.root);
                        }}
                      />
                      <JobDetailsViewForBidder job={jobDetails} />
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidNow);
