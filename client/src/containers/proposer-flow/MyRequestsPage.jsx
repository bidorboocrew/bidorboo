import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';

import moment from 'moment';

import { Spinner } from '../../components/Spinner';
import TASKS_DEFINITIONS from '../../bdb-tasks/tasksDefinitions';
import watermark from '../../assets/images/watermark.png';

import {
  getAllMyOpenJobs,
  cancelJobById,
  getAllMyAwardedJobs,
  getAllMyRequests,
} from '../../app-state/actions/jobActions';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

class MyRequestsPage extends React.Component {
  constructor(props) {
    super(props);
    if (props.match && props.match.params && props.match.params.templateId) {
      this.freshPostTemplateId = props.match.params.templateId;
    }

    if (props.match && props.match.params && props.match.params.createdAt) {
      this.freshPostedCreatedAt = props.match.params.createdAt;
    }

    if (props.match && props.match.params && props.match.params.jobId) {
      this.freshJobId = props.match.params.jobId;
    }
  }
  componentDidMount() {
    this.props.getAllMyRequests();
  }

  render() {
    const { allMyRequests, isLoading } = this.props;

    // determine whether to show the new posted job thank you banner
    let isTaskMoreThan1MinuteOld = false;
    const isThereFreshlyPostedJob = !!(
      this.freshPostedCreatedAt &&
      this.freshPostTemplateId &&
      this.freshJobId
    );
    if (isThereFreshlyPostedJob) {
      let aMinuteAgo = moment().subtract(30, 's');
      isTaskMoreThan1MinuteOld = moment(this.freshPostedCreatedAt).isBefore(aMinuteAgo);
    }
    let thankYouNote = null;

    const areThereAnyJobsToView = allMyRequests && allMyRequests.length > 0;
    let myRequestsSummaryCards = areThereAnyJobsToView
      ? allMyRequests.map((job) => {
          if (job._id === this.freshJobId) {
            thankYouNote = <ThankYou job={job} />;
          }
          return (
            <div key={job._id} className="column is-narrow isforCards">
              {getMeTheRightRequestCard({
                job,
                isSummaryView: true,
                pointOfView: POINT_OF_VIEW.REQUESTER,
              })}
            </div>
          );
        })
      : null;

    const shouldShowTheThankyouNote = true;
    // thankYouNote && !isTaskMoreThan1MinuteOld && isThereFreshlyPostedJob ;

    return (
      <div>
        {/* <FloatingAddNewRequestButton /> */}
        <Spinner renderLabel={'Getting all your requests'} isLoading={isLoading} size={'large'} />
        {!isLoading && (
          <React.Fragment>
            <div className="columns is-multiline is-centered is-mobile">
              {shouldShowTheThankyouNote && <div>{thankYouNote}</div>}
            </div>
            <div className="columns is-multiline is-centered is-mobile">
              {myRequestsSummaryCards}
            </div>
          </React.Fragment>
        )}

        {!isLoading && !areThereAnyJobsToView && <EmptyStateComponent />}
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    myOpenJobsList: jobsReducer.myOpenJobsList,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    allMyRequests: jobsReducer.allMyRequests,
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
    getAllMyRequests: bindActionCreators(getAllMyRequests, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyRequestsPage);

const FloatingAddNewRequestButton = () => {
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        switchRoute(ROUTES.CLIENT.PROPOSER.root);
      }}
      className="button is-success bdbFloatingButtonText"
    >
      +
    </a>
  );
};

const EmptyStateComponent = () => (
  <div className="has-text-centered">
    <div style={{ maxWidth: 'unset' }} className="card">
      <div className="card-content VerticalAligner ">
        <div className="content has-text-centered ">
          <div className="is-size-5">You have not requested any services yet</div>
          <br />
          <a
            className="button is-success "
            onClick={(e) => {
              e.preventDefault();
              switchRoute(ROUTES.CLIENT.PROPOSER.root);
            }}
          >
            New Request
          </a>
        </div>
      </div>
    </div>
  </div>
);

const ThankYou = ({ job }) => {
  const [showModal, setShowModal] = useState(true);

  const taskDefinition = TASKS_DEFINITIONS[job.templateId];
  return ReactDOM.createPortal(
    <div className={`modal ${showModal ? 'is-active' : ''}`}>
      <div onClick={() => setShowModal(false)} className="modal-background" />
      <div className="modal-content has-text-centered">
        {taskDefinition.renderThankYouCard(setShowModal)}
      </div>
    </div>,
    document.querySelector('#bidorboo-root-modals'),
  );
};
