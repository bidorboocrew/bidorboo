import React from 'react';

import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
} from '../../containers/commonComponents';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterOpenCanceledSummary extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return <div>RequesterOpenCanceledSummary is missing properties</div>;
    }
    const { _id: jobId, startingDateAndTime, addressText, displayStatus } = job;

    if (!jobId || !startingDateAndTime || !addressText || !displayStatus) {
      return <div>RequesterOpenCanceledSummary is missing properties</div>;
    }
    const { TITLE, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>RequesterOpenCanceledSummary is missing properties</div>;
    }

    return (
      <div className="card readOnlyView cardWithButton">
        {/* <div className="card-image">
          <img className="bdb-cover-img" src={IMG_URL} />
        </div> */}
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="title">
                <span className="icon">
                  <i className={ICON} />
                </span>
                <span style={{ marginLeft: 7 }}>{TITLE}</span>
              </div>
            </div>

            <div className="group">
              <label className="label">Request Status</label>
              <div className="control">{displayStatus}</div>
              <div className="help">* This Request will be deleted in 48 hours</div>
            </div>

            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />

            <DisplayShortAddress addressText={addressText} />
          </div>
        </div>

        <React.Fragment>
          <div className="firstButtonInCard">
            <a
              style={{ position: 'relative' }}
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(jobId));
              }}
              className="button is-fullwidth"
            >
              VIEW DETAILS
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
