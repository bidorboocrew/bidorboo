import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getAllMyOpenJobs,
  deleteJobById,
  getAllMyAwardedJobs,
} from '../../app-state/actions/jobActions';
import AwardedJobsList from '../../components/proposer-components/AwardedJobsList';
import autoBind from 'react-autobind';

import JobsWithBidsAwaitingReview from '../../components/proposer-components/JobsWithBidsAwaitingReview';
import JobsWithNoBids from '../../components/proposer-components/JobsWithNoBids';

const TAB_IDS = {
  reviewBids: 'Review Bids',
  inQueue: 'In Queue',
  noBids: 'No Bids',
};

class MyJobs extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyOpenJobs();
    this.props.a_getAllMyAwardedJobs();
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: TAB_IDS.reviewBids,
    };
    autoBind(this, 'changeActiveTab');
  }

  changeActiveTab(tabId) {
    this.setState({ activeTab: tabId });
  }

  render() {
    const {
      myOpenJobsList,
      userDetails,
      a_deleteJobById,
      myAwardedJobsList,
      notificationFeed,
    } = this.props;

    const { activeTab } = this.state;

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
        <div className="tabs">
          <ul>
            <li className={`${activeTab === TAB_IDS.reviewBids ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.reviewBids);
                }}
              >
                {TAB_IDS.reviewBids}
              </a>
            </li>
            <li className={`${activeTab === TAB_IDS.inQueue ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.inQueue);
                }}
              >
                {TAB_IDS.inQueue}
              </a>
            </li>
            <li className={`${activeTab === TAB_IDS.noBids ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.noBids);
                }}
              >
                {TAB_IDS.noBids}
              </a>
            </li>
          </ul>
        </div>
        <section className="section" style={{ paddingBottom: '0.25rem' }}>
          <div className="columns is-multiline is-mobile">
            {activeTab === TAB_IDS.reviewBids && (
              <JobsWithBidsAwaitingReview
                userDetails={userDetails}
                jobsList={myOpenJobsList}
                deleteJob={a_deleteJobById}
                notificationFeed={notificationFeed}
              />
            )}
            {activeTab === TAB_IDS.inQueue && (
              <AwardedJobsList
                notificationFeed={notificationFeed}
                userDetails={userDetails}
                jobsList={myAwardedJobsList}
              />
            )}
            {activeTab === TAB_IDS.noBids && (
              <JobsWithNoBids
                userDetails={userDetails}
                jobsList={myOpenJobsList}
                deleteJob={a_deleteJobById}
                disabled
                notificationFeed={notificationFeed}
              />
            )}
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    error: jobsReducer.error,
    myOpenJobsList: jobsReducer.myOpenJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    notificationFeed: uiReducer.notificationFeed,
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
