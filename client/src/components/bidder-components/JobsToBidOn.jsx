import React from 'react';

import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import JobSummaryView from '../JobSummaryView';

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
          <JobSummaryView footer={cardFooter} job={job} />
        </div>
      );
    });
};

const EmptyStateComponent = () => {
  return (
    <div className="card is-fullwidth">
      <div className="card-content">
        <div className="content has-text-centered">
          <div className="is-size-5">
            Sorry All jobs have been awarded to bidders , check again later.
          </div>
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
              <i className="fas fa-dollar-sign" /> Bid Now
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
