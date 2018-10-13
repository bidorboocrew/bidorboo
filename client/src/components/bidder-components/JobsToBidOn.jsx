import React from 'react';

import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import JobSummaryView from '../JobSummaryView';

export default class JobsToBidOn extends React.Component {

  render() {
    const {
      jobsList,
      currentUserId,
      selectJobToBidOn,
      isLoggedIn,
      showLoginDialog
    } = this.props;
    const postedJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        jobsList.map(job => {
          const { _ownerRef } = job;
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
              <JobSummaryView job={job} />
              <CardBottomSection
                _ownerRef={_ownerRef}
                isLoggedIn={isLoggedIn}
                currentUserId={currentUserId}
                showLoginDialog={showLoginDialog}
                selectJobToBidOn={selectJobToBidOn}
                job={job}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateComponent />
      );
    return <React.Fragment>{postedJobsList}</React.Fragment>;
  }
}

const EmptyStateComponent = () => {
  return (
    <React.Fragment>
      <div>
        Sorry All jobs have been awarded to bidders , check again later.
      </div>
      <div>
        <a
          className="button is-primary"
          onClick={() => {
            switchRoute(ROUTES.CLIENT.PROPOSER.root);
          }}
        >
          post a new job
        </a>
      </div>
    </React.Fragment>
  );
};

const CardBottomSection = props => {
  const {
    _ownerRef,
    isLoggedIn,
    currentUserId,
    showLoginDialog,
    selectJobToBidOn,
    job
  } = props;
  return (
    <React.Fragment>
      {(!isLoggedIn || _ownerRef._id !== currentUserId) && (
        <div className="has-text-centered" style={{ textAlign: 'center' }}>
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
            style={{ borderRadius: 0 }}
            className="button is-primary is-fullwidth is-large"
          >
            <span style={{ marginLeft: 4 }}>
              <i className="fas fa-dollar-sign" /> Bid Now
            </span>
          </a>
        </div>
      )}
      {isLoggedIn &&
        _ownerRef._id === currentUserId && (
          <div className="has-text-centered" style={{ textAlign: 'center' }}>
            <a
              style={{ borderRadius: 0 }}
              className="button is-static is-fullwidth disabled is-large"
            >
              My Job
            </a>
          </div>
        )}
    </React.Fragment>
  );
};
