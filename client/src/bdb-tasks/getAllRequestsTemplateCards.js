import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import TASKS_DEFINITIONS from './tasksDefinitions';

const renderTask = ({ task, isLoggedIn, showLoginDialog }) => {
  const { ID, renderSummaryCard, isComingSoon } = task;

  return (
    <div
      style={{
        background: `${isComingSoon ? 'whitesmoke' : 'white'}`,
        borderRadius: 0,
        height: '100%',
        position: 'relative',
        boxShadow: '0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)',
        minHeight: '12rem',
      }}
    >
      {renderSummaryCard && renderSummaryCard({})}
      {!isComingSoon && (
        <a
          style={{ fontSize: 14, width: 132, borderRadius: 25 }}
          onClick={() => {
            switchRoute(ROUTES.CLIENT.REQUESTER.dynamicCreateRequest(ID));
          }}
          className="button is-success firstButtonInCard"
        >
          REQUEST NOW
        </a>
      )}
      {isComingSoon && (
        <a
          style={{ fontSize: 14, width: 132, borderRadius: 25 }}
          className="button is-dark is-light firstButtonInCard"
          disabled
        >
          COMING SOON
        </a>
      )}
    </div>
  );
};

export const getAllActiveRequestsTemplateCards = (props) => {
  const taskIds = Object.keys(TASKS_DEFINITIONS);
  const taskDefinitions = taskIds.map((key) => TASKS_DEFINITIONS[`${key}`]);

  const restuls = taskDefinitions.map((task) => renderTask({ task, ...props }));

  return restuls;
};
