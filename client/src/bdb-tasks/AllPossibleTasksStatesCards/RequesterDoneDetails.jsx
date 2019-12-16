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
      _reviewRef,
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
    const { requiresProposerReview } = _reviewRef || {
      requiresProposerReview: true,
    };
    return (
      <>
        <div style={{ height: 'auto' }} className="card cardWithButton nofixedwidth">
          <div className="card-content">
            <div className="content has-text-centered">
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
        </div>

        <br />
        <div style={{ background: 'transparent', marginBottom: 0 }} className="tabs is-centered">
          <ul>
            <li className="is-active">
              <a>
                <span className="icon is-small">
                  <i className="fas fa-user-tie" aria-hidden="true" />
                </span>
                <span>Your Tasker</span>
              </a>
            </li>
          </ul>
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
      <div className="card cardWithButton nofixedwidth">
        <div className="card-content">
          <div className="content ">
            <div className="has-text-centered">
              <figure
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(_id));
                }}
                style={{ margin: 'auto', width: 90 }}
                className="image"
              >
                <img
                  style={{
                    borderRadius: '100%',
                    cursor: 'pointer',
                    boxShadow:
                      '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)',
                  }}
                  src={otherUserProfileInfo.profileImage.url}
                />
              </figure>
              <div style={{ marginBottom: 0 }} className={`title`}>
                <span>{otherUserProfileInfo.displayName}</span>
              </div>
              <br />
            </div>
          </div>
        </div>
        {renderActionButton && renderActionButton()}
      </div>
    );
  }
}
