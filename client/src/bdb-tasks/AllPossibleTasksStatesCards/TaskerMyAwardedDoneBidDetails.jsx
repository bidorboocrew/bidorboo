import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  TaskSpecificExtras,
  JobCardTitle,
  SummaryStartDateAndTime,
  BidAmount,
  TaskerWillEarn,
  CenteredUserImageAndRating,
  TaskIsFulfilled,
  ArchiveTask,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

export default class TaskerMyAwardedDoneBidDetails extends RequestBaseContainer {
  render() {
    const { bid } = this.props;

    const { _jobRef: job } = bid;
    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      _ownerRef,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
      taskImages = [],
      jobTitle,
    } = job;

    const { bidderPayout, bidAmount } = bid;
    const { value: bidderPayoutAmount } = bidderPayout;
    const { value: bidValue } = bidAmount;

    const { requiresBidderReview } = _reviewRef || {
      requiresBidderReview: true,
    };

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { showMore } = this.state;

    return (
      <React.Fragment>
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
              <TaskerWillEarn earningAmount={bidderPayoutAmount} />

              {!requiresBidderReview && <ArchiveTask />}

              {requiresBidderReview && <TaskIsFulfilled />}

              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }} className="has-text-left">
                  <BidAmount bidAmount={bidValue} />
                  <div className="group">
                    <label className="label hasSelectedValue">Task Address</label>
                    <div className="control">{addressText}</div>
                  </div>
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

          <RequesterDetails
            otherUserProfileInfo={_ownerRef}
            renderActionButton={() => (
              <>
                {requiresBidderReview && (
                  <a
                    onClick={() => {
                      switchRoute(ROUTES.CLIENT.REVIEW.getBidderJobReview({ jobId }));
                    }}
                    className={`button firstButtonInCard is-primary`}
                  >
                    <span>REVIEW REQUESTER</span>
                  </a>
                )}
                {!requiresBidderReview && (
                  <a
                    onClick={() => {
                      alert('Archive not implemented yet, will take you to archieve');
                    }}
                    className={`button firstButtonInCard is-dark`}
                  >
                    PAST TASK
                  </a>
                )}
              </>
            )}
          />
        </div>
      </React.Fragment>
    );
  }
}

class RequesterDetails extends React.Component {
  render() {
    const { otherUserProfileInfo, renderActionButton } = this.props;

    if (!otherUserProfileInfo) {
      return null;
    }

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
                    <span>Requester</span>
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
