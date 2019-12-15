import React from 'react';

import { connect } from 'react-redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  AwaitingOnTasker,
  PastdueExpired,
  JobCardTitle,
  TaskersAvailable,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class RequesterRequestSummary extends React.Component {
  render() {
    const { job, notificationFeed } = this.props;

    const { startingDateAndTime, isPastDue, taskImages = [], jobTitle } = job;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;

    return (
      <React.Fragment>
        <div className={`card has-text-centered cardWithButton`}>
          <div className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={jobTitle} />

              <TaskImagesCarousel taskImages={taskImages} />
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

const mapStateToProps = ({ uiReducer }) => {
  return {
    notificationFeed: uiReducer.notificationFeed,
  };
};

export default connect(mapStateToProps, null)(RequesterRequestSummary);

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
            <span>VIEW DETAILS</span>
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
            <span>{`VIEW ${
              job._bidsListRef.length > 1 || job._bidsListRef.length === 0 ? 'OFFERS' : 'OFFER'
            }`}</span>
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
          className={`button is-white`}
        >
          <span>VIEW REQUEST</span>
        </a>
      </div>
    );
  }

  return cardButton;
};
