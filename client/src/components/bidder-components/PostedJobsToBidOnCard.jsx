import React from 'react';

import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import CommonJobSummaryCard from '../CommonJobSummaryCard';

export default class PostedJobsToBidOnCard extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    showLoginDialog: PropTypes.func,
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
        _bidsList: PropTypes.array,
        _ownerId: PropTypes.shape({
          displayName: PropTypes.string,
          profileImage: PropTypes.shape({
            url: PropTypes.string.isRequired,
            public_id: PropTypes.string
          })
        })
      })
    ),
    currentUserId: PropTypes.string,
    selectJobToBidOn: PropTypes.func.isRequired
  };

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
          const { _ownerId } = job;
          return (
            <div
              key={job._id}
              className="column is-one-third"
              onClick={() => {
                if (!isLoggedIn) {
                  showLoginDialog(true);
                } else {
                  if (_ownerId._id !== currentUserId) {
                    selectJobToBidOn(job);
                  }
                }
              }}
            >
              <CommonJobSummaryCard job={job} />
              <CardBottomSection
                _ownerId={_ownerId}
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
    _ownerId,
    isLoggedIn,
    currentUserId,
    showLoginDialog,
    selectJobToBidOn,
    job
  } = props;
  return (
    <React.Fragment>
      {(!isLoggedIn || _ownerId._id !== currentUserId) && (
        <div className="has-text-centered" style={{ textAlign: 'center' }}>
          <a
            onClick={() => {
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                if (_ownerId._id !== currentUserId) {
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
        _ownerId._id === currentUserId && (
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
