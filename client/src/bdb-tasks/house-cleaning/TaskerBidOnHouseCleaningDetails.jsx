import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import {
  CountDownComponent,
  UserImageAndRating,
  AvgBidDisplayLabelAndValue,
  StartDateAndTime,
  LocationLabelAndValue,
  CardTitleAndActionsInfo,
  EffortLevel,
} from '../../containers/commonComponents';
import PostYourBid from '../../components/forms/PostYourBid';

import {
  getUserExistingBid,
  didUserAlreadyView,
  findAvgBidInBidList,
} from '../../containers/commonUtils';

export default class TaskerBidOnHouseCleaningDetails extends React.Component {
  render() {
    const { job, otherArgs } = this.props;
    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      detailedDescription,
      location,
      extras,
      fromTemplateId,
    } = job;

    const { submitBid, renderTaskerBidInfo, userDetails } = otherArgs;

    const currentUserId = userDetails && userDetails._id ? userDetails._id : '';
    const userAlreadyView = didUserAlreadyView(job, currentUserId);
    const { userAlreadyBid } = getUserExistingBid(job, currentUserId);

    let avgBid = 0;
    if (job && job._bidsListRef && job._bidsListRef.length > 0) {
      avgBid = findAvgBidInBidList(job._bidsListRef);
    }
    return (
      <div style={{ height: 'auto ' }} className="card">
        <div className="card-content">
          <div className="content">
            <CardTitleAndActionsInfo
              userAlreadyBid={userAlreadyBid}
              jobState={state}
              fromTemplateId={fromTemplateId}
              bidsList={_bidsListRef}
              userAlreadyView={userAlreadyView}
            />
            <hr className="divider isTight" />
            <div className="field">
              <label className="label">Requester:</label>
              <UserImageAndRating userDetails={_ownerRef} />
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />

            <LocationLabelAndValue location={location.coordinates} />

            <EffortLevel extras={extras} />
            <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />

            <div className="field">
              <label className="label">Detailed Description</label>

              <TextareaAutosize
                value={detailedDescription}
                className="textarea is-marginless is-paddingless is-size-6"
                style={{
                  resize: 'none',
                  border: 'none',
                  color: '#4a4a4a',
                  fontSize: '1rem',
                }}
                readOnly
              />
            </div>

            {userAlreadyBid && (
              <React.Fragment>
                <hr className="divider isTight" />
                {renderTaskerBidInfo && renderTaskerBidInfo()}
              </React.Fragment>
            )}
            {!userAlreadyBid && (
              <PostYourBid
                avgBid={avgBid}
                onSubmit={(values) => {
                  submitBid({
                    jobId: job._id,
                    bidAmount: values.bidAmountField,
                    recaptchaField: values.recaptchaField,
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
