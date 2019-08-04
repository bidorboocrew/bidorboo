import React from 'react';

import {
  RequesterRequestDetails,
  RequesterRequestSummary,
  RequesterAwardedSummary,
  RequesterAwardedDetails,
  RequesterOpenCanceledSummary,
  RequesterOpenCanceledDetails,
  RequesterCanceledByRequesterSummary,
  RequesterCanceledByRequesterDetails,
  RequesterCanceledByTaskerSummary,
  RequesterCanceledByTaskerDetails,
  TaskerBidOnTaskDetails,
  TaskerBidOnTaskSummary,
  TaskerMyOpenBidSummary,
  TaskerMyOpenBidDetails,
  TaskerMyAwardedBidSummary,
  TaskerMyAwardedBidDetails,
  TaskerAwardedBidCanceledByTaskerDetails,
  TaskerAwardedBidCanceledByTaskerSummary,
  RequesterDoneSummary,
  RequesterDoneDetails,
  TaskerMyAwardedDoneBidDetails,
  TaskerMyAwardedDoneBidSummary,
  RequesterDisputedDetails,
  RequesterDisputedSummary,
  TaskerMyDisputedBidSummary,
  TaskerMyDisputedBidDetails,
  REQUEST_STATES,
  POINT_OF_VIEW,
  BID_STATES,
} from './index';

export { POINT_OF_VIEW };
export { REQUEST_STATES };
export { BID_STATES };

const requesterCardTemplates = {
  [REQUEST_STATES.OPEN]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterRequestSummary job={job} {...otherArgs} />
    ) : (
      <RequesterRequestDetails job={job} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterAwardedSummary job={job} {...otherArgs} />
    ) : (
      <RequesterAwardedDetails job={job} {...otherArgs} />
    );
  },
  [REQUEST_STATES.CANCELED_OPEN]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterOpenCanceledSummary job={job} {...otherArgs} />
    ) : (
      <RequesterOpenCanceledDetails job={job} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER]: ({
    job,
    isSummaryView,
    pointOfView,
    ...otherArgs
  }) => {
    return isSummaryView ? (
      <RequesterCanceledByRequesterSummary job={job} {...otherArgs} />
    ) : (
      <RequesterCanceledByRequesterDetails job={job} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER]: ({
    job,
    isSummaryView,
    pointOfView,
    ...otherArgs
  }) => {
    return isSummaryView ? (
      <RequesterCanceledByTaskerSummary job={job} {...otherArgs} />
    ) : (
      <RequesterCanceledByTaskerDetails job={job} {...otherArgs} />
    );
  },
  [REQUEST_STATES.DONE]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterDoneSummary job={job} {...otherArgs} />
    ) : (
      <RequesterDoneDetails job={job} {...otherArgs} />
    );
  },
  [REQUEST_STATES.DISPUTED]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterDisputedSummary job={job} {...otherArgs} />
    ) : (
      <RequesterDisputedDetails job={job} {...otherArgs} />
    );
  },
  [REQUEST_STATES.PAIDOUT]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <div>REQUEST_STATES.PAIDOUT summary not implemented yet</div>
    ) : (
      <div>REQUEST_STATES.PAIDOUT details not implemented yet</div>
    );
  },
  [REQUEST_STATES.ARCHIVE]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <div>REQUEST_STATES.ARCHIVE summary not implemented yet</div>
    ) : (
      <div>REQUEST_STATES.ARCHIVE details not implemented yet</div>
    );
  },
  [REQUEST_STATES.PAYMENT_TO_BANK_FAILED]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <div>REQUEST_STATES.PAYMENT_TO_BANK_FAILED summary not implemented yet</div>
    ) : (
      <div>REQUEST_STATES.PAYMENT_TO_BANK_FAILED details not implemented yet</div>
    );
  },
  [REQUEST_STATES.PAYMENT_RELEASED]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <div>REQUEST_STATES.PAYMENT_RELEASED summary not implemented yet</div>
    ) : (
      <div>REQUEST_STATES.PAYMENT_RELEASED details not implemented yet</div>
    );
  },
};

