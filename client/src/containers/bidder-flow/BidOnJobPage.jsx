import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { getJobToBidOnDetails } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';

class BidOnJobPage extends React.Component {
  componentDidMount() {
    const { match, getJobToBidOnDetails, jobDetails } = this.props;

    if (!jobDetails || !jobDetails._id) {
      if (match.params && match.params.jobId) {
        getJobToBidOnDetails(match.params.jobId);
      }
    }
  }
  render() {
    const { submitBid, isLoggedIn, jobDetails, currentUserDetails } = this.props;
    let dontShowThisPage = !jobDetails || !jobDetails._id || !jobDetails._ownerRef || !isLoggedIn;
    if (dontShowThisPage) {
      return (
        <section className="section">
          <Spinner renderLabel="getting job details" isLoading size={'large'} />
        </section>
      );
    }

    return (
      <>
        <div>
          <div className="columns is-centered">
            <div className="column limitLargeMaxWidth">
              <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <a onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.root)}>
                      <span>All Requests</span>
                    </a>
                  </li>
                  <li className="is-active">
                    <a>Place your bid</a>
                  </li>
                </ul>
              </nav>
              <section style={{ marginBottom: 6 }} className="card cardWithButton nofixedwidth">
                <div className="card-content">
                  <div className="content">
                    <div className="subtitle">
                      {`What is your `}
                      <span>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            const elmnt = document.getElementById('bob-bid-on-request');
                            elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
                          }}
                          className="is-text"
                        >
                          {`Bid`}
                        </a>
                      </span>
                      {` to fulfill this request?`}
                    </div>
                  </div>
                  {/* <HowItWorks step={2} isMoreDetails isSmall /> */}
                </div>
              </section>

              {getMeTheRightRequestCard({
                job: jobDetails,
                isSummaryView: false,
                pointOfView: POINT_OF_VIEW.TASKER,
                submitBid,
                userDetails: currentUserDetails,
              })}
            </div>
          </div>
        </div>
        <br />
      </>
    );
  }
}
const mapStateToProps = ({ bidsReducer, userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    jobDetails: bidsReducer.jobToBidOnDetails,
    currentUserDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    submitBid: bindActionCreators(submitBid, dispatch),
    getJobToBidOnDetails: bindActionCreators(getJobToBidOnDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidOnJobPage);
