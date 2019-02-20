/**
 *
 * https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L628
 */

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllMyAwardedJobs } from '../app-state/actions/jobActions';
import { getMyAwardedBids } from '../app-state/actions/bidsActions';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { showLoginDialog } from '../app-state/actions/uiActions';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Spinner } from '../components/Spinner';

const localizer = BigCalendar.momentLocalizer(moment);
class MyAgenda extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyAwardedJobs();
    this.props.a_getMyAwardedBids();
  }

  getEvents = () => {
    const { awardedBidsList, myAwardedJobsList } = this.props;

    let awardedJobs = [];
    if (myAwardedJobsList && myAwardedJobsList.length > 0) {
      awardedJobs = myAwardedJobsList.map((job) => {
        const bidDetails = job._awardedBidRef;

        const { startingDateAndTime } = job;
        const selectedTime = `${moment(startingDateAndTime).get('hour')}`;
        let startTime = moment(startingDateAndTime).startOf('day');
        let endTime = moment(startingDateAndTime).endOf('day');

        switch (`${selectedTime}`) {
          case '10':
            startTime = moment(startingDateAndTime).startOf('day');
            endTime = moment(startingDateAndTime).endOf('day');
            break;
          case '8':
            startTime = moment(startingDateAndTime);
            endTime = moment(startingDateAndTime).add(4, 'h');
            break;
          case '12':
            startTime = moment(startingDateAndTime);
            endTime = moment(startingDateAndTime).add(5, 'h');
            break;
          case '17':
            startTime = moment(startingDateAndTime);
            endTime = moment(startingDateAndTime).endOf('day');
            break;
          default:
            startTime = moment(startingDateAndTime).startOf('day');
            endTime = moment(startingDateAndTime).endOf('day');
            break;
        }

        return {
          id: job._id,
          resource: `${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${job._id}`,
          title: `Requested: ${job.fromTemplateId}`,
          desc: `<p>BidOrBoo Tasker ${
            bidDetails._bidderRef.displayName
          } will be fullfilling this task.
          <br />
          Address :  ${job.addressText}
          <br />
          You will be charged ${bidDetails.bidAmount.value} CAD when the job is completed</p>`,
          start: moment(startTime).toDate(),
          end: moment(endTime).toDate(),
        };
      });
    }

    let awardedBids = [];
    if (awardedBidsList && awardedBidsList.length > 0) {
      awardedBids = awardedBidsList.map((bid) => {
        const jobDetails = bid._jobRef;

        const { startingDateAndTime } = jobDetails;
        const selectedTime = `${moment(startingDateAndTime).get('hour')}`;
        let startTime = moment(startingDateAndTime).startOf('day');
        let endTime = moment(startingDateAndTime).endOf('day');

        switch (`${selectedTime}`) {
          case '10':
            startTime = moment(startingDateAndTime).startOf('day');
            endTime = moment(startingDateAndTime).endOf('day');
            break;
          case '8':
            startTime = moment(startingDateAndTime);
            endTime = moment(startingDateAndTime).add(4, 'h');
            break;
          case '12':
            startTime = moment(startingDateAndTime);
            endTime = moment(startingDateAndTime).add(5, 'h');
            break;
          case '17':
            startTime = moment(startingDateAndTime);
            endTime = moment(startingDateAndTime).endOf('day');
            break;
          default:
            startTime = moment(startingDateAndTime).startOf('day');
            endTime = moment(startingDateAndTime).endOf('day');
            break;
        }

        return {
          id: jobDetails._id,
          resource: `${ROUTES.CLIENT.BIDDER.currentAwardedBid}/${bid._id}`,
          title: `Awarded: ${bid.bidAmount.value} CAD`,
          desc: `<p>BidOrBoo user ${
            jobDetails._ownerRef.displayName
          } requested your help to fulfill this task.
          <br />
          Task Type : ${jobDetails.fromTemplateId}
          <br />
          Address :  ${jobDetails.addressText}
          <br />
          Once the job is fullfilled you will recieve ${bid.bidAmount.value} CAD</p>`,
          start: moment(startTime).toDate(),
          end: moment(endTime).toDate(),
        };
      });
    }

    return [...awardedJobs, ...awardedBids];
  };

  render() {
    const {
      isLoggedIn,
      awardedBidsList,
      isLoadingAwardedBids,
      myAwardedJobsList,
      isLoadingAwardedJobs,
    } = this.props;

    if (!isLoggedIn) {
      return null;
    }

    if (isLoadingAwardedBids || isLoadingAwardedJobs) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={isLoadingAwardedBids || isLoadingAwardedJobs} size={'large'} />;
        </div>
      );
    }

    const allCalendarEvents = this.getEvents();
    let calendarViews = ['month', 'week', 'day', 'agenda'];

    return (
      <div className="container is-widescreen">
        <BigCalendar
          localizer={localizer}
          events={allCalendarEvents}
          views={calendarViews}
          defaultView={BigCalendar.Views.WEEK}
          components={{
            event: Event,
            agenda: {
              event: EventAgenda,
            },
            day: {
              event: EventDay,
            },
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer, bidsReducer, jobsReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    awardedBidsList: bidsReducer.awardedBidsList,
    isLoadingAwardedBids: bidsReducer.isLoadingBids,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    isLoadingAwardedJobs: jobsReducer.isLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_getAllMyAwardedJobs: bindActionCreators(getAllMyAwardedJobs, dispatch),
    a_getMyAwardedBids: bindActionCreators(getMyAwardedBids, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAgenda);

const Event = ({ event }) => {
  return (
    <span>
      <strong className="has-text-white">{event.title}</strong>
      <br />
      {/* <p className="has-text-white is-size-7" dangerouslySetInnerHTML={{ __html: event.desc }} /> */}
      <a
        className="has-text-white"
        style={{ textDecoration: 'underline' }}
        onClick={() => {
          switchRoute(event.resource);
        }}
      >
        view details
      </a>
    </span>
  );
};

const EventDay = ({ event }) => {
  return (
    <div>
      <strong className="has-text-white">{event.title}</strong>
      <br /> <br />
      <p className="has-text-white is-size-7" dangerouslySetInnerHTML={{ __html: event.desc }} />
      <br />
      <a
        className="has-text-white is-small"
        style={{ textDecoration: 'underline' }}
        onClick={() => {
          switchRoute(event.resource);
        }}
      >
        view details
      </a>
    </div>
  );
};

const EventAgenda = ({ event }) => {
  return (
    <span>
      <span
        className="has-text-weight-bold is-size-6"
        dangerouslySetInnerHTML={{ __html: event.title }}
      />
      <p className="has-text-dark is-size-7" dangerouslySetInnerHTML={{ __html: event.desc }} />
      <a
        onClick={() => {
          switchRoute(event.resource);
        }}
      >
        view details
      </a>
    </span>
  );
};

// let components = {
//   event: MyEvent, // used by each view (Month, Day, Week)
//   eventWrapper: MyEventWrapper,
//   eventContainerWrapper: MyEventContainerWrapper,
//   dayWrapper: MyDayWrapper,
//   dateCellWrapper: MyDateCellWrapper,
//   timeSlotWrapper: MyTimeSlotWrapper,
//   timeGutterHeader: MyTimeGutterWrapper,
//   toolbar: MyToolbar,
//   agenda: {
//     event: MyAgendaEvent, // with the agenda view use a different component to render events
//     time: MyAgendaTime,
//     date: MyAgendaDate,
//   },
//   day: {
//     header: MyDayHeader,
//     event: MyDayEvent,
//   },
//   week: {
//     header: MyWeekHeader,
//     event: MyWeekEvent,
//   },
//   month: {
//     header: MyMonthHeader,
//     dateHeader: MyMonthDateHeader,
//     event: MyMonthEvent,
//   },
// };
