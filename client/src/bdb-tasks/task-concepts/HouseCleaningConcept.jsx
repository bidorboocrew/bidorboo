import React from 'react';

import PropTypes from 'prop-types';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { JobTitleText } from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';

export default class HouseCleaningConcept extends React.Component {
  render() {
    const { ID, TITLE, DESCRIPTION, ICON } = TASKS_DEFINITIONS[`bdbHouseCleaning`];

    return (
      <div className="card limitWidthOfCard cardWithButton">
        <div className="card-content template">
          <div className="content">
            <JobTitleText title={TITLE} iconClass={ICON} />
            <div>{DESCRIPTION}</div>
          </div>
          <a
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicCreateJob(ID));
            }}
            className="button is-success firstButtonInCard"
          >
            Request Now
          </a>
        </div>
      </div>
    );
  }
}

HouseCleaningConcept.propTypes = {
  isLoggedIn: PropTypes.bool,
  showLoginDialog: PropTypes.func,
};
