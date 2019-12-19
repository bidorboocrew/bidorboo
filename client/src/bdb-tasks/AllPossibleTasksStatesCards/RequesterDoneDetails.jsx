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
  ArchiveTask,
  DestinationAddressValue,
  JobCardTitle,
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
    const { job } = this.props;

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      extras,
      detailedDescription,
      _reviewRef={
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
      taskImages = [],
      jobTitle,
    } = job;

    const { requesterPayment, _bidderRef } = _awardedBidRef;
    const { value: requesterPaymentAmount } = requesterPayment;

    const { phone, email } = _bidderRef;
    const { phoneNumber } = phone;

    const { emailAddress } = email;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { showMore } = this.state;

    const { requiresProposerReview } = _reviewRef;
    return (
      <>
        <div
          style={{
            boxShadow: 'none',
            borderLeft: '1px solid rgba(10,10,10,0.2)',
            borderTop: '1px solid rgba(10,10,10,0.2)',
            borderRight: '1px solid rgba(10,10,10,0.2)',
          }}
          className="card has-text-centered"
        >
          <div style={{ borderBottom: 0 }} className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={jobTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              {!requiresProposerReview && <ArchiveTask />}

              {requiresProposerReview && <TaskIsFulfilled />}
              <TaskCost cost={requesterPaymentAmount} />
              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }} className="has-text-left">
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
          <AssignedTaskerDetails
            otherUserProfileInfo={_bidderRef}
            emailAddress={emailAddress}
            phoneNumber={phoneNumber}
            renderActionButton={() => (
              <>
                {requiresProposerReview && (
                  <a
                    onClick={() => {
                      switchRoute(ROUTES.CLIENT.REVIEW.getProposerJobReview({ jobId }));
                    }}
                    className={`button firstButtonInCard is-primary`}
                  >
                    Review Tasker
                  </a>
                )}
                {!requiresProposerReview && (
                  <a
                    onClick={() => {
                      alert('Archive not implemented yet, will take you to archive');
                    }}
                    className={`button firstButtonInCard is-dark`}
                  >
                    View In Archive
                  </a>
                )}
              </>
            )}
          />
        </div>
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

    const { _id } = otherUserProfileInfo;

    return (
      <div
        style={{
          boxShadow: 'none',
          border: 'none',
          borderBottom: '1px solid rgba(10,10,10,0.2)',
        }}
        className="card cardWithButton nofixedwidth"
      >
        <div style={{ paddingTop: 0 }} className="card-content">
          <div className="content">
            <div style={{ background: 'transparent' }} className="tabs is-centered">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon is-small">
                      <i className="fas fa-user-tie" aria-hidden="true" />
                    </span>
                    <span>Tasker</span>
                  </a>
                </li>
              </ul>
            </div>
            <CenteredUserImageAndRating userDetails={otherUserProfileInfo} large isCentered />
            <br />
          </div>
        </div>
        {renderActionButton && renderActionButton()}
      </div>
    );
  }
}
