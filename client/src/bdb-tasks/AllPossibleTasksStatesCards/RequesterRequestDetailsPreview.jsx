import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Collapse } from 'react-collapse';

import {
  DisplayLabelValue,
  CountDownComponent,
  StartDateAndTime,
  TaskSpecificExtras,
  DestinationAddressValue,
} from '../../containers/commonComponents';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class RequesterRequestDetailsPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false,
    };
  }

  toggleShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  render() {
    const { job } = this.props;
    if (!job) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.root);
    }
    const { startingDateAndTime, addressText, detailedDescription, _ownerRef, extras } = job;
    if (!startingDateAndTime || !addressText || !detailedDescription || !_ownerRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myRequestsPage);
    }
    const { TITLE, ID, ICON, IMG } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE || !ID) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.root);
    }

    const { showMore } = this.state;
    return (
      <div style={{ height: 'unset' }} className="card">
        <div style={{ minHeight: 'unset' }} className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="title">
                <span className="icon">
                  <i className={ICON} />
                </span>
                <span style={{ marginLeft: 7 }}>{TITLE}</span>
              </div>
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
            <DisplayLabelValue labelText="Address" labelValue={addressText} />
            {extras && extras.destinationText && (
              <DestinationAddressValue
                destionationAddress={extras.destinationText}
              ></DestinationAddressValue>
            )}
            <Collapse isOpened={showMore}>
              <div className="has-text-left">
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
    );
  }
}
