import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';

import {
  CountDownComponent,
  AvgBidDisplayLabelAndValue,
  SummaryStartDateAndTime,
  CenteredUserImageAndRating,
  LocationLabelAndValue,
  CardTitleAndActionsInfo,
  TaskSpecificExtras,
  JobCardTitle,
} from '../../containers/commonComponents';
import PostYourBid from '../../components/forms/PostYourBid';

import {
  getUserExistingBid,
  didUserAlreadyView,
  findAvgBidInBidList,
} from '../../containers/commonUtils';

export default class TaskerBidOnTaskDetails extends React.Component {
  render() {
    const { job, otherArgs } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }
    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      detailedDescription,
      location,
      extras,
      templateId,
    } = job;
    if (
      !startingDateAndTime ||
      !_ownerRef ||
      !state ||
      !detailedDescription ||
      !location ||
      !extras ||
      !templateId
    ) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    const { coordinates } = location;
    if (!coordinates) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    const { submitBid, renderTaskerBidInfo, userDetails } = otherArgs;
    if (!submitBid || !userDetails) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }
    const { _id: currentUserId } = userDetails;
    if (!currentUserId) {
      return switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    const userAlreadyView = didUserAlreadyView(job, currentUserId);
    const { userAlreadyBid } = getUserExistingBid(job, currentUserId);

    let avgBid = 0;
    if (job && job._bidsListRef && job._bidsListRef.length > 0) {
      avgBid = findAvgBidInBidList(job._bidsListRef);
    }
    return (
      <div
        style={{ height: 'auto ' }}
        className="card cardWithButton nofixedwidth has-text-centered"
      >
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <div className="group">
              <label className="label hasSelectedValue">Requester</label>
              <CenteredUserImageAndRating clipUserName userDetails={_ownerRef} />
            </div>
            <LocationLabelAndValue location={coordinates} />

            <TaskSpecificExtras templateId={ID} extras={extras} />
            <div className="group">
              <label className="label hasSelectedValue">Detailed Description</label>
              <span className="is-size-7">
                <TextareaAutosize
                  value={detailedDescription}
                  className="textarea is-marginless is-paddingless is-size-6 has-text-centered "
                  style={{
                    resize: 'none',
                    border: 'none',
                    color: '#4a4a4a',
                    fontSize: '1rem',
                  }}
                  readOnly
                />
              </span>
            </div>

            <div className="group">
              <label className="label hasSelectedValue">Task Info</label>
              <CardTitleAndActionsInfo
                userAlreadyBid={userAlreadyBid}
                jobState={state}
                templateId={templateId}
                bidsList={_bidsListRef}
                userAlreadyView={userAlreadyView}
                job={job}
              />
            </div>
            {/* <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} /> */}

            <br />
            {userAlreadyBid && (
              <React.Fragment>{renderTaskerBidInfo && renderTaskerBidInfo()}</React.Fragment>
            )}
            {!userAlreadyBid && (
              <PostYourBid
                avgBid={avgBid}
                onSubmit={(values) => {
                  submitBid({
                    jobId: job._id,
                    bidAmount: values.bidAmountField,
                  });
                }}
                onCancel={() => {
                  // updateBooedBy(job);
                  switchRoute(ROUTES.CLIENT.BIDDER.root);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
