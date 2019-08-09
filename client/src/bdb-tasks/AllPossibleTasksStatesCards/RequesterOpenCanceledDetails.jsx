import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import {
  CountDownComponent,
  StartDateAndTime,
  DisplayLabelValue,
  TaskSpecificExtras,
} from '../../containers/commonComponents';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterOpenCanceledDetails extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
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
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    return (
      <div className="card readOnlyView ">
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

            <div className="group">
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
            <div className="has-text-left">
              <DisplayLabelValue labelText="Address" labelValue={addressText} />

              <TaskSpecificExtras templateId={ID} extras={extras} />
              <div className="group">
                <label className="label hasSelectedValue">Detailed Description</label>
                <span className="is-size-7">
                  <TextareaAutosize
                    value={detailedDescription}
                    className="textarea is-marginless is-paddingless is-size-6"
                    style={{
                      resize: 'none',
                      border: 'none',
                      color: '#353535',
                      fontSize: 16,
                      background: '#eeeeee',
                    }}
                    readOnly
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
