import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goBackToPreviousRoute, switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { getArchivedTaskDetailsForRequester } from '../../app-state/actions/requestActions';
import {
  CountDownComponent,
  DisplayLabelValue,
  TaskCost,
  TaskSpecificExtras,
  ArchiveTask,
  DestinationAddressValue,
  RequestCardTitle,
  SummaryStartDateAndTime,
  TaskImagesCarousel,
  UserGivenTitle,
  ReviewComments,
} from '../../containers/commonComponents';
import { Spinner } from '../../components/Spinner.jsx';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class RequesterArchiveDetails extends RequestBaseContainer {
  componentDidMount() {
    const { request, getArchivedTaskDetailsForRequester } = this.props;
    getArchivedTaskDetailsForRequester(request._id);
  }
  render() {
    const { selectedArchivedRequest } = this.props;

    if (!selectedArchivedRequest || !selectedArchivedRequest._id) {
      return <Spinner renderLabel={'Getting request details'} isLoading size={'large'} />;
    }

    const {
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      extras,
      detailedDescription,
      taskImages = [],
      requestTitle,
      completionDate,
    } = selectedArchivedRequest;

    const { requesterPayment, _taskerRef } = _awardedBidRef;
    const { value: requesterPaymentAmount } = requesterPayment;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${selectedArchivedRequest.templateId}`];

    const { showMore } = this.state;

    return (
      <>
        <div
          style={{
            boxShadow: 'none',
            border: '1px solid rgb(219,219,219)',
          }}
          className="card has-text-centered"
        >
          <div style={{ borderBottom: 0 }} className="card-content">
            <div className="content">
              <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={requestTitle} />
              m
              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={completionDate}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              <ArchiveTask />
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
          <AssignedTaskerDetails otherUserProfileInfo={_taskerRef} {...this.props} />
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ requestsReducer }) => {
  return {
    isLoading: !requestsReducer.selectedArchivedRequest,
    selectedArchivedRequest: requestsReducer.selectedArchivedRequest,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getArchivedTaskDetailsForRequester: bindActionCreators(
      getArchivedTaskDetailsForRequester,
      dispatch,
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequesterArchiveDetails);

class AssignedTaskerDetails extends React.Component {
  render() {
    const { otherUserProfileInfo, selectedArchivedRequest } = this.props;
    const { _awardedBidRef, _id: requestId, _ownerRef, _reviewRef } = selectedArchivedRequest;

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
            <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span>Your Review</span>
                  </a>
                </li>
              </ul>
            </div>
            {_reviewRef && _reviewRef.requesterReview ? (
              <ReviewComments
                commenterDisplayName={_ownerRef.displayName}
                commenterId={_ownerRef._id}
                commenterProfilePicUrl={_ownerRef.profileImage.url}
                comment={_reviewRef.requesterReview.personalComment}
                ratingCategories={_reviewRef.requesterReview.ratingCategories}
              ></ReviewComments>
            ) : (
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
            <div style={{ background: 'transparent' }} className="tabs is-centered is-medium">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon is-small">
                      <i className="fas fa-user-tie" aria-hidden="true" />
                    </span>
                    <span>Tasker's Review</span>
                  </a>
                </li>
              </ul>
            </div>
            {_reviewRef && _reviewRef.taskerReview ? (
              <ReviewComments
                commenterDisplayName={_awardedBidRef._taskerRef.displayName}
                commenterId={_awardedBidRef._taskerRef._id}
                commenterProfilePicUrl={_awardedBidRef._taskerRef.profileImage.url}
                comment={_reviewRef.taskerReview.personalComment}
                ratingCategories={_reviewRef.taskerReview.ratingCategories}
              ></ReviewComments>
            ) : (
              <div className="help">*Waiting on tasker to submit their review.</div>
            )}

            <br></br>
            {/* <hr className="dropdown-divider" />
            <br></br> */}
            {/* <button onClick={goBackToPreviousRoute} className="button is-outline">
              <span className="icon">
                <i className="far fa-arrow-alt-circle-left" />
              </span>
              <span>Go Back</span>
            </button> */}
          </div>
        </div>
      </div>
    );
  }
}
