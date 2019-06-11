import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import {
  DisplayLabelValue,
  CountDownComponent,
  StartDateAndTime,
  EffortLevel,
} from '../../containers/commonComponents';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import TASKS_DEFINITIONS from './tasksDefinitions';

export default class RequesterRequesterRequestDetailsPreview extends React.Component {
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
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { startingDateAndTime, addressText, detailedDescription, _ownerRef, extras } = job;
    if (!startingDateAndTime || !addressText || !detailedDescription || !_ownerRef) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }
    const { TITLE } = TASKS_DEFINITIONS[`${job.fromTemplateId}`];
    if (!TITLE) {
      return switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
    }

    const { showMore } = this.state;

    return (
      <div style={{ height: 'unset' }} className="card">
        <div style={{ minHeight: 'unset' }} className="card-content">
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
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />

            <DisplayLabelValue labelText="Address" labelValue={addressText} />
            {showMore && (
              <React.Fragment>
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
                      }}
                      readOnly
                    />
                  </span>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        <div style={{ padding: '0.5rem' }}>
          {!showMore && (
            <a onClick={this.toggleShowMore} className="button is-small is-outlined">
              <span style={{ marginRight: 4 }}>show full details</span>
              <span className="icon">
                <i className="fas fa-angle-double-down" />
              </span>
            </a>
          )}
          {showMore && (
            <a onClick={this.toggleShowMore} className="button is-small is-outlined">
              <span style={{ marginRight: 4 }}>show less details</span>
              <span className="icon">
                <i className="fas fa-angle-double-up" />
              </span>
            </a>
          )}
        </div>
      </div>
    );
  }
}
