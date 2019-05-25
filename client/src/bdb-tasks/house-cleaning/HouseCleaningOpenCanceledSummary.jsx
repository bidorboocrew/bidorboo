import React from 'react';

import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
} from '../../containers/commonComponents';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningOpenCanceledSummary extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return <div>HouseCleaningOpenCanceledSummary is missing properties</div>;
    }
    const { _id: jobId, startingDateAndTime, addressText, displayStatus } = job;

    if (!jobId || !startingDateAndTime || !addressText || !displayStatus) {
      return <div>HouseCleaningOpenCanceledSummary is missing properties</div>;
    }
    const { TITLE } = HOUSE_CLEANING_DEF;
    if (!TITLE) {
      return <div>HouseCleaningOpenCanceledSummary is missing properties</div>;
    }

    return (
      <div className="card readOnlyView limitWidthOfCard">
        {/* <div className="card-image">
          <img className="bdb-cover-img" src={IMG_URL} />
        </div> */}
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
          <div style={{ padding: '0.5rem' }}>
            <hr className="divider isTight" />
          </div>
          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              style={{ position: 'relative' }}
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(jobId));
              }}
              className="button is-outlined is-fullwidth "
            >
              View Canceled Request
            </a>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
