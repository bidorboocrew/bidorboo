import React from 'react';
import moment from 'moment';
import windowSize from 'react-window-size';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute, BULMA_RESPONSIVE_SCREEN_SIZES } from '../../utils';

const TAB_IDS = {
  openRequests: 'Open Tasks',
  postedBids: 'Posted Bids',
  mine: 'Mine',
};

class JobsToBidOnListView extends React.Component {
  render() {
    const { jobsList, activeTab } = this.props;

    const postedJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        <React.Fragment>
          <div className="columns  is-multiline is-mobile">
            {activeTab === TAB_IDS.openRequests && <OtherPeoplesJobs {...this.props} />}

            {activeTab === TAB_IDS.mine && <MyJobs {...this.props} />}
          </div>
        </React.Fragment>
      ) : (
        <EmptyStateComponent />
      );
    return <React.Fragment>{postedJobsList}</React.Fragment>;
  }
}
export default windowSize(JobsToBidOnListView);

const OtherPeoplesJobs = (props) => {
  const { isLoggedIn, currentUserId, showLoginDialog, selectJobToBidOn, jobsList } = props;

  const otherPeopleJobs = jobsList.filter((job) => job._ownerRef._id !== currentUserId);

  const columnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(props)
    ? 'column is-half'
    : 'column is-one-fifth';

  const components = otherPeopleJobs.map((job) => {
    const cardFooter = (
      <CardBottomSection
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
        className={columnCount}
        onClick={() => {
          if (!isLoggedIn) {
            showLoginDialog(true);
          } else {
            selectJobToBidOn(job);
          }
        }}
      >
        <JobsToBidOnSummaryCard footer={cardFooter} job={job} />
      </div>
    );
  });
  return components && components.length > 0 ? components : null;
};

const MyJobs = (props) => {
  const { isLoggedIn, currentUserId, showLoginDialog, selectJobToBidOn, jobsList } = props;

  const myjobs = jobsList.filter((job) => job._ownerRef._id === currentUserId);
  const columnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(props)
    ? 'column is-half'
    : 'column is-one-fifth';

  const components = myjobs.map((job) => {
    const cardFooter = (
      <CardBottomSection
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
        className={columnCount}
        onClick={() => {
          if (!isLoggedIn) {
            showLoginDialog(true);
          } else {
            // selectJobToBidOn(job);
          }
        }}
      >
        <JobsToBidOnSummaryCard myJob footer={cardFooter} job={job} />
      </div>
    );
  });
  return components && components.length > 0 ? components : null;
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
              className="button is-primary "
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            >
              Request a Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardBottomSection = (props) => {
  const { isLoggedIn, showLoginDialog, selectJobToBidOn, job, currentUserId } = props;
  return null;
  return (
    <footer className="card-footer">
      {currentUserId !== job._ownerRef._id ? (
        <div className="card-footer-item">
          <a
            onClick={() => {
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                selectJobToBidOn(job);
              }
            }}
            className="button is-primary is-fullwidth"
          >
            View Details
          </a>
        </div>
      ) : (
        <div className="card-footer-item">
          <a disabled className="button is-outline is-fullwidth">
            My Request
          </a>
        </div>
      )}
    </footer>
  );
};

class JobsToBidOnSummaryCard extends React.Component {
  render() {
    const { job, specialStyle, footer, myJob } = this.props;
    const { startingDateAndTime, title, createdAt, fromTemplateId, _ownerRef, location } = job;
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
      <div
        style={newStyle}
        className={`card postedJobToBidOnCard is-clipped ${myJob ? 'disabled' : ''}`}
      >
        <header
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          className="card-header  is-clipped"
        >
          <p className="card-header-title">{`${templatesRepo[fromTemplateId].title}`}</p>
        </header>
        <div className="card-image is-clipped">
          <img
            className="bdb-cover-img"
            src={`${
              templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
                ? templatesRepo[fromTemplateId].imageUrl
                : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
            }`}
          />
        </div>
        <div style={{ paddingBottom: '0.25rem', paddingTop: '0.25rem' }} className="card-content">
          <div className="content">
            <div className="is-size-7">
              Due on:
              {startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`}
            </div>
            <div className="is-size-7">
              {/* Active since {createdAtToLocal} */}
              <span style={{ fontSize: '10px', color: 'grey' }}>
                {`posted (${daysSinceCreated} ago)`}
              </span>
            </div>
          </div>
        </div>
        {footer}
      </div>
    );
  }
}
