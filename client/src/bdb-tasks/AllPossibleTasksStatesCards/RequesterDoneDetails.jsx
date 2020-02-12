import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import {
  CountDownComponent,
  DisplayLabelValue,
  TaskCost,
  TaskSpecificExtras,
  DestinationAddressValue,
  RequestCardTitle,
  SummaryStartDateAndTime,
  TaskIsFulfilled,
  CenteredUserImageAndRating,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

export default class RequesterDoneDetails extends RequestBaseContainer {
  render() {
    const { request } = this.props;

    const {
      _id: requestId,
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      extras,
      detailedDescription,
      _reviewRef,
      taskImages = [],
      requestTitle,
      completionDate
    } = request;

    const { requesterPayment, _taskerRef } = _awardedBidRef;
    const { value: requesterPaymentAmount } = requesterPayment;

    const { phone, email } = _taskerRef;
    const { phoneNumber } = phone;

    const { emailAddress } = email;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { showMore } = this.state;

    const requiresRequesterReview = _reviewRef.requiresRequesterReview;
    return (
      <>
        <div className="card has-text-centered">
          <div style={{ borderBottom: 0 }} className="card-content">
            <div className="content">
              <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={requestTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={completionDate}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={completionDate} />
                )}
              />

              <TaskIsFulfilled
                renderHelp={() => {
                  if (requiresRequesterReview) {
                    return <div className="help">Waiting on your review</div>;
                  }
                  if (!requiresRequesterReview) {
                    return <div className="help">Waiting on Tasker's review</div>;
                  }
                }}
              />
              <TaskCost cost={requesterPaymentAmount} />
              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }}>
                  <DisplayLabelValue labelText="Address" labelValue={addressText} />
                  {extras && extras.destinationText && (
                    <DestinationAddressValue
                      destionationAddress={extras.destinationText}
                    ></DestinationAddressValue>
                  )}
                  <TaskSpecificExtras templateId={ID} extras={extras} />
                  <div className="group">
                    <label className="label hasSelectedValue">Detailed Description</label>
                    <TextareaAutosize
                      value={detailedDescription}
                      className="textarea is-marginless is-paddingless control"
                      style={{
                        resize: 'none',
                        border: 'none',
                      }}
                      readOnly
                    />
                  </div>
                </div>
              </Collapse>
              <div>
                {!showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show more details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-down" />
                    </span>
                  </a>
                )}
                {showMore && (
                  <a onClick={this.toggleShowMore} className="button is-small">
                    <span style={{ marginRight: 4 }}>show less details</span>
                    <span className="icon">
                      <i className="fas fa-angle-double-up" />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <AssignedTaskerDetails
          otherUserProfileInfo={_taskerRef}
          emailAddress={emailAddress}
          phoneNumber={phoneNumber}
          renderActionButton={() => (
            <>
              {requiresRequesterReview && (
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.REVIEW.getRequesterRequestReview({ requestId }));
                  }}
                  className={`button is-primary`}
                >
                  <span className="icon">
                    <i className="fas fa-user-check" />
                  </span>
                  <span>Review Tasker</span>
                </a>
              )}
              {!requiresRequesterReview && (
                <div style={{ textAlign: 'center' }}>
                  <ul className="has-text-left">
                    <li>You have submitted your review successfully</li>
                    <li>We've contacted the Tasker to submit their review</li>
                    <li>
                      After that, this task will be archived under (Past Requests) for your
                      reference
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        />
      </>
    );
  }
}

class AssignedTaskerDetails extends React.Component {
  render() {
    const { otherUserProfileInfo, renderActionButton } = this.props;

    if (!otherUserProfileInfo) {
      return null;
    }

    return (
      <>
        <br></br>
        <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
          <ul style={{ marginLeft: 0 }}>
            <li className="is-active color-change-2x">
              <a>
                <span>Next Step</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="card cardWithButton nofixedwidth">
          <div className="card-content">
            <div className="content has-text-centered">
              <CenteredUserImageAndRating userDetails={otherUserProfileInfo} large isCentered />

              {renderActionButton && renderActionButton()}
            </div>
          </div>
        </div>
      </>
    );
  }
}