const TaskerCardTemplates = {
  [BID_STATES.OPEN]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
    if (isSummaryView) {
      if (withBidDetails) {
        return <TaskerMyOpenBidSummary job={job} {...otherArgs} />;
      }
      return <TaskerBidOnTaskSummary job={job} {...otherArgs} />;
    } else {
      if (withBidDetails) {
        return <TaskerMyOpenBidDetails job={job} {...otherArgs} />;
      }
      return <TaskerBidOnTaskDetails job={job} {...otherArgs} />;
    }
  },
  [BID_STATES.WON]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
    if (job.state === REQUEST_STATES.DISPUTED) {
      if (isSummaryView) {
        return <TaskerMyDisputedBidSummary job={job} {...otherArgs} />;
      } else {
        return <TaskerMyDisputedBidDetails job={job} {...otherArgs} />;
      }
    } else {
      if (isSummaryView) {
        return <TaskerMyAwardedBidSummary job={job} {...otherArgs} />;
      } else {
        return <TaskerMyAwardedBidDetails job={job} {...otherArgs} />;
      }
    }
  },
  [BID_STATES.AWARDED_BID_CANCELED_BY_TASKER]: ({
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
  [BID_STATES.DONE]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
    if (isSummaryView) {
      return <TaskerMyAwardedDoneBidSummary job={job} {...otherArgs} />;
    } else {
      return <TaskerMyAwardedDoneBidDetails job={job} {...otherArgs} />;
    }
  },
};

const getTaskerBidCard = (bid, isSummaryView, otherArgs) => {
  const { state, _jobRef } = bid;
  switch (state) {
    case BID_STATES.OPEN:
      try {
        const card = TaskerCardTemplates[bid.state]({
          bid,
          job: _jobRef,
          isSummaryView,
          pointOfView: POINT_OF_VIEW.TASKER,
          withBidDetails: true,
          otherArgs,
        });
        return card;
      } catch (e) {
        console.error(e + ' Error Loading getTaskerBidCard BID_STATES.OPEN: Card ');
      }
      break;
    case BID_STATES.WON_SEEN:
    case BID_STATES.WON:
      // return <TaskerMyOpenBidSummary bid={bid} job={_jobRef} {...otherArgs} />;
      try {
        const card = TaskerCardTemplates[bid.state]({
          bid,
          job: _jobRef,
          isSummaryView,
          pointOfView: POINT_OF_VIEW.TASKER,
          withBidDetails: true,
          otherArgs,
        });
        return card || <div>This type aint found</div>;
      } catch (e) {
        console.error(e + ' Error Loading getTaskerBidCard BID_STATES.OPEN: Card ');
      }
      break;
    case BID_STATES.AWARDED_BID_CANCELED_BY_REQUESTER:
      return <div>This type aint found BID_STATES.AWARDED_BID_CANCELED_BY_REQUESTER</div>;
      break;
    case BID_STATES.AWARDED_BID_CANCELED_BY_TASKER:
      try {
        const card = TaskerCardTemplates[bid.state]({
          bid,
          job: _jobRef,
          isSummaryView,
          pointOfView: POINT_OF_VIEW.TASKER,
          withBidDetails: true,
          otherArgs,
        });
        return card || <div>This type aint found</div>;
      } catch (e) {
        console.error(e + ' Error Loading getTaskerBidCard BID_STATES.OPEN: Card ');
      }
      break;

    case BID_STATES.DONE:
      try {
        const card = TaskerCardTemplates[bid.state]({
          bid,
          job: _jobRef,
          isSummaryView,
          pointOfView: POINT_OF_VIEW.TASKER,
          withBidDetails: true,
          otherArgs,
        });
        return card || <div>This type aint found</div>;
      } catch (e) {
        console.error(e + ' Error Loading getTaskerBidCard BID_STATES.OPEN: Card ');
      }
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
  if (!job || !job.templateId) {
    console.error('no job passed in');
    return; //return
  }
  if (isSummaryView === undefined || pointOfView === undefined) {
    console.error('Summary or Point ofView was not  passed in');
    return;
  }

  const { state } = job;
  if (pointOfView === POINT_OF_VIEW.REQUESTER) {
    try {
      const card = requesterCardTemplates[state]({
        job,
        isSummaryView,
        pointOfView,
        otherArgs,
      });
      return card || <div>This type aint found</div>;
    } catch (e) {
      console.error(e + ' Error Loading Requester Card ' + state);
      return null;
    }
  }
  if (pointOfView === POINT_OF_VIEW.TASKER) {
    try {
      const card = TaskerCardTemplates[state]({
        job,
        isSummaryView,
        pointOfView,
        addBidDetails: false,
        otherArgs,
      });
      return card || <div>This type aint found</div>;
    } catch (e) {
      console.error(e + ' Error Loading Tasker Card ' + state);
      return null;
    }
  }
  return null;
};
