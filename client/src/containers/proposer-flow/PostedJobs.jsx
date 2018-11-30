import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getAllMyOpenJobs,
  deleteJobById,
  getAllMyAwardedJobs,
} from '../../app-state/actions/jobActions';
import AwardedJobsList from '../../components/proposer-components/AwardedJobsList';

import JobsWithBidsAwaitingReview from '../../components/proposer-components/JobsWithBidsAwaitingReview';
import JobsWithNoBids from '../../components/proposer-components/JobsWithNoBids';

class MyJobs extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyOpenJobs();
    this.props.a_getAllMyAwardedJobs();
  }

  render() {
    const { myOpenJobsList, userDetails, a_deleteJobById, myAwardedJobsList } = this.props;
    return (
      <div className="bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div>
              <h1 style={{ color: 'white' }} className="title">
                My Requests
              </h1>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingBottom: '0.25rem' }}>
          <div>
            <div className="tabs">
              <ul>
                <li className="is-active">
                  <a>Review Bids</a>
                </li>
              </ul>
            </div>
            <div className="columns is-multiline is-mobile">
              <JobsWithBidsAwaitingReview
                userDetails={userDetails}
                jobsList={myOpenJobsList}
                deleteJob={a_deleteJobById}
              />
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingBottom: '0.25rem' }}>
          <div>
            <div className="tabs">
              <ul>
                <li className="is-active">
                  <a>Queued jobs</a>
                </li>
              </ul>
            </div>
            <div className="columns is-multiline is-mobile">
              <AwardedJobsList userDetails={userDetails} jobsList={myAwardedJobsList} />
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingBottom: '0.25rem' }}>
          <div>
            <div className="tabs">
              <ul>
                <li className="is-active">
                  <a>No bids yet</a>
                </li>
              </ul>
            </div>
            <div className="columns is-multiline is-mobile">
              <JobsWithNoBids
                userDetails={userDetails}
                jobsList={myOpenJobsList}
                deleteJob={a_deleteJobById}
                disabled
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    error: jobsReducer.error,
    myOpenJobsList: jobsReducer.myOpenJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllMyOpenJobs: bindActionCreators(getAllMyOpenJobs, dispatch),
    a_deleteJobById: bindActionCreators(deleteJobById, dispatch),
    a_getAllMyAwardedJobs: bindActionCreators(getAllMyAwardedJobs, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyJobs);
