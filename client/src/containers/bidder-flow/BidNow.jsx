import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';

import JobDetailsViewForBidder from '../../components/bidder-components/JobDetailsViewForBidder';
import PostYourBid from '../../components/forms/PostYourBid';
import { switchRoute } from '../../utils';

class BidNow extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    jobDetails: PropTypes.shape({
      state: PropTypes.string,
      _id: PropTypes.string,
      createdAt: PropTypes.string,
      fromTemplateId: PropTypes.string,
      startingDateAndTime: PropTypes.shape({
        date: PropTypes.string,
        hours: PropTypes.number,
        minutes: PropTypes.number,
        period: PropTypes.string,
      }),
      detailedDescription: PropTypes.string,
      title: PropTypes.string,
      _ownerRef: PropTypes.shape({
        profileImage: PropTypes.shape({
          url: PropTypes.string.isRequired,
          public_id: PropTypes.string,
        }),
        displayName: PropTypes.string,
      }),
    }),
  };

  render() {
    const { jobDetails, a_submitBid } = this.props;

    //if user tried to manually set the url to this page without selecting a job
    if (!jobDetails || !jobDetails._ownerRef) {
      //reroute them to bidder root
      switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    return (
      <div className="slide-in-left" id="bdb-bidder-bidNow">
        <div style={{ marginTop: '1rem' }} className="container">
          <nav style={{ marginLeft: '1rem' }} className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.BIDDER.root);
                  }}
                >
                  Bidder Home
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Bidding</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer">
          <div className="container">
            <div className="columns is-centered">
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
  mapDispatchToProps
)(BidNow);
