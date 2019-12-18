import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  SummaryStartDateAndTime,
  JobCardTitle,
  CancelledBy,
  TaskImagesCarousel,
  UserGivenTitle,
} from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import { updateJobState } from '../../app-state/actions/jobActions';
import { REQUEST_STATES } from '../index';

class RequesterCanceledByTaskerDetails extends React.Component {
  componentDidMount() {
    const { updateJobState, job } = this.props;
    updateJobState(job._id, REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER_SEEN);
  }
  render() {
    const { job } = this.props;

    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { startingDateAndTime, _awardedBidRef, taskImages = [], jobTitle } = job;

    const { _bidderRef, requesterPayment } = _awardedBidRef;

    const { displayName: taskerDisplayName } = _bidderRef;

    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];

    const { value: requesterPaymentAmount } = requesterPayment;

    return (
      <div
        style={{ border: '1px solid #ee2a36' }}
        className="card has-text-centered cardWithButton nofixedwidth"
      >
        <div className="card-content">
          <div className="content">
            <JobCardTitle icon={ICON} title={TITLE} img={IMG} />
            <UserGivenTitle userGivenTitle={jobTitle} />

            <TaskImagesCarousel taskImages={taskImages} isLarge />
            <SummaryStartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => <CountDownComponent startingDate={startingDateAndTime} />}
            />

            <CancelledBy name={`Tasker ${taskerDisplayName}`} />
            <div className="group has-text-left">
              <label className="label">What you need to know:</label>
              <ul>
                <li>
                  <strong>
                    100% refund for the amount of {` $${requesterPaymentAmount}`} was issued back to
                    your card.
                  </strong>
                </li>
                <li>The Tasker's rating has been negatively impacted for their cancellation</li>
                <li>We Are sorry for the inconvenience, post a new request :) </li>
              </ul>
              <br></br>
            </div>
          </div>
        </div>

        <a
          onClick={() => {
            switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
          }}
          className="button firstButtonInCard"
        >
          <span className="icon">
            <i className="far fa-arrow-alt-circle-left" />
          </span>
          <span>I understand</span>
        </a>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateJobState: bindActionCreators(updateJobState, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(RequesterCanceledByTaskerDetails);
