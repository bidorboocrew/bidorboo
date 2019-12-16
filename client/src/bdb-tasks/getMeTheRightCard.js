import React from 'react';

import {
  RequesterRequestDetails,
  RequesterRequestSummary,
  RequesterAwardedSummary,
  RequesterAwardedDetails,
  RequesterCanceledByRequesterSummary,
  RequesterCanceledByRequesterDetails,
  RequesterCanceledByTaskerSummary,
  RequesterCanceledByTaskerDetails,
  TaskerBidOnTaskDetails,
  TaskerBidOnTaskSummary,
  TaskerBidOnTaskSummaryOnMap,
  TaskerMyOpenBidSummary,
  TaskerMyOpenBidDetails,
  TaskerMyAwardedBidSummary,
  TaskerMyAwardedBidDetails,
  TaskerAwardedBidCanceledByTaskerDetails,
  TaskerAwardedBidCanceledByTaskerSummary,
  TaskerAwardedBidCanceledByRequesterSummary,
  TaskerAwardedBidCanceledByRequesterDetails,
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
} from './index';

export { POINT_OF_VIEW };
export { REQUEST_STATES };

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
  [REQUEST_STATES.AWARDED_SEEN]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterAwardedSummary job={job} {...otherArgs} />
    ) : (
      <RequesterAwardedDetails job={job} {...otherArgs} />
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
  [REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER_SEEN]: ({
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
  [REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER_SEEN]: ({
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
  [REQUEST_STATES.DONE_SEEN]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
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
  [REQUEST_STATES.DISPUTE_RESOLVED]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <div>REQUEST_STATES.DISPUTE_RESOLVED summary not implemented yet</div>
    ) : (
      <div>REQUEST_STATES.DISPUTE_RESOLVED details not implemented yet</div>
    );
  },
  [REQUEST_STATES.ARCHIVE]: ({ job, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <div>REQUEST_STATES.ARCHIVE summary not implemented yet</div>
    ) : (
      <div>REQUEST_STATES.ARCHIVE details not implemented yet</div>
    );
  },
};

const TaskerCardTemplates = {
  [REQUEST_STATES.OPEN]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
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
  [REQUEST_STATES.AWARDED]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
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
  [REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER]: ({
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
  [REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER]: ({
    job,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <TaskerAwardedBidCanceledByRequesterSummary job={job} {...otherArgs} />;
    } else {
      return <TaskerAwardedBidCanceledByRequesterDetails job={job} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.DONE]: ({ job, isSummaryView, pointOfView, withBidDetails, ...otherArgs }) => {
    if (isSummaryView) {
      return <TaskerMyAwardedDoneBidSummary job={job} {...otherArgs} />;
    } else {
      return <TaskerMyAwardedDoneBidDetails job={job} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.DISPUTE_RESOLVED]: ({
    job,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <div>REQUEST_STATES.DISPUTE_RESOLVED state summary view not implemented yet</div>;
    } else {
      return <div>REQUEST_STATES.DISPUTE_RESOLVED state detail view not implemented yet</div>;
    }
  },
};

const getTaskerBidCard = (bid, isSummaryView, otherArgs) => {
  const { _jobRef } = bid;
  const state = _jobRef.state;
  try {
    switch (state) {
      case REQUEST_STATES.OPEN:
        try {
          const card = TaskerCardTemplates[state]({
            bid,
            job: _jobRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          console.error(e + ' Error Loading getTaskerBidCard REQUEST_STATES.OPEN: Card ');
        }
        break;
      case REQUEST_STATES.AWARDED_SEEN:
      case REQUEST_STATES.AWARDED:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.AWARDED]({
            bid,
            job: _jobRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card || <div>This type ain't found</div>;
        } catch (e) {
          console.error(e + ' Error Loading getTaskerBidCard REQUEST_STATES.AWARDED: Card ');
        }
        break;
      case REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER_SEEN:
      case REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER]({
            bid,
            job: _jobRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return (
            card || <div>this ain't found REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER</div>
          );
        } catch (e) {
          console.error(
            e +
              ' Error Loading getTaskerBidCard REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER: Card ',
          );
        }
        break;
      case REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER_SEEN:
      case REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER]({
            bid,
            job: _jobRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card || <div>this ain't found REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER</div>;
        } catch (e) {
          console.error(
            e +
              ' Error Loading getTaskerBidCard REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER: Card ',
          );
        }
        break;

      case REQUEST_STATES.DONE_SEEN:
      case REQUEST_STATES.DONE:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.DONE]({
            bid,
            job: _jobRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card || <div>REQUEST_STATES.DONE</div>;
        } catch (e) {
          console.error(e + ' Error Loading getTaskerBidCard REQUEST_STATES.DONE: Card ');
        }

      default:
        return <div>default unknown getTaskerBidCard</div>;
        break;
    }
  } catch (e) {
    console.error(e + ' Error Loading Tasker Card ' + state);
    return <div>Error Loading Tasker Card </div>;
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
      return card || <div>This type ain't found</div>;
    } catch (e) {
      console.error(e + ' Error Loading Requester Card ' + state);
      return <div>Error Loading Requester Card </div>;
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
      return card || <div>This type ain't found</div>;
    } catch (e) {
      console.error(e + ' Error Loading Requester Card ' + state);
      return <div>Error Loading Requester Card </div>;
    }
  }
  return null;
};
