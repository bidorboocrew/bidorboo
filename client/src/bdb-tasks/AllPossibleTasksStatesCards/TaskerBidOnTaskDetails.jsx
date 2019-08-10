import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';

import {
  CountDownComponent,
  SummaryStartDateAndTime,
  CenteredUserImageAndRating,
  LocationLabelAndValue,
  CardTitleAndActionsInfo,
  TaskSpecificExtras,
  JobCardTitle,
  TaskImagesCarousel,
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
      taskImages = [],
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
      <>
        <section style={{ marginBottom: 6 }} className="card cardWithButton nofixedwidth">
          <div className="card-content">
            <div className="content subtitle">
              Review The Task Details Then
              <span>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    const elmnt = document.getElementById('bob-bid-on-request');
                    elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
                  }}
                  className="is-text"
                >
                  {` Place your Bid`}
                </a>
              </span>
            </div>
          </div>
        </section>

        <div
          style={{ height: 'auto ' }}
          className="card cardWithButton nofixedwidth has-text-centered"
        >
          <div className="card-content">
            <div className="content">
              <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
                )}
              />

              <div className="has-text-left">
                <div className="group">
                  <label className="label hasSelectedValue">Requester</label>
                  <CenteredUserImageAndRating
                    clipUserName
                    userDetails={_ownerRef}
                    isCentered={false}
                  />
                </div>
                <LocationLabelAndValue location={coordinates} />

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

              <br />
              <br />
              {userAlreadyBid && (
                <React.Fragment>{renderTaskerBidInfo && renderTaskerBidInfo()}</React.Fragment>
              )}
              {!userAlreadyBid && (
                <PostYourBid
                  avgBid={avgBid}
                  onSubmit={(values) => {
                    submitBid({
                      job,
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
      </>
    );
  }
}
