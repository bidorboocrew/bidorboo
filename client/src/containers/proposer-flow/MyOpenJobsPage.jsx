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

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import PastJobs from './PastJobs';
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
    this.props.getAllMyOpenJobs();
    this.props.getAllMyAwardedJobs();
  }

  changeActiveTab = (tabId) => {
    this.setState({ activeTab: tabId });
  };

  render() {
    const { myOpenJobsList, deleteJobById, myAwardedJobsList } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="container is-widescreen">
        <FloatingAddNewRequestButton />

        <div style={{ position: 'relative' }} className="tabs">
          <ul>
            <li className={`${activeTab === TAB_IDS.postedJobs ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.postedJobs);
                }}
              >
                {`${TAB_IDS.postedJobs} (${(myOpenJobsList && myOpenJobsList.length) || 0})`}
              </a>
            </li>
            <li className={`${activeTab === TAB_IDS.awardedJobs ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.awardedJobs);
                }}
              >
                {`${TAB_IDS.awardedJobs} (${(myAwardedJobsList && myAwardedJobsList.length) || 0})`}
              </a>
            </li>
            <li className={`${activeTab === TAB_IDS.pastJobs ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.pastJobs);
                }}
              >
                <span className="icon">
                  <i className="fas fa-history" aria-hidden="true" />
                </span>
                <span>{`${TAB_IDS.pastJobs} `}</span>
              </a>
            </li>
          </ul>
        </div>

        {activeTab === TAB_IDS.postedJobs && (
          <MyRequestsTab
            jobsList={myOpenJobsList}
            deleteJob={deleteJobById}
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
        {activeTab === TAB_IDS.pastJobs && <PastJobs />}
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
    deleteJobById: bindActionCreators(deleteJobById, dispatch),
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
