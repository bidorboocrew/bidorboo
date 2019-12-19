import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goBackToPreviousRoute, switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { getArchivedBidDetailsForTasker } from '../../app-state/actions/bidsActions';
import {
  CountDownComponent,
  TaskerWillEarn,
  TaskSpecificExtras,
  ArchiveTask,
  JobCardTitle,
  SummaryStartDateAndTime,
  TaskImagesCarousel,
  UserGivenTitle,
  ReviewComments,
} from '../../containers/commonComponents';
import { Spinner } from '../../components/Spinner.jsx';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import RequestBaseContainer from './RequestBaseContainer';

class TaskerArchiveDetails extends RequestBaseContainer {
  componentDidMount() {
    const { bid, getArchivedBidDetailsForTasker } = this.props;
    getArchivedBidDetailsForTasker(bid._id);
  }
  render() {
    const { selectedArchivedBid } = this.props;
    if (!selectedArchivedBid || !selectedArchivedBid._id) {
      return <Spinner renderLabel={'Getting request details'} isLoading={true} size={'large'} />;
    }

    const {
      startingDateAndTime,
      extras,
      detailedDescription,
      taskImages = [],
      jobTitle,
      completionDate,
    } = selectedArchivedBid._jobRef;
    console.log(selectedArchivedBid);
    const { bidderPayout } = selectedArchivedBid;
    const { value: bidderPayoutAmount } = bidderPayout;

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${selectedArchivedBid._jobRef.templateId}`];

    const { showMore } = this.state;

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
                date={completionDate}
                renderHelpComponent={() => (
                  <CountDownComponent startingDate={startingDateAndTime} />
                )}
              />
              <ArchiveTask />

              <TaskerWillEarn earningAmount={bidderPayoutAmount} />
              <Collapse isOpened={showMore}>
                <div style={{ maxWidth: 300, margin: 'auto' }} className="has-text-left">
                  {/*
                    we intentionally do not want to share address

                   <DisplayLabelValue labelText="Address" labelValue={addressText} />
                  {extras && extras.destinationText && (
                    <DestinationAddressValue
                      destionationAddress={extras.destinationText}
                    ></DestinationAddressValue>
                  )} */}
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
          <AssignedTaskerDetails {...this.props} />
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ bidsReducer }) => {
  return {
    isLoading: !bidsReducer.selectedArchivedBid,
    selectedArchivedBid: bidsReducer.selectedArchivedBid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArchivedBidDetailsForTasker: bindActionCreators(getArchivedBidDetailsForTasker, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerArchiveDetails);

class AssignedTaskerDetails extends React.Component {
  render() {
    const { selectedArchivedBid } = this.props;
    const {
      _awardedBidRef,
      _ownerRef,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
    } = selectedArchivedBid._jobRef;

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
                    <span>Your Review</span>
                  </a>
                </li>
              </ul>
            </div>
            {_reviewRef && _reviewRef.bidderReview ? (
              <ReviewComments
                commenterDisplayName={_awardedBidRef._bidderRef.displayName}
                commenterId={_awardedBidRef._bidderRef._id}
                commenterProfilePicUrl={_awardedBidRef._bidderRef.profileImage.url}
                comment={_reviewRef.bidderReview.personalComment}
                ratingCategories={_reviewRef.bidderReview.ratingCategories}
              ></ReviewComments>
            ) : (
              <a
                onClick={() => {
                  switchRoute(
                    ROUTES.CLIENT.REVIEW.getBidderJobReview({ bidId: _awardedBidRef._id }),
                  );
                }}
                className={`button firstButtonInCard is-primary`}
              >
                Review Requester
              </a>
            )}

            <div style={{ background: 'transparent' }} className="tabs is-centered">
              <ul style={{ marginLeft: 0 }}>
                <li className="is-active">
                  <a>
                    <span className="icon is-small">
                      <i className="fas fa-user-tie" aria-hidden="true" />
                    </span>
                    <span>Requester's Review</span>
                  </a>
                </li>
              </ul>
            </div>
            {_reviewRef && _reviewRef.proposerReview ? (
              <ReviewComments
                commenterDisplayName={_ownerRef.displayName}
                commenterId={_ownerRef._id}
                commenterProfilePicUrl={_ownerRef.profileImage.url}
                comment={_reviewRef.proposerReview.personalComment}
                ratingCategories={_reviewRef.proposerReview.ratingCategories}
              ></ReviewComments>
            ) : (
              <div className="help">*Waiting on Requester to submit their review.</div>
            )}

            <br></br>
            <hr className="dropdown-divider" />
            <br></br>
            <button onClick={goBackToPreviousRoute} className="button is-outline">
              <span className="icon">
                <i className="far fa-arrow-alt-circle-left" />
              </span>
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
