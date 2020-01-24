import React from 'react';

import { connect } from 'react-redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  AwaitingOnTasker,
  PastdueExpired,
  RequestCardTitle,
  TaskersAvailable,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class RequesterRequestSummary extends React.Component {
  render() {
    const { request, notificationFeed } = this.props;

    const { startingDateAndTime, taskImages = [], requestTitle } = request;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    let areThereAnyTaskers = request._bidsListRef && request._bidsListRef.length > 0;

    return (
      <React.Fragment>
        <div className={`card has-text-centered cardWithButton`}>
          <div className="card-content">
            <div className="content">
              <RequestCardTitle
                icon={ICON}
                title={TITLE}
                img={taskImages && taskImages.length > 0 ? taskImages[0].url : IMG}
              />
              <UserGivenTitle userGivenTitle={requestTitle} />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              {!areThereAnyTaskers && <AwaitingOnTasker />}
              {areThereAnyTaskers && (
                <TaskersAvailable numberOfAvailableTaskers={request._bidsListRef.length} />
              )}
            </div>
          </div>
          {renderFooter({ request, notificationFeed })}
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

const renderFooter = ({ request, notificationFeed }) => {
  let areThereAnyTaskers = request._bidsListRef && request._bidsListRef.length > 0;
  let doesthisRequestHaveNewBids = false;

  if (notificationFeed.requestIdsWithNewBids) {
    for (let i = 0; i < notificationFeed.requestIdsWithNewBids.length; i++) {
      if (notificationFeed.requestIdsWithNewBids[i]._id === request._id) {
        doesthisRequestHaveNewBids = true;
        break;
      }
    }
  }

  let cardButton = null;
  if (areThereAnyTaskers) {
    cardButton = (
      <div className="centeredButtonInCard">
        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.REQUESTER.dynamicReviewRequestAndBidsPage(request._id));
          }}
          className={`button is-info`}
        >
          <span>
            <span className="icon">
              <i className="fa fa-hand-paper" />
            </span>
            <span>{`View ${
              request._bidsListRef.length > 1 || request._bidsListRef.length === 0
                ? 'Offers'
                : 'Offer'
            }`}</span>
          </span>

          {doesthisRequestHaveNewBids && (
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
            switchRoute(ROUTES.CLIENT.REQUESTER.dynamicReviewRequestAndBidsPage(request._id));
          }}
          className={`button is-white`}
        >
          <span>View Request</span>
        </a>
      </div>
    );
  }

  return cardButton;
};
