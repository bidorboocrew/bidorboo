import React from 'react';
import moment from 'moment';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

export default class JobsToBidOn extends React.Component {
  render() {
    const { jobsList } = this.props;

    const postedJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        <React.Fragment>
          <OtherPeoplesJobs {...this.props} />
          {/* <MyJobs {...this.props} /> */}
        </React.Fragment>
      ) : (
        <EmptyStateComponent />
      );
    return <React.Fragment>{postedJobsList}</React.Fragment>;
  }
}

const OtherPeoplesJobs = (props) => {
  const { isLoggedIn, currentUserId, showLoginDialog, selectJobToBidOn, jobsList } = props;

  return jobsList
    .filter((job) => {
      const { _ownerRef } = job;
      return !isLoggedIn || _ownerRef._id !== currentUserId;
    })
    .map((job) => {
      const { _ownerRef } = job;

      const cardFooter = (
        <CardBottomSection
          _ownerRef={_ownerRef}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
          showLoginDialog={showLoginDialog}
          selectJobToBidOn={selectJobToBidOn}
          job={job}
        />
      );
      return (
        <div
          key={job._id}
          className="column is-one-third"
          onClick={() => {
            if (!isLoggedIn) {
              showLoginDialog(true);
            } else {
              if (_ownerRef._id !== currentUserId) {
                selectJobToBidOn(job);
              }
            }
          }}
        >
          <JobsToBidOnSummaryCard footer={cardFooter} job={job} />
        </div>
      );
    });
};

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">Couldn't find any. please check again later!</div>
            <br />
            <a
              className="button is-primary is-large"
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            >
              Create A Job
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardBottomSection = (props) => {
  const {
    _ownerRef,
    isLoggedIn,
    currentUserId,
    showLoginDialog,
    selectJobToBidOn,
    job,
    isOwnerTheSameAsLoggedInUser,
  } = props;

  return (
    <footer className="card-footer">
      <div className="card-footer-item">
        {!isOwnerTheSameAsLoggedInUser && (
          <a
            onClick={() => {
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                if (_ownerRef._id !== currentUserId) {
                  selectJobToBidOn(job);
                }
              }
            }}
            className="button is-primary is-fullwidth is-large"
          >
            <span style={{ marginLeft: 4 }}>
              <i className="fas fa-dollar-sign" /> {`Review & Bid`}
            </span>
          </a>
        )}
        {isOwnerTheSameAsLoggedInUser && (
          <a className="button is-static is-fullwidth disabled is-large">My Job</a>
        )}
      </div>
    </footer>
  );
};

class JobsToBidOnSummaryCard extends React.Component {
  render() {
    const { job, specialStyle, footer } = this.props;
    const { startingDateAndTime, title, createdAt, fromTemplateId, _ownerRef } = job;
    let temp = _ownerRef ? _ownerRef : { profileImage: '', displayName: '' };

    const { profileImage, displayName } = temp;

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
      //xxx we dont wana fail simply cuz we did not get the diff in time
      console.error(e);
    }

    const newStyle = { ...specialStyle, height: '100%' };
    return (
      <div style={newStyle} className="card postedJobToBidOnCard is-clipped">
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header  is-clipped"
        >
          <p className="card-header-title">{title || 'Job Title'}</p>
        </header>
        <div className="card-image is-clipped">
          <figure className="image is-3by1">
            <img
              src={
                templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
                  ? templatesRepo[fromTemplateId].imageUrl
                  : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
              }
              alt="Placeholder"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              {profileImage && profileImage.url && (
                <figure style={{ margin: '0 auto' }} className="image is-32x32">
                  <img src={profileImage.url} alt="user" />
                </figure>
              )}
            </div>
            <div className="media-content">
              <p className="title is-6">{displayName}</p>
              {/* <p className="subtitle is-6">{email}</p> */}
            </div>
          </div>
          <div className="content">
            <p className="heading">
              Active since {createdAtToLocal}
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {` (${daysSinceCreated} ago)`}
              </span>
            </p>
            <p className="heading">
              Start Date
              {startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </p>
          </div>
        </div>
        {footer}
      </div>
    );
  }
}
