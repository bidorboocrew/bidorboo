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
    let initialTabSelection = TAB_IDS.myRequests;
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

        <div style={{ position: 'relative' }} className="tabs is-medium">
          <ul>
            <li className={`${activeTab === TAB_IDS.myRequests ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(TAB_IDS.myRequests);
                }}
              >
                {TAB_IDS.myRequests}
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
                <span>{`${TAB_IDS.pastJobs}`}</span>
              </a>
            </li>
          </ul>
        </div>

        {activeTab === TAB_IDS.myRequests && (
          <React.Fragment>
            {/* <section className="hero is-dark has-text-centered">
              <div className="hero-body">
                <div className="container">
                  <h1 className="has-text-weight-bold is-size-6">{`Scheduled Tasks (${(myAwardedJobsList &&
                    myAwardedJobsList.length) ||
                    0})`}</h1>
                  <h2 style={{ color: 'lightgrey' }} className="is-size-8">
                    Below is all your requests that you assigned to a BidOrBoo Tasker. The Tasker
                    will show up to fulfil your request.
                  </h2>
                </div>
              </div>
            </section> */}
            <MyAwardedJobsTab
              jobsList={myAwardedJobsList}
              changeActiveTab={this.changeActiveTab}
              {...this.props}
            />

            {/* <section className="hero is-dark has-text-centered">
              <div className="hero-body">
                <div className="container">
                  <h1 className="has-text-weight-bold is-size-6">{`My Open Requests (${(myOpenJobsList &&
                    myOpenJobsList.length) ||
                    0})`}</h1>
                  <h2 style={{ color: 'lightgrey' }} className="is-size-8">
                    Below is the list of all your requests. Taskers will be submitting offers to
                    fulfil the requests regularly so keep an eye Good luck!
                  </h2>
                </div>
              </div>
            </section> */}
            <hr className="divider" />

            <MyRequestsTab
              jobsList={myOpenJobsList}
              deleteJob={deleteJobById}
              changeActiveTab={this.changeActiveTab}
              {...this.props}
            />
          </React.Fragment>
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
