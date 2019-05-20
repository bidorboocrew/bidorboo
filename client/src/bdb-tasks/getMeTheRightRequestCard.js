import React from 'react';

import {
  HouseCleaningRequestDetails,
  HouseCleaningRequestSummary,
  HouseCleaningAwardedSummary,
  HouseCleaningAwardedDetails,
  HouseCleaningOpenCanceledSummary,
  HouseCleaningOpenCanceledDetails,
  HouseCleaningAwardedCanceledByRequesterSummary,
  HouseCleaningAwardedCanceledByRequesterDetails,
  TaskerHouseCleaningDetails,
  TaskerHouseCleaningSummary,
  HOUSE_CLEANING_DEF,
  REQUEST_STATES,
  POINT_OF_VIEW,
} from './index';

export { POINT_OF_VIEW };
export { REQUEST_STATES };
const requesterCardTemplates = {
  [HOUSE_CLEANING_DEF.ID]: {
    [REQUEST_STATES.OPEN]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
      return isSummaryView ? (
        <HouseCleaningRequestSummary job={job} {...otherArgs} />
      ) : (
        <HouseCleaningRequestDetails job={job} {...otherArgs} />
      );
    },
    [REQUEST_STATES.AWARDED]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
      return isSummaryView ? (
        <HouseCleaningAwardedSummary job={job} {...otherArgs} />
      ) : (
        <HouseCleaningAwardedDetails job={job} {...otherArgs} />
      );
    },
    [REQUEST_STATES.CANCELED_OPEN]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
      return isSummaryView ? (
        <HouseCleaningOpenCanceledSummary job={job} {...otherArgs} />
      ) : (
        <HouseCleaningOpenCanceledDetails job={job} {...otherArgs} />
      );
    },
    [REQUEST_STATES.AWARDED_CANCELED_BY_REQUESTER]: ({
      job,
      isSummaryView,
      pointOfView,
      ...otherArgs
    }) => {
      return isSummaryView ? (
        <HouseCleaningAwardedCanceledByRequesterSummary job={job} {...otherArgs} />
      ) : (
        <HouseCleaningAwardedCanceledByRequesterDetails job={job} {...otherArgs} />
      );
    },
  },
};

const TaskerCardTemplates = {
  [HOUSE_CLEANING_DEF.ID]: {
    [REQUEST_STATES.OPEN]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
      return isSummaryView ? (
        <TaskerHouseCleaningSummary job={job} {...otherArgs} />
      ) : (
        <TaskerHouseCleaningDetails job={job} {...otherArgs} />
      );
    },
  },
};

export const getMeTheRightBidCard = ({
  bid,
  isSummaryView,
  pointOfView = POINT_OF_VIEW.TASKER,
  ...otherArgs
}) => {
  if (!bid || !bid._id) {
    console.error('no job passed in');
    return; //return
  }
  if (isSummaryView === undefined || pointOfView === undefined) {
    console.error('Summary or Point ofView was not  passed in');
    return;
  }
};

export const getMeTheRightRequestCard = ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
  if (!job || !job.fromTemplateId) {
    console.error('no job passed in');
    return; //return
  }
  if (isSummaryView === undefined || pointOfView === undefined) {
    console.error('Summary or Point ofView was not  passed in');
    return;
  }

  const { fromTemplateId, state } = job;
  if (pointOfView === POINT_OF_VIEW.REQUESTER) {
    try {
      const card = requesterCardTemplates[fromTemplateId][state]({
        job,
        isSummaryView,
        pointOfView,
        otherArgs,
      });
      return card;
    } catch (e) {
      alert(e + ' Error Loading Requester Card ');
    }
  }
  if (pointOfView === POINT_OF_VIEW.TASKER) {
    try {
      const card = TaskerCardTemplates[fromTemplateId][state]({
        job,
        isSummaryView,
        pointOfView,
        otherArgs,
      });
      return card;
    } catch (e) {
      alert(e + ' Error Loading Tasker Card ');
    }
  }
  return null;
};
