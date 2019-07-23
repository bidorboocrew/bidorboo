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

export default class RequesterCanceledByRequesterDetails extends React.Component {
  render() {
    const { job } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
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
      templateId,
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
      !templateId ||
      !processedPayment
    ) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    if (!extras.effort) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { bidAmount, _bidderRef } = _awardedBidRef;
    if (!bidAmount || !_bidderRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    // xxxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { displayName: taskerDisplayName } = _bidderRef;
    if (!taskerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    const { displayName: ownerDisplayName } = _ownerRef;
    if (!ownerDisplayName) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { TITLE, ID, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }

    return (
      <div className="card readOnlyView">
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

            <div className="group saidTest">
              <label className="label">Request Status</label>
              <div className="control has-text-danger">{displayStatus}</div>
              <div className="help">* You have canceled this agreement</div>
            </div>

            <div className="group saidTest">
              <label className="label">Task Cost</label>
              <div className="control">{` ${bidValue}$ (${bidCurrency}) `}</div>

              <div className="help">* will refund 80% of the payment to your card.</div>
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
              <div className="group saidTest">
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
                      background: '#f6f6f6',
                    }}
                    readOnly
                  />
                </span>
              </div>
            </React.Fragment>
          </div>

          <div className="group saidTest">
            <label className="label has-text-danger">What you need to know:</label>
            <div className="control">
              * You will be <strong>penalized 20%</strong> of the total payment and will be refunded
              80%.
            </div>
            <div className="control">* Your global rating will be impacted</div>
            <div className="control">* Cancelling often will put a ban on your account</div>
          </div>
          <div style={{ padding: '0.5rem' }}>
            <hr className="divider isTight" />
          </div>
          <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
              }}
              className={`button`}
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
