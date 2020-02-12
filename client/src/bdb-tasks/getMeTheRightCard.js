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
  RequesterArchiveSummary,
  RequesterArchiveDetails,
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
  TaskerBidDoneDetails,
  TaskerBidDoneSummary,
  RequesterDisputedDetails,
  RequesterDisputedSummary,
  TaskerMyDisputedBidSummary,
  TaskerMyDisputedBidDetails,
  TaskerArchiveSummary,
  TaskerArchiveDetails,
  REQUEST_STATES,
  POINT_OF_VIEW,
  RequesterDisputedResolvedSummary,
  RequesterDisputedResolvedDetails,
  TaskerMyDisputedResolvedBidDetails,
  TaskerMyDisputedResolvedBidSummary,
} from './index';
import { getBugsnagClient } from '../index';
export { POINT_OF_VIEW };
export { REQUEST_STATES };

const requesterCardTemplates = {
  [REQUEST_STATES.OPEN]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterRequestSummary request={request} {...otherArgs} />
    ) : (
      <RequesterRequestDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterAwardedSummary request={request} {...otherArgs} />
    ) : (
      <RequesterAwardedDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED_SEEN]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterAwardedSummary request={request} {...otherArgs} />
    ) : (
      <RequesterAwardedDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER]: ({
    request,
    isSummaryView,
    pointOfView,
    ...otherArgs
  }) => {
    return isSummaryView ? (
      <RequesterCanceledByRequesterSummary request={request} {...otherArgs} />
    ) : (
      <RequesterCanceledByRequesterDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN]: ({
    request,
    isSummaryView,
    pointOfView,
    ...otherArgs
  }) => {
    return isSummaryView ? (
      <RequesterCanceledByRequesterSummary request={request} {...otherArgs} />
    ) : (
      <RequesterCanceledByRequesterDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER]: ({
    request,
    isSummaryView,
    pointOfView,
    ...otherArgs
  }) => {
    return isSummaryView ? (
      <RequesterCanceledByTaskerSummary request={request} {...otherArgs} />
    ) : (
      <RequesterCanceledByTaskerDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN]: ({
    request,
    isSummaryView,
    pointOfView,
    ...otherArgs
  }) => {
    return isSummaryView ? (
      <RequesterCanceledByTaskerSummary request={request} {...otherArgs} />
    ) : (
      <RequesterCanceledByTaskerDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.DONE]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterDoneSummary request={request} {...otherArgs} />
    ) : (
      <RequesterDoneDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.DONE_SEEN]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterDoneSummary request={request} {...otherArgs} />
    ) : (
      <RequesterDoneDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.DISPUTED]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterDisputedSummary request={request} {...otherArgs} />
    ) : (
      <RequesterDisputedDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.DISPUTE_RESOLVED]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterDisputedResolvedSummary request={request} {...otherArgs} />
    ) : (
      <RequesterDisputedResolvedDetails request={request} {...otherArgs} />
    );
  },
  [REQUEST_STATES.ARCHIVE]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <RequesterArchiveSummary request={request} {...otherArgs} />
    ) : (
      <RequesterArchiveDetails request={request} {...otherArgs} />
    );
  },
};

