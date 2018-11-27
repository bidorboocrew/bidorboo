import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllMyAwardedJobs } from '../../app-state/actions/jobActions';

import AwardedJobsList from '../../components/proposer-components/AwardedJobsList';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class MyJobs extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyAwardedJobs();
  }

  render() {
    const { myAwardedJobsList, userDetails } = this.props;

    const myEventsList =
      myAwardedJobsList &&
      myAwardedJobsList.map((awardedJob) => {
        const date = awardedJob.startingDateAndTime && awardedJob.startingDateAndTime.date;

        if (date) {
          let eventStartDate = moment(date);

          eventStartDate = eventStartDate.set({
            hour: awardedJob.startingDateAndTime.hours,
            minute: awardedJob.startingDateAndTime.minutes,
          });

          return {
            id: awardedJob._id,
            title: awardedJob.fromTemplateId,
            allDay: true,
            start: eventStartDate,
            end: eventStartDate,
          };
        }
      });
    return (
      <div className="slide-in-left bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div className="container is-fluid">
              <h1 style={{ color: 'white' }} className="title">
                Request Queue
              </h1>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container is-fluid">
            <div style={{ padding: '1rem', background: 'white' }}>
              <BigCalendar
                localizer={localizer}
                events={myEventsList}
                step={60}
                defaultDate={new Date()}
              />
            </div>
          </div>
        </section>
        <div className="container is-fluid">
          <div className="columns is-multiline">
            <AwardedJobsList userDetails={userDetails} jobsList={myAwardedJobsList} />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    error: jobsReducer.error,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllMyAwardedJobs: bindActionCreators(getAllMyAwardedJobs, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyJobs);
