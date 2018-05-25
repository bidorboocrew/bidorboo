import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';

import { switchRoute } from '../app-state/actions/routerActions';
import { submitBid } from '../app-state/actions/bidActions';

import * as ROUTES from '../constants/frontend-route-consts';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import PostYourBid from '../components/PostYourBid';
class BidderBidNow extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    s_jobDetails: PropTypes.shape({
      state: PropTypes.string,
      _id: PropTypes.string,
      createdAt: PropTypes.string,
      fromTemplateId: PropTypes.string,
      startingDateAndTime: PropTypes.shape({
        date: PropTypes.string,
        hours: PropTypes.number,
        minutes: PropTypes.number,
        period: PropTypes.string
      }),
      detailedDescription: PropTypes.string,
      title: PropTypes.string,
      _ownerId: PropTypes.shape({
        profileImgUrl: PropTypes.string,
        displayName: PropTypes.string
      })
    }),
    a_switchRoute: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { a_switchRoute, s_jobDetails, a_submitBid } = this.props;

    //if user tried to manually set the url to this page without selecting a job
    if (!s_jobDetails || !s_jobDetails._ownerId) {
      //reroute them to bidder root
      this.props.a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
    }

    return (
      <div className="slide-in-left" id="bdb-bidder-bidNow">
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
                  }}
                >
                  Bidder
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">bidding on - {s_jobDetails.title}</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer">
          <div className="container">
            <div className="columns">
              <div className="column is-one-third is-clipped">
                <PostYourBid
                  onSubmit={values => {
                    alert('not implemented yet');
                  }}
                  onCancel={() => {
                    a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root);
                  }}
                />
              </div>

              <div className="column is-clipped">
                <JobDetailsReviewCard
                  onSubmit={a_submitBid}
                  onCancel={() =>
                    a_switchRoute(ROUTES.FRONTENDROUTES.BIDDER.root)
                  }
                  jobDetails={s_jobDetails}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ bidsReducer }) => {
  return {
    s_jobDetails: bidsReducer.jobDetails
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_submitBid: bindActionCreators(submitBid, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BidderBidNow);

class JobDetailsReviewCard extends React.Component {
  render() {
    const { jobDetails } = this.props;

    if (!jobDetails || !jobDetails._ownerId) {
      return null;
    }
    const {
      state,
      _id,
      createdAt,
      fromTemplateId,
      durationOfJob,
      startingDateAndTime,
      title,
      _ownerId,
      detailedDescription
    } = jobDetails;

    const { profileImgUrl, displayName } = _ownerId;
    const { hours, minutes, period } = startingDateAndTime;
    let daysSinceCreated = '';
    let createdAtToLocal = '';

    try {
      daysSinceCreated = createdAt
        ? moment.duration(moment().diff(moment(createdAt))).humanize()
        : 0;
      createdAtToLocal = moment(createdAt)
        .local()
        .format('YYYY-MM-DD hh:mm A');
    } catch (e) {
      console.error(e);
    }

    return (
      <div className="card">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header"
        >
          <p className="card-header-title">{title || 'Job Title'} details</p>
        </header>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-32x32">
                <img src={profileImgUrl} alt="user" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-12">{displayName}</p>
            </div>
          </div>

          <div className="content">
            <p className="heading">
              <span>Job Type</span>
              <br />
              <span className="has-text-weight-semibold">
                {templatesRepo[fromTemplateId].title || 'not specified'}
              </span>
            </p>
            <p className="heading">
              <span>Active since</span>
              <br />
              <span className="has-text-weight-semibold">
                {createdAtToLocal}
                <span style={{ fontSize: '10px', color: 'grey' }}>
                  {` (${daysSinceCreated} ago)`}
                </span>
              </span>
            </p>
            <p className="heading">
              <span>Start Date</span>
              <br />
              <span className="has-text-weight-semibold">
                {startingDateAndTime &&
                  moment(startingDateAndTime.date).format('MMMM Do YYYY')}
              </span>
            </p>
            <p className="heading">
              <span>Start Time</span>
              <br />
              <span className="has-text-weight-semibold">
                {hours}:{minutes === 0 ? '00' : minutes} {period}
              </span>
            </p>
            <p className="heading">
              <span>Duration Required</span>
              <br />
              <span className="has-text-weight-semibold">
                {durationOfJob || 'not specified'}
              </span>
            </p>
            <p className="heading">
              <span>Detailed Description</span>
              <br />
              <span className="has-text-weight-semibold">
                {detailedDescription || 'not specified'}
              </span>
            </p>
          </div>
        </div>
        <div className="card-image is-clipped">
          <figure className="image is-3by1">
            <img
              src={
                templatesRepo[fromTemplateId] &&
                templatesRepo[fromTemplateId].imageUrl
                  ? templatesRepo[fromTemplateId].imageUrl
                  : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
              }
              alt="Placeholder image"
            />
          </figure>
        </div>
      </div>
    );
  }
}
