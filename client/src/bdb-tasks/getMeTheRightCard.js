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
  TaskerBidOnHouseCleaningDetails,
  TaskerBidOnHouseCleaningSummary,
  TaskerMyOpenBidHouseCleaningSummary,
  TaskerMyOpenBidHouseCleaningDetails,
  TaskerMyAwardedBidHouseCleaningSummary,
  TaskerMyAwardedBidHouseCleaningDetails,
  TaskerAwardedBidCanceledByTaskerDetails,
  TaskerAwardedBidCanceledByTaskerSummary,
  HOUSE_CLEANING_DEF,
  REQUEST_STATES,
  POINT_OF_VIEW,
  BID_STATES,
} from './index';

export { POINT_OF_VIEW };
export { REQUEST_STATES };
export { BID_STATES };

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
    [REQUEST_STATES.DONE]: ({
      job,
      isSummaryView,
      pointOfView,
      ...otherArgs
    }) => {
      return isSummaryView ? (
        <div>REQUEST_STATES.DONE summary not implemented yet</div>
      ) : (
        <div>REQUEST_STATES.DONE details not implemented yet</div>
      );
    },
    [REQUEST_STATES.DISPUTED]: ({
      job,
      isSummaryView,
      pointOfView,
      ...otherArgs
    }) => {
      return isSummaryView ? (
        <div>REQUEST_STATES.DISPUTED summary not implemented yet</div>
      ) : (
        <div>REQUEST_STATES.DISPUTED details not implemented yet</div>
      );
    },
  },
};

const TaskerCardTemplates = {
  [HOUSE_CLEANING_DEF.ID]: {
    [BID_STATES.OPEN]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
      if (isSummaryView) {
        if (withBidDetails) {
          return <TaskerMyOpenBidHouseCleaningSummary job={job} {...otherArgs} />;
        }
        return <TaskerBidOnHouseCleaningSummary job={job} {...otherArgs} />;
      } else {
        if (withBidDetails) {
          return <TaskerMyOpenBidHouseCleaningDetails job={job} {...otherArgs} />;
        }
        return <TaskerBidOnHouseCleaningDetails job={job} {...otherArgs} />;
      }
    },
    [BID_STATES.WON]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
      if (isSummaryView) {
        return <TaskerMyAwardedBidHouseCleaningSummary job={job} {...otherArgs} />;
      } else {
        return <TaskerMyAwardedBidHouseCleaningDetails job={job} {...otherArgs} />;
      }
    },
    [BID_STATES.CANCELED_AWARDED_BY_TASKER]: ({
      job,
      isSummaryView,
      pointOfView,
      withBidDetails,
      ...otherArgs
    }) => {
      if (isSummaryView) {
        return <TaskerAwardedBidCanceledByTaskerSummary job={job} {...otherArgs} />;
      } else {
        return <TaskerAwardedBidCanceledByTaskerDetails job={job} {...otherArgs} />;
      }
    },
  },
};

const getTaskerBidCard = (bid, isSummaryView, otherArgs) => {
  const { state, _jobRef } = bid;
  switch (state) {
    case BID_STATES.OPEN:
      try {
        const card = TaskerCardTemplates[_jobRef.fromTemplateId][bid.state]({
          bid,
          job: _jobRef,
          isSummaryView,
          pointOfView: POINT_OF_VIEW.TASKER,
          withBidDetails: true,
          otherArgs,
        });
        return card;
      } catch (e) {
        alert(e + ' Error Loading getTaskerBidCard BID_STATES.OPEN: Card ');
      }
      break;
    case BID_STATES.WON_SEEN:
    case BID_STATES.WON:
      // return <TaskerMyOpenBidHouseCleaningSummary bid={bid} job={_jobRef} {...otherArgs} />;
      try {
        const card = TaskerCardTemplates[_jobRef.fromTemplateId][bid.state]({
          bid,
          job: _jobRef,
          isSummaryView,
          pointOfView: POINT_OF_VIEW.TASKER,
          withBidDetails: true,
          otherArgs,
        });
        return card || <div>This type aint found</div>;
      } catch (e) {
        alert(e + ' Error Loading getTaskerBidCard BID_STATES.OPEN: Card ');
      }
      break;
    case BID_STATES.CANCELED_AWARDED_BY_REQUESTER:
      return <div>This type aint found BID_STATES.CANCELED_AWARDED_BY_REQUESTER</div>;
      break;
    case BID_STATES.CANCELED_AWARDED_BY_TASKER:
      try {
        const card = TaskerCardTemplates[_jobRef.fromTemplateId][bid.state]({
          bid,
          job: _jobRef,
          isSummaryView,
          pointOfView: POINT_OF_VIEW.TASKER,
          withBidDetails: true,
          otherArgs,
        });
        return card || <div>This type aint found</div>;
      } catch (e) {
        alert(e + ' Error Loading getTaskerBidCard BID_STATES.OPEN: Card ');
      }
      break;

    case BID_STATES.DONE:
      return <div>This type aint found BID_STATES.DONE</div>;
      break;
    case BID_STATES.PAID_OUT:
      return <div>This type aint found BID_STATES.PAID_OUT</div>;
      break;
    default:
      return <div>default unknown getTaskerBidCard</div>;
      break;
  }
};

export const getMeTheRightBidCard = ({ bid, isSummaryView, ...otherArgs }) => {
  if (!bid || !bid._id) {
    console.error('no bid passed in');
    return; //return
  }
  if (isSummaryView === undefined) {
    console.error('Summary was not  passed in');
    return;
  }
  if (!bid._jobRef) {
    console.error('no associated job for this bid passed in');
    return; //return
  }
  return getTaskerBidCard(bid, isSummaryView, otherArgs);
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
      debugger
      const card = requesterCardTemplates[fromTemplateId][state]({
        job,
        isSummaryView,
        pointOfView,
        otherArgs,
      });
      return card || <div>This type aint found</div>;
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
        addBidDetails: false,
        otherArgs,
      });
      return card || <div>This type aint found</div>;
    } catch (e) {
      alert(e + ' Error Loading Tasker Card ');
    }
  }
  return null;
};
