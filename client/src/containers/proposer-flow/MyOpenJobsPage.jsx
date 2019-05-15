import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getAllMyOpenJobs,
  cancelJobById,
  getAllMyAwardedJobs,
} from '../../app-state/actions/jobActions';

import getPostedSummaryCardByTemplateJobId from '../../bdb-tasks/getPostedSummaryCardByTemplateJobId';
import getAwardedSummaryCardByTemplateJobId from '../../bdb-tasks/getAwardedSummaryCardByTemplateJobId';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
class MyOpenJobsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBidReviewModal: false,
    };
  }

  componentDidMount() {
    this.props.getAllMyOpenJobs();
    this.props.getAllMyAwardedJobs();
  }

  render() {
    const { myOpenJobsList, myAwardedJobsList } = this.props;

    const areThereAnyJobsToView =
      (myAwardedJobsList && myAwardedJobsList.length > 0) ||
      (myOpenJobsList && myOpenJobsList.length > 0);
    return (
      <div className="container is-widescreen">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">My Requests</h1>
            </div>
          </div>
        </section>
        <hr className="divider" />
        <FloatingAddNewRequestButton />

        {areThereAnyJobsToView && (
          <div className="columns is-multiline is-centered">
            {generateAwardedRequestsSummaryCards(this.props)}
            {generateOpenRequetsSummaryCards(this.props)}
          </div>
        )}

        {!areThereAnyJobsToView && <EmptyStateComponent />}
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    myOpenJobsList: jobsReducer.myOpenJobsList,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllMyOpenJobs: bindActionCreators(getAllMyOpenJobs, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    getAllMyAwardedJobs: bindActionCreators(getAllMyAwardedJobs, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyOpenJobsPage);

const FloatingAddNewRequestButton = () => {
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        switchRoute(ROUTES.CLIENT.PROPOSER.root);
      }}
      className="button is-link bdbFloatingButtonText"
    >
      +
    </a>
  );
};

const EmptyStateComponent = () => (
  <div className="has-text-centered">
    <div style={{ maxWidth: 'unset' }} className="card">
      <div className="card-content">
        <div className="content has-text-centered">
          <div className="is-size-5">You have not requested any services yet</div>
          <br />
          <a
            className="button is-success "
            onClick={(e) => {
              e.preventDefault();
              switchRoute(ROUTES.CLIENT.PROPOSER.root);
            }}
          >
            Request a Service
          </a>
        </div>
      </div>
    </div>
  </div>
);

const generateAwardedRequestsSummaryCards = (props) => {
  const { myAwardedJobsList } = props;

  const myAwardedJobs = myAwardedJobsList.map((job) => {
    return (
      <div key={job._id} className="column">
        {getAwardedSummaryCardByTemplateJobId(job, props)}
        {/* <JobSummaryForAwarded showBidCount={false} job={job} /> */}
      </div>
    );
  });
  return myAwardedJobs;
};

const generateOpenRequetsSummaryCards = (props) => {
  const { myOpenJobsList } = props;

  const jobCards = myOpenJobsList.map((job) => {
    return (
      <div key={job._id} className="column">
        {getPostedSummaryCardByTemplateJobId(job, props)}
      </div>
    );
  });
  return jobCards;
};
