import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  TaskSpecificExtras,
  RequestCardTitle,
  SummaryStartDateAndTime,
  BidAmount,
  TaskerWillEarn,
  CenteredUserImageAndRating,
  TaskIsFulfilled,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';
import { REQUEST_STATES } from '../index';
import { updateRequestState } from '../../app-state/actions/requestActions';

class TaskerBidDoneDetails extends RequestBaseContainer {
  componentDidMount() {
    const { updateRequestState, request } = this.props;
    updateRequestState(request._id, REQUEST_STATES.DONE_SEEN);
  }

  render() {
    const { bid } = this.props;

    const { _requestRef: request } = bid;
    const {
      startingDateAndTime,
      addressText,
      extras,
      detailedDescription,
      _ownerRef,
      taskImages = [],
      requestTitle,
      _reviewRef,
      completionDate,
    } = request;

    const { taskerPayout, bidAmount, _id: bidId } = bid;
    const { value: bidValue } = bidAmount;

    const { value: taskerPayoutAmount } = taskerPayout;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${request.templateId}`];

    const { showMore } = this.state;
    const requiresTaskerReview = _reviewRef.requiresTaskerReview;

    return (
      <React.Fragment>
        <div className="card has-text-centered">
          <div style={{ borderBottom: 0 }} className="card-content">
            <div className="content">
              <RequestCardTitle icon={ICON} title={TITLE} img={IMG} />
              <UserGivenTitle userGivenTitle={requestTitle} />

              <TaskImagesCarousel taskImages={taskImages} isLarge />
              <SummaryStartDateAndTime
                date={completionDate}
                renderHelpComponent={() => <CountDownComponent startingDate={completionDate} />}
              />

              <TaskIsFulfilled
                renderHelp={() => {
                  if (requiresTaskerReview) {
                    return <div className="help">Waiting on your review</div>;
                  }
                  if (!requiresTaskerReview) {
                    return <div className="help">Waiting on Requester review</div>;
                  }
                }}
              />
              <BidAmount bidAmount={bidValue} />

              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }}>
                  <TaskerWillEarn earningAmount={taskerPayoutAmount} />
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
        </div>
        <RequesterDetails otherUserProfileInfo={_ownerRef} bidId={bidId} />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    updateRequestState: bindActionCreators(updateRequestState, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(TaskerBidDoneDetails);

class RequesterDetails extends React.Component {
  render() {
    const { otherUserProfileInfo, bidId } = this.props;

    if (!otherUserProfileInfo) {
      return null;
    }

    return (
      <>
        <div
          style={{ marginTop: '1rem', background: 'transparent' }}
          className="tabs is-centered is-medium"
        >
          <ul style={{ marginLeft: 0 }}>
            <li className="is-active color-change-2x">
              <a>
                <span>Next Steps</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="card cardWithButton nofixedwidth">
          <div style={{ paddingTop: 0 }} className="card-content">
            <div className="content has-text-centered">
              <CenteredUserImageAndRating userDetails={otherUserProfileInfo} large isCentered />
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.REVIEW.getTaskerRequestReview({ bidId }));
                }}
                className={`button is-primary`}
              >
                <span>Review Requester</span>
              </a>
              <br />
            </div>
          </div>
        </div>
      </>
    );
  }
}