const TaskerCardTemplates = {
  [REQUEST_STATES.OPEN]: ({
    request,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      if (withBidDetails) {
        return <TaskerMyOpenBidSummary request={request} {...otherArgs} />;
      }
      return <TaskerBidOnTaskSummary request={request} {...otherArgs} />;
    } else {
      if (withBidDetails) {
        return <TaskerMyOpenBidDetails request={request} {...otherArgs} />;
      }
      return <TaskerBidOnTaskDetails request={request} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.AWARDED]: ({
    request,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <TaskerMyAwardedBidSummary request={request} {...otherArgs} />;
    } else {
      return <TaskerMyAwardedBidDetails request={request} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER]: ({
    request,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <TaskerAwardedBidCanceledByTaskerSummary request={request} {...otherArgs} />;
    } else {
      return <TaskerAwardedBidCanceledByTaskerDetails request={request} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER]: ({
    request,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <TaskerAwardedBidCanceledByRequesterSummary request={request} {...otherArgs} />;
    } else {
      return <TaskerAwardedBidCanceledByRequesterDetails request={request} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.DONE]: ({
    request,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <TaskerBidDoneSummary request={request} {...otherArgs} />;
    } else {
      return <TaskerBidDoneDetails request={request} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.DISPUTED]: ({
    request,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <TaskerMyDisputedBidSummary request={request} {...otherArgs} />;
    } else {
      return <TaskerMyDisputedBidDetails request={request} {...otherArgs} />;
    }
  },
  [REQUEST_STATES.DISPUTE_RESOLVED]: ({
    request,
    isSummaryView,
    pointOfView,
    withBidDetails,
    ...otherArgs
  }) => {
    if (isSummaryView) {
      return <TaskerMyDisputedResolvedBidSummary request={request} {...otherArgs} />;
    } else {
      return <TaskerMyDisputedResolvedBidDetails request={request} {...otherArgs} />;
    }
  },

  [REQUEST_STATES.ARCHIVE]: ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
    return isSummaryView ? (
      <TaskerArchiveSummary request={request} {...otherArgs} />
    ) : (
      <TaskerArchiveDetails request={request} {...otherArgs} />
    );
  },
};

const getTaskerBidCard = (bid, isSummaryView, otherArgs) => {
  const { _requestRef } = bid;
  const state = _requestRef.state;
  try {
    switch (state) {
      case REQUEST_STATES.OPEN:
        try {
          const card = TaskerCardTemplates[state]({
            bid,
            request: _requestRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          getBugsnagClient().leaveBreadcrumb(
            'Error Loading getTaskerBidCard REQUEST_STATES.OPEN: Card',
          );
          getBugsnagClient().notify(e);
        }
        break;
      case REQUEST_STATES.AWARDED_SEEN:
      case REQUEST_STATES.AWARDED:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.AWARDED]({
            bid,
            request: _requestRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          getBugsnagClient().leaveBreadcrumb(
            ' Error Loading getTaskerBidCard REQUEST_STATES.AWARDED: Card',
          );
          getBugsnagClient().notify(e);
        }
        break;
      case REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN:
      case REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER]({
            bid,
            request: _requestRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          getBugsnagClient().leaveBreadcrumb(
            ' Error Loading getTaskerBidCard REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER: Card',
          );
          getBugsnagClient().notify(e);
        }
        break;
      case REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN:
      case REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER]({
            bid,
            request: _requestRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          getBugsnagClient().leaveBreadcrumb(
            ' Error Loading getTaskerBidCard REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER: Card',
          );
          getBugsnagClient().notify(e);
        }
        break;
      case REQUEST_STATES.DONE_SEEN:
      case REQUEST_STATES.DONE:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.DONE]({
            bid,
            request: _requestRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          getBugsnagClient().leaveBreadcrumb(
            '  Error Loading getTaskerBidCard REQUEST_STATES.DONE: Card',
          );
          getBugsnagClient().notify(e);
        }
      case REQUEST_STATES.ARCHIVE:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.ARCHIVE]({
            bid,
            request: _requestRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          getBugsnagClient().leaveBreadcrumb(
            'Error Loading getTaskerBidCard REQUEST_STATES.DONE: Card',
          );
          getBugsnagClient().notify(e);
        }
      case REQUEST_STATES.DISPUTED:
        try {
          const card = TaskerCardTemplates[REQUEST_STATES.DISPUTED]({
            bid,
            request: _requestRef,
            isSummaryView,
            pointOfView: POINT_OF_VIEW.TASKER,
            withBidDetails: true,
            otherArgs,
          });
          return card;
        } catch (e) {
          getBugsnagClient().leaveBreadcrumb(
            'Error Loading getTaskerBidCard REQUEST_STATES.DONE: Card',
          );
          getBugsnagClient().notify(e);
        }
      default:
        return <div>default unknown getTaskerBidCard state {state}</div>;
    }
  } catch (e) {
    getBugsnagClient().leaveBreadcrumb('Error Loading Tasker Card ' + state);
    getBugsnagClient().notify(e);

    return <div>Error Loading Tasker Card </div>;
  }
};

export const getMeTheRightBidCard = ({ bid, isSummaryView, ...otherArgs }) => {
  if (!bid || !bid._id) {
    getBugsnagClient().notify(new Error('no bid passed in'));
    return null; //return
  }
  if (isSummaryView === undefined) {
    getBugsnagClient().notify(new Error('Summary was not  passed in'));
    return;
  }
  if (!bid._requestRef) {
    getBugsnagClient().notify(new Error('no associated request for this bid passed in'));
    return; //return
  }
  return getTaskerBidCard(bid, isSummaryView, otherArgs);
};

export const getMeTheRightRequestCard = ({ request, isSummaryView, pointOfView, ...otherArgs }) => {
  if (!request || !request.templateId) {
    getBugsnagClient().notify(new Error('no request passed in'));
    return null; //return
  }
  if (isSummaryView === undefined || pointOfView === undefined) {
    getBugsnagClient().notify(new Error('Summary or Point ofView was not  passed in'));

    return;
  }
  const { state } = request;
  if (pointOfView === POINT_OF_VIEW.REQUESTER) {
    try {
      const card = requesterCardTemplates[state]({
        request,
        isSummaryView,
        pointOfView,
        otherArgs,
      });
      return card || <div>This type ain't found</div>;
    } catch (e) {
      getBugsnagClient().leaveBreadcrumb('Error Loading Requester Card');
      getBugsnagClient().notify(e);
      return <div>Error Loading Requester Card </div>;
    }
  }
  if (pointOfView === POINT_OF_VIEW.TASKER) {
    try {
      const card = TaskerCardTemplates[state]({
        request,
        isSummaryView,
        pointOfView,
        addBidDetails: false,
        otherArgs,
      });
      return card || <div>This type ain't found</div>;
    } catch (e) {
      getBugsnagClient().leaveBreadcrumb(' Error Loading Requester Card ' + state);
      getBugsnagClient().notify(e);
      return <div>Error Loading Requester Card </div>;
    }
  }
  return null;
};
