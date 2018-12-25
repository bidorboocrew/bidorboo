import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getAllMyOpenJobs,
  deleteJobById,
  getAllMyAwardedJobs,
} from '../../app-state/actions/jobActions';
import MyAwardedJobsTab from './components/MyAwardedJobsTab';
import MyRequestsTab from './components/MyRequestsTab';
import { TAB_IDS } from './components/helperComponents';

class MyOpenJobsPage extends React.Component {
  constructor(props) {
    super(props);
    let initialTabSelection = TAB_IDS.postedJobs;
    if (props.match && props.match.params && props.match.params.tabId) {
      const { tabId } = props.match.params;
      if (tabId && TAB_IDS[`${tabId}`]) {
        initialTabSelection = TAB_IDS[`${tabId}`];
      }
    }

    this.state = {
      activeTab: initialTabSelection,
      showBidReviewModal: false,
    };
  }

  componentDidMount() {
    this.props.a_getAllMyOpenJobs();
    this.props.a_getAllMyAwardedJobs();
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
            <li className={`${activeTab === TAB_IDS.postedJobs ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.postedJobs);
                  // switchRoute(ROUTES.CLIENT.PROPOSER.getMyOpenJobsPostedJobsTab());
                }}
              >
                {TAB_IDS.postedJobs}
              </a>
            </li>
            <li className={`${activeTab === TAB_IDS.awardedJobs ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.awardedJobs);
                  // switchRoute(ROUTES.CLIENT.PROPOSER.getMyOpenJobsAwardedJobsTab());
                }}
              >
                {TAB_IDS.awardedJobs}
              </a>
            </li>
          </ul>
        </div>
        <section className="section">
          <div className="container">
            {activeTab === TAB_IDS.postedJobs && (
              <MyRequestsTab
                jobsList={myOpenJobsList}
                deleteJob={a_deleteJobById}
                changeActiveTab={this.changeActiveTab}
                {...this.props}
              />
            )}
            {activeTab === TAB_IDS.awardedJobs && (
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
