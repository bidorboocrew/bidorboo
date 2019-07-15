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
      <div
        style={{ maxWidth: '36rem', boxShadow: 'none' }}
        className="card cardWithButton nofixedwidth"
      >
        <div style={{ padding: '1.5rem' }} className="card-content template">
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <figure>
                  <p className="image is-128x128">
                    <img src={taskImage} alt="BidOrBoo" style={{ borderRadius: '100%' }} />
                  </p>
                </figure>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div style={{ paddingLeft: '1.5rem' }}>
                  <h1 className="title" style={{ fontWeight: 300, marginBottom: '1.5rem' }}>
                    {TITLE}
                  </h1>
                  <p style={{ maxWidth: 320, color: '#6a748a' }}>{DESCRIPTION}</p>
                </div>
              </div>
            </div>
          </nav>

          <a
            style={{ fontSize: 14, width: 132 }}
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
