import React from 'react';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import PropTypes from 'prop-types';
import * as ROUTES from '../constants/route-const';
import classNames from 'classnames';
import autoBind from 'react-autobind';
import moment from 'moment';

class MyJobCards extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    jobsList: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        createdAt: PropTypes.string,
        addressText: PropTypes.string,
        durationOfJob: PropTypes.string,
        location: PropTypes.shape({
          coordinates: PropTypes.arrayOf(PropTypes.number),
          type: PropTypes.string
        }),
        startingDateAndTime: PropTypes.shape({
          date: PropTypes.string,
          hours: PropTypes.number,
          minutes: PropTypes.number,
          period: PropTypes.string
        }),
        state: PropTypes.string,
        title: PropTypes.string,
        updatedAt: PropTypes.string,
        whoSeenThis: PropTypes.array,
        _bidsList: PropTypes.array
      })
    )
    // switchRoute: PropTypes.func.isRequired
  };

  render() {
    const { jobsList } = this.props;
    const MyJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        jobsList.map(job => <JobCard key={job._id} jobObj={job} />)
      ) : (
        <React.Fragment>
          <div>Sorry you have not posted any jobs</div>
          <div>
            <button>post jobs</button>
          </div>
        </React.Fragment>
      );
    return <React.Fragment>{MyJobsList}</React.Fragment>;
  }
}

export default MyJobCards;

class JobCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentActiveTab: 'SummaryTab' };
    autoBind(this, 'switchActiveTab');
  }

  switchActiveTab(selectedTab) {
    console.log(selectedTab);
    this.setState({ currentActiveTab: selectedTab });
  }
  render() {
    const { jobObj } = this.props;

    // alter active tab
    const isSummaryTabActive = classNames({
      'is-active': this.state.currentActiveTab === 'SummaryTab'
    });
    const isDetailsTabActive = classNames({
      'is-active': this.state.currentActiveTab === 'JobDetailsTab'
    });

    return (
      <div className="panel column is-12 ">
        <div className="tabs is-marginless">
          <ul>
            <li
              style={{
                borderLeft: '1px solid #dbdbdb',
                borderTop: '1px solid #dbdbdb',
                borderRight: '1px solid #dbdbdb'
              }}
              className={isSummaryTabActive}
            >
              <a onClick={() => this.switchActiveTab('SummaryTab')}>Summary</a>
            </li>
            <li
              className={isDetailsTabActive}
              style={{
                borderLeft: '1px solid #dbdbdb',
                borderTop: '1px solid #dbdbdb',
                borderRight: '1px solid #dbdbdb'
              }}
            >
              <a onClick={() => this.switchActiveTab('JobDetailsTab')}>
                Job Details
              </a>
            </li>
          </ul>
        </div>

        {this.state.currentActiveTab === 'SummaryTab' && (
          <div className="postedJobCard">
            <div
              style={{
                borderBottom: 'none',
                borderRight: '1px solid #dbdbdb',
                borderLeft: '1px solid #dbdbdb',
                borderTop: '1px solid #dbdbdb'
              }}
              className={`panel-block ${isSummaryTabActive}`}
            >
              <SummaryView jobObj={jobObj} />
            </div>
            <div
              style={{ border: 'none' }}
              className="panel-block is-paddingless is-marginless"
            >
              <button
                style={{ borderRadius: 0 }}
                className="button is-link is-outlined is-fullwidth is-meduim"
              >
                Review and Award Bids
              </button>
            </div>
          </div>
        )}
        {this.state.currentActiveTab === 'JobDetailsTab' && (
          <div className="postedJobCard">
            <div
              style={{
                border: '1px solid #dbdbdb'
              }}
              className={`panel-block ${isDetailsTabActive}`}
            >
              <DetailedView jobObj={jobObj} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

class SummaryView extends React.Component {
  render() {
    const {
      state,
      addressText,
      durationOfJob,
      location,
      startingDateAndTime,
      title,
      updatedAt,
      whoSeenThis,
      createdAt,
      _bidsList
    } = this.props.jobObj;
    try {
      const daysSinceCreated = createdAt
        ? moment
            .duration(moment().diff(moment('2018-04-21T03:28:35.094Z')))
            .humanize()
        : 0;
    } catch (e) {
      console.error(e);
    }

    return (
      <React.Fragment>
        <div className="tile is-parent is-vertical is-paddingless">
          <div className="tile is-child">
            <article className="media">
              {/* <figure className="media-left">
              <p className="image is-64x64">
                <img src="https://bulma.io/images/placeholders/128x128.png" />
              </p>
            </figure> */}
              <div className="media-content">
                <div className="content">
                  <div className="level">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Job Title</p>
                        <p className="title">{title}</p>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Active since</p>
                        <p className="title">
                          {createdAt
                            ? `${moment
                                .duration(
                                  moment().diff(
                                    moment('2018-04-21T03:28:35.094Z')
                                  )
                                )
                                .days()} days`
                            : null}
                        </p>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Start Date</p>
                        <p className="title">
                          {startingDateAndTime &&
                            moment(startingDateAndTime.date).format(
                              'MMMM Do YYYY'
                            )}
                        </p>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Status</p>
                        <p className="title">{state}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div className="tile is-child">
            <div className="card">
              {_bidsList &&
                _bidsList.map &&
                _bidsList.length > 0 && (
                  <header className="card-header">
                    <div
                      style={{ paddingBottom: 10, paddingTop: 10 }}
                      className="card-header-title card-content"
                    >
                      <span style={{ padding: '0.5rem 0.75rem' }}>Bids</span>
                    </div>
                  </header>
                )}
              <div className="card-content">
                <div className="content">
                  <BidsTable bidList={_bidsList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class BidsTable extends React.Component {
  render() {
    const { bidList } = this.props;
    const BidsTable =
      bidList && bidList.map && bidList.length > 0 ? (
        <table className="table is-full-width">
          <thead>
            <tr>
              <th>#</th>
              <th>Bidder Rating</th>
              <th>Bid Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>5 stars</td>
              <td>38$</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="table is-full-width">
          <thead>
            <tr>
              <th>No Bidders</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                No Bids Yet, Keep an eye and check again in a little while
              </td>
            </tr>
          </tbody>
        </table>
      );
    return <React.Fragment>{BidsTable}</React.Fragment>;
  }
}

class DetailedView extends React.Component {
  render() {
    const {
      state,
      addressText,
      durationOfJob,
      location,
      startingDateAndTime,
      title,
      updatedAt,
      whoSeenThis,
      createdAt,
      _bidsList,
      _ownerId,
      _id
    } = this.props.jobObj;

    return (
      <div className="card">
        <div className="card-content">
          <div className="content">
            <div> Development view , details </div>
            <div>state : {state}</div>
            <div>addressText : {addressText}</div>
            <div>durationOfJob : {durationOfJob}</div>
            <div>location : {JSON.stringify(location)}</div>
            <div>title : {title}</div>
            <div>whoSeenThis : {JSON.stringify(whoSeenThis)}</div>
            <div>updatedAt : {updatedAt}</div>
            <div>_bidsList : {JSON.stringify(_bidsList)}</div>
            <div>_ownerId : {JSON.stringify(_ownerId)}</div>
            <div>jobId : {JSON.stringify(_id)}</div>
          </div>
        </div>
        <footer className="card-footer">
          <div>
            this is a dev view only and will be replaced with more user friendly
            details soon
          </div>
        </footer>
      </div>
    );
  }
}
