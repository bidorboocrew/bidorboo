import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { getAwardedBidFullDetails } from '../../app-state/actions/jobActions';
import AwardedJobFullDetailsCard from '../../components/proposer-components/AwardedJobFullDetailsCard';

import { switchRoute } from '../../utils';

class ReviewAwardedJobAndBidsPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;

    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    }
    this.state = {
      showTimeLineDetails: false,
    };
  }

  componentDidMount() {
    const { a_getAwardedBidFullDetails } = this.props;

    if (!a_getAwardedBidFullDetails || !this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.awardedJobsPage);
      return null;
    }

    a_getAwardedBidFullDetails(this.jobId);
  }

  render() {
    const { selectedAwardedJob, userDetails } = this.props;
    const breadCrumb = () => (
      <div style={{ marginBottom: '1rem', marginTop: '1rem' }} className="container">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
                }}
              >
                My Jobs
              </a>
            </li>
            <li className="is-active">
              <a aria-current="page">Selected Service</a>
            </li>
          </ul>
        </nav>
      </div>
    );

    return (
      <section className="bdbPage slide-in-left">
        {selectedAwardedJob && selectedAwardedJob._id ? (
          <AwardedJobFullDetailsCard
            breadCrumb={breadCrumb()}
            currentUser={userDetails}
            job={selectedAwardedJob}
          />
        ) : null}
      </section>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_getAwardedBidFullDetails: bindActionCreators(getAwardedBidFullDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAwardedJobAndBidsPage);
