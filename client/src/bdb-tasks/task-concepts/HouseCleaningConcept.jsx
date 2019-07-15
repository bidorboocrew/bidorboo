import React from 'react';

import PropTypes from 'prop-types';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { JobTitleText } from '../../containers/commonComponents';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import taskImage from '../../assets/images/cleaning.png';
export default class HouseCleaningConcept extends React.Component {
  render() {
    const { ID, TITLE, DESCRIPTION, ICON } = TASKS_DEFINITIONS[`bdbHouseCleaning`];

    return (
      <div style={{ maxWidth: '36rem' }} className="card cardWithButton nofixedwidth">
        <div style={{ padding: '2.5rem' }} className="card-content template">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <figure>
                  <p class="image is-128x128">
                    <img src={taskImage} alt="BidOrBoo" style={{ borderRadius: '100%' }} />
                  </p>
                </figure>
              </div>
            </div>

            <div class="level-right">
              <div class="level-item">
                <div>
                  <h1 style={{ fontWeight: 300, marginBottom: '1.5rem' }}>{TITLE}</h1>
                  <p style={{ maxWidth: 320, color: '#6c6c6c' }}>{DESCRIPTION}</p>
                </div>
              </div>
            </div>
          </nav>

          <a
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicCreateJob(ID));
            }}
            className="button is-success firstButtonInCard"
          >
            REQUEST NOW
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
