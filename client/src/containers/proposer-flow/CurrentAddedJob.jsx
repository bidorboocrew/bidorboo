/**
 * This will handle showing details of the job when user
 * - selects 1 job
 * - posts a new job
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { addJob } from '../../app-state/actions/jobActions';
import { Proptypes_jobModel } from '../../client-server-interfaces';
import PostedJobConfirmationCard from '../../components/proposer-components/PostedJobConfirmationCard';
import { switchRoute } from '../../utils';


class CurrentAddedJob extends React.Component {
  static propTypes = {
    s_recentlyUpdatedJob: Proptypes_jobModel
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { s_recentlyUpdatedJob, s_userDetails } = this.props;
    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.PROPOSER.myjobs);
                  }}
                >
                  My Jobs
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Current Job</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer slide-in-left">
          <div className="container" id="bdb-proposer-content">
            <div className="columns">
              <div className="column is-8 is-offset-2">
                <PostedJobConfirmationCard
                  userDetails={s_userDetails}
                  jobDetails={s_recentlyUpdatedJob}
                />
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    s_recentlyUpdatedJob: jobsReducer.recentlyUpdatedJob,
    s_userDetails: userModelReducer.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_addJob: bindActionCreators(addJob, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentAddedJob);
