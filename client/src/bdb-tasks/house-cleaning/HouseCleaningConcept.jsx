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
      <div
        onClick={(e) => {
          switchRoute(ROUTES.CLIENT.PROPOSER.dynamicCreateJob(ID));
        }}
        className="card is-clipped limitWidthOfCard"
      >
        <div className="card-content">
          <div className="content">
            <JobTitleText title={TITLE} iconClass={ICON} />
            <hr className="divider" />
            {DESCRIPTION}
          </div>
          <a className="button is-success is-outlined is-fullwidth">Request Now</a>
        </div>
      </div>
    );
  }
}

HouseCleaningConcept.propTypes = {
  isLoggedIn: PropTypes.bool,
  showLoginDialog: PropTypes.func,
};
