import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayLabelValue,
  TaskSpecificExtras,
} from '../../containers/commonComponents';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterDisputedDetails extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const {
      startingDateAndTime,
      addressText,
      _awardedBidRef,
      displayStatus,
      state,
      extras,
      _ownerRef,
      detailedDescription,
      processedPayment,
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      !_awardedBidRef ||
      !displayStatus ||
      !state ||
      !extras ||
      !_ownerRef ||
      !detailedDescription ||
      !processedPayment
    ) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    if (!extras.effort) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
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
    const { displayName: taskerDisplayName } = _bidderRef;
    if (!taskerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { displayName: ownerDisplayName } = _ownerRef;
    if (!ownerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { TITLE, ID, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    return (
      <div className="card disputeOnlyView">
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

            <div className="field">
              <label className="label">Request Status</label>
              <div className="control has-text-danger">{displayStatus}</div>
              <div className="help">* BidorBooCrew will resolve this asap</div>
            </div>

            <div className="field">
              <label className="label">Task Cost</label>
              <div className="control">{` ${bidValue}$ (${bidCurrency}) `}</div>
              <div className="help">* BidorBooCrew will resolve this asap</div>
            </div>

            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <DisplayLabelValue labelText="Address" labelValue={addressText} />
            <React.Fragment>
              <TaskSpecificExtras templateId={ID} extras={extras} />
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
            </React.Fragment>
          </div>

          <div className="field">
            <label className="label has-text-danger">What you need to know:</label>
            <div className="control">* BidorBooCrew will assess the dispute asap</div>
            <div className="control">
              * Our customer relation team will be in touch with tasker and requester to gather
              facts
            </div>
            <div className="control">
              * We will contact you asap to inform you of the next steps.
            </div>
          </div>
          <div style={{ padding: '0.5rem' }}>
            <hr className="divider isTight" />
          </div>
          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
              }}
              className={`button is-outlined`}
              style={{ flexGrow: 1, marginRight: 10 }}
            >
              <span className="icon">
                <i className="far fa-arrow-alt-circle-left" />
              </span>
              <span>I understand</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
