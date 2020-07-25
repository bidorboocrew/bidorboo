import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import TaskerVerificationBanner from '../../containers/tasker-flow/TaskerVerificationBanner.jsx';
import {
  CountDownComponent,
  StartDateAndTime,
  SummaryStartDateAndTime,
  CenteredUserImageAndRating,
  LocationLabelAndValue,
  DestinationAddressValue,
  CardTitleAndActionsInfo,
  TaskSpecificExtras,
  RequestCardTitle,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import PostYourBid from '../../components/forms/PostYourBid';

import { getUserExistingBid, didUserAlreadyView } from '../../containers/commonUtils';

export default class TaskerBidOnTaskDetails extends React.Component {
  render() {
    const { request, otherArgs } = this.props;
    const { showLoginDialog, isLoggedIn } = otherArgs;

    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      detailedDescription,
      location,
      extras,
      templateId,
      requestTitle,
      taskImages = [],
      avgBid,
    } = request;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${templateId}`];

    const { coordinates } = location;

    const { submitBid, renderTaskerBidInfo, userDetails } = otherArgs;
    const { _id: currentUserId } = userDetails;

    const userAlreadyView = didUserAlreadyView(request, currentUserId);
    const { userAlreadyBid } = getUserExistingBid(request, currentUserId);

    const taskerCanBid = userDetails && userDetails.canBid;

    return (
      <>
        <section style={{ marginBottom: 6 }} className="card cardWithButton nofixedwidth">
          <div className="card-content">
            <div className="content subtitle">
              Review the task details then
              <span>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    const elmnt = document.querySelector('#bob-bid-on-request');
                    elmnt && elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
                  }}
                  className="is-text"
                >
                  {` enter your Bid`}
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
              <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={requestTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={startingDateAndTime}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
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
                <StartDateAndTime date={startingDateAndTime} />
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
              <br />
              <div className="group">
                {/* <label className="label hasSelectedValue">Task Info</label> */}
                <CardTitleAndActionsInfo
                  userAlreadyBid={userAlreadyBid}
                  requestState={state}
                  templateId={templateId}
                  bidsList={_bidsListRef}
                  userAlreadyView={userAlreadyView}
                  request={request}
                />
              </div>

              <br />
              {userAlreadyBid && (
                <React.Fragment>{renderTaskerBidInfo && renderTaskerBidInfo()}</React.Fragment>
              )}
              {!userAlreadyBid && (
                <PostYourBid
                  taskerCanBid={taskerCanBid}
                  showLoginDialog={showLoginDialog}
                  isLoggedIn={isLoggedIn}
                  avgBid={avgBid === '--' ? 0 : avgBid}
                  onSubmit={(values) => {
                    submitBid({
                      recaptchaField: values.recaptchaField,
                      request,
                      bidAmount: values.bidAmountField,
                    });
                  }}
                  onCancel={() => {
                    // updateBooedBy(request);
                    switchRoute(ROUTES.CLIENT.TASKER.root);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <br></br>
        <TaskerVerificationBanner></TaskerVerificationBanner>
      </>
    );
  }
}
