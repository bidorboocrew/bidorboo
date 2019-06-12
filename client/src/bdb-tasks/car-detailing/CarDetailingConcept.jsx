import React from 'react';

import PropTypes from 'prop-types';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { JobTitleText } from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class CarDetailingConcept extends React.Component {
  render() {
    const { ID, TITLE, DESCRIPTION, ICON } = TASKS_DEFINITIONS[`bdbjob-house-cleaning`];

    return (
      <div className="card limitWidthOfCard">
        <div className="card-content template">
          <div style={{ height: '10rem' }} className="content">
            <JobTitleText title={TITLE} iconClass={ICON} />
            <hr className="divider isTight" />
            <div style={{ marginTop: '1.5rem' }}>{DESCRIPTION}</div>
          </div>
          <a
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicCreateJob(ID));
            }}
            className="button is-success is-outlined is-fullwidth"
          >
            Request Now
          </a>
        </div>
      </div>
    );
  }
}

CarDetailingConcept.propTypes = {
  isLoggedIn: PropTypes.bool,
  showLoginDialog: PropTypes.func,
};
