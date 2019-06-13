import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import {
  CountDownComponent,
  StartDateAndTime,
  DisplayLabelValue,
  EffortLevel,
} from '../../containers/commonComponents';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterOpenCanceledDetails extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const {
      _id,
      startingDateAndTime,
      addressText,
      displayStatus,
      detailedDescription,
      extras,
    } = job;
    if (
      !_id ||
      !startingDateAndTime ||
      !addressText ||
      !displayStatus ||
      !detailedDescription ||
      !extras
    ) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { TITLE } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    return (
      <div className="card readOnlyView ">
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
              <div className="help">* This will be deleted in 48 hours</div>
            </div>

            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />

            <DisplayLabelValue labelText="Address" labelValue={addressText} />

            <EffortLevel extras={extras} />
            <div className="field">
              <label className="label">Detailed Description</label>
              <span className="is-size-7">
                <TextareaAutosize
                  value={detailedDescription}
                  className="textarea is-marginless is-paddingless is-size-6"
                  style={{
                    resize: 'none',
                    border: 'none',
                    color: '#4a4a4a',
                    fontSize: '1rem',
                    background: '#eeeeee',
                  }}
                  readOnly
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
