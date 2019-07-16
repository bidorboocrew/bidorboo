import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import TASKS_DEFINITIONS from './tasksDefinitions';

const renderTask = (taskDetails) => {
  const { ID, renderSummaryCard } = taskDetails;

  return (
    <div>
      <div style={{ background: 'white' }}>
        {renderSummaryCard && renderSummaryCard()}
        <div className="has-text-right">
          <a
            style={{ fontSize: 14, width: 132, borderRadius: 25, marginRight: '1.5rem' }}
            onClick={() => {
              switchRoute(ROUTES.CLIENT.PROPOSER.dynamicCreateJob(ID));
            }}
            className="button is-success"
          >
            REQUEST NOW
          </a>
        </div>
      </div>
    </div>
  );
};

export const getAllActiveRequestsTemplateCards = () => {
  const taskIds = Object.keys(TASKS_DEFINITIONS);
  const taskDefinitions = taskIds.map((key) => TASKS_DEFINITIONS[`${key}`]);

  const restuls = taskDefinitions.map((task) => renderTask(task));

  return restuls;
};
