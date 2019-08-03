import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  AwaitingOnTasker,
  PastdueExpired,
  JobCardTitle,
  TaskersAvailable,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class RequesterRequestSummary extends React.Component {
  render() {
    const { job, cancelJobById, notificationFeed } = this.props;
    if (!job || !job._id || !notificationFeed || !cancelJobById) {
      return <div>RequesterRequestSummary is missing properties</div>;
    }

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      isHappeningSoon,
      isHappeningToday,
      isPastDue,
    } = job;
    if (
      !jobId ||
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>RequesterRequestSummary is missing properties</div>;
    }

    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>RequesterRequestSummary is missing properties</div>;
    }

    let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;

    return (
      <React.Fragment>
        <div className={`card has-text-centered cardWithButton`}>
          <div className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} />

              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />
              {isPastDue && <PastdueExpired />}

              {!isPastDue && (
                <React.Fragment>
                  {!areThereAnyBidders && <AwaitingOnTasker />}
                  {areThereAnyBidders && (
                    <TaskersAvailable numberOfAvailableTaskers={job._bidsListRef.length} />
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
          {renderFooter({ job, notificationFeed, isPastDue })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequesterRequestSummary);

const renderFooter = ({ job, notificationFeed, isPastDue }) => {
  let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;
  let doesthisJobHaveNewBids = false;

  if (!isPastDue && notificationFeed.jobIdsWithNewBids) {
    for (let i = 0; i < notificationFeed.jobIdsWithNewBids.length; i++) {
      if (notificationFeed.jobIdsWithNewBids[i]._id === job._id) {
        doesthisJobHaveNewBids = true;
        break;
      }
    }
  }

  let cardButton = null;
  if (isPastDue) {
    cardButton = (
      <div className="centeredButtonInCard">
        <a className={`button is-danger`}>
          <span>
            <span className="icon">
              <i className="fa fa-hand-paper" />
            </span>
            <span>{`Delete Task`}</span>
          </span>
        </a>
      </div>
    );
  } else if (areThereAnyBidders) {
    cardButton = (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(job._id));
          }}
          className={`button is-info`}
        >
          <span>
            <span className="icon">
              <i className="fa fa-hand-paper" />
            </span>
            <span>{`View ${job._bidsListRef.length > 1 ? 'Offers' : 'Offer'}`}</span>
          </span>

          {doesthisJobHaveNewBids && (
            <div
              style={{ position: 'absolute', top: -5, right: 0, fontSize: 10 }}
              className="has-text-danger"
            >
              <i className="fas fa-circle" />
            </div>
          )}
        </a>
      </div>
    );
  } else {
    cardButton = (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(job._id));
          }}
          className={`button`}
        >
          <span>View Task</span>
        </a>
      </div>
    );
  }

  return cardButton;
};
