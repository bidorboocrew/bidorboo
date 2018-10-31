/**
 * This will handle showing details of the job when user
 * - selects 1 job
 * - posts a new job
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { addJob, awardBidder } from '../../app-state/actions/jobActions';
import OwnersJobDetailsCard from '../../components/proposer-components/OwnersJobDetailsCard';

import { switchRoute } from '../../utils';

class CurrentAddedJob extends React.Component {
  render() {
    const { selectedActiveJob, userDetails, a_awardBidder } = this.props;
    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav style={{ marginLeft: '1rem' }} className="breadcrumb" aria-label="breadcrumbs">
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
                <a aria-current="page">Selected Job</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer slide-in-left">
          <div className="container">
            <OwnersJobDetailsCard
              currentUser={userDetails}
              job={selectedActiveJob}
              awardBidder={a_awardBidder}
            />
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    selectedActiveJob: jobsReducer.selectedActiveJob,
    userDetails: userModelReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_addJob: bindActionCreators(addJob, dispatch),
    a_awardBidder: bindActionCreators(awardBidder, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentAddedJob);
