import React from 'react';

import PropTypes from 'prop-types';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { JobTitleText } from '../../containers/commonComponents';
import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningConcept extends React.Component {
  render() {
    const { ID, TITLE, DESCRIPTION, ICON } = HOUSE_CLEANING_DEF;

    return (
      <div className="card limitWidthOfCard">
        <div className="card-content">
          <div className="content">
            <JobTitleText title={TITLE} iconClass={ICON} />
            <hr className="divider" />
            {DESCRIPTION}
          </div>
        </div>
        <footer className="card-footer">
          <a
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicCreateJob(ID));
            }}
            className="card-footer-item button is-success is-outlined is-fullwidth"
          >
            Request Now
          </a>
        </footer>
      </div>
    );
  }
}

HouseCleaningConcept.propTypes = {
  isLoggedIn: PropTypes.bool,
  showLoginDialog: PropTypes.func,
};
