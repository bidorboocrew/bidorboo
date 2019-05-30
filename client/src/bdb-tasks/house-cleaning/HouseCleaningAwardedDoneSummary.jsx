import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion, cancelJobById } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
  UserImageAndRating,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';
import RequestBaseContainer from '../RequestBaseContainer';

class HouseCleaningAwardedSummary extends RequestBaseContainer {
  render() {
    const { job, cancelJobById } = this.props;
    if (!job || !job._id || !cancelJobById) {
      return <div>HouseCleaningAwardedSummary is missing properties</div>;
    }

    const {
      _id: jobId,
      startingDateAndTime,
      addressText,
      displayStatus,
      isHappeningSoon,
      isHappeningToday,
      isPastDue,
      _awardedBidRef,
      jobCompletion = {
        proposerConfirmed: false,
        bidderConfirmed: false,
        bidderDisputed: false,
        proposerDisputed: false,
      },
    } = job;
    if (
      !jobId ||
      !_awardedBidRef ||
      !startingDateAndTime ||
      !addressText ||
      !displayStatus ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>HouseCleaningAwardedSummary is missing properties</div>;
    }

    const { bidAmount, _bidderRef } = _awardedBidRef;
    if (!bidAmount || !_bidderRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    // xxxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { TITLE } = HOUSE_CLEANING_DEF;
    if (!TITLE) {
      return <div>HouseCleaningAwardedSummary is missing properties</div>;
    }

    return (
      <div className="card limitWidthOfCard">
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                <span className="icon">
                  <i className="fas fa-home" />
                </span>
                <span style={{ marginLeft: 4 }}>{TITLE}</span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: ' whitesmoke',
                border: 'none',
                display: 'block',
                height: 2,
                margin: '0.5rem 0',
              }}
              className="navbar-divider"
            />

            <div className="field">
              <label className="label">Request Status</label>
              <div className="control has-text-info">Done !</div>
              <div className="help">* Congratulations. This was a success!</div>{' '}
            </div>
            <div className="field">
              <label className="label">Task Cost</label>
              <div className="control has-text-info">{`${bidValue -
                Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
              <div className="help">* Paid out to Tasker.</div>
            </div>
            <StartDateAndTime date={startingDateAndTime} />
            <DisplayShortAddress addressText={addressText} />
          </div>
        </div>

        <div style={{ padding: '0.5rem' }}>
          <hr className="divider isTight" />
        </div>
        <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
          <a
            onClick={() => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId));
            }}
            className={`button is-fullwidth is-outlined is-info`}
          >
            View In Archive
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HouseCleaningAwardedSummary);
