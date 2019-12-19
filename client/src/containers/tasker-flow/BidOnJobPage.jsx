import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import { RenderBackButton } from '../commonComponents';

import { getJobToBidOnDetails } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';

class BidOnJobPage extends React.Component {
  componentDidMount() {
    const { match, getJobToBidOnDetails } = this.props;

    if (match.params && match.params.jobId) {
      getJobToBidOnDetails(match.params.jobId);
    }
  }
  render() {
    const { submitBid, jobDetails, currentUserDetails, isLoggedIn, showLoginDialog } = this.props;
    let dontShowThisPage = !jobDetails || !jobDetails._id || !jobDetails._ownerRef;
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
              <RenderBackButton />

              {getMeTheRightRequestCard({
                job: jobDetails,
                isSummaryView: false,
                pointOfView: POINT_OF_VIEW.TASKER,
                submitBid,
                userDetails: currentUserDetails,
                showLoginDialog,
                isLoggedIn,
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
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidOnJobPage);
