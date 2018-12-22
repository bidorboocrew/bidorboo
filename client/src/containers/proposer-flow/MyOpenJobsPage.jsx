import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getAllMyOpenJobs,
  deleteJobById,
  getAllMyAwardedJobs,
} from '../../app-state/actions/jobActions';
import MyAwardedJobsTab from './MyAwardedJobsTab';
import MyRequestsTab from './MyRequestsTab';

const TAB_IDS = {
  reviewBids: 'My Requests',
  inQueue: 'Awarded',
};

class MyOpenJobsPage extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyOpenJobs();
    this.props.a_getAllMyAwardedJobs();
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTab: TAB_IDS.reviewBids,
    };
  }

  changeActiveTab = (tabId) => {
    this.setState({ activeTab: tabId });
  };

  render() {
    const { myOpenJobsList, a_deleteJobById, myAwardedJobsList } = this.props;
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
          </ul>
        </div>
        <section className="section">
          <div className="container">
            {activeTab === TAB_IDS.reviewBids && (
              <MyRequestsTab
                jobsList={myOpenJobsList}
                deleteJob={a_deleteJobById}
                changeActiveTab={this.changeActiveTab}
                {...this.props}
              />
            )}
            {activeTab === TAB_IDS.inQueue && (
              <MyAwardedJobsTab
                jobsList={myAwardedJobsList}
                changeActiveTab={this.changeActiveTab}
                {...this.props}
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
    myOpenJobsList: jobsReducer.myOpenJobsList,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
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
)(MyOpenJobsPage);
