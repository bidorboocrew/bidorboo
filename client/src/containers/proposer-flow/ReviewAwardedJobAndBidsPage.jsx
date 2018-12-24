import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import { Spinner } from '../../components/Spinner';
import { getAwardedBidFullDetails } from '../../app-state/actions/jobActions';

import JobFullDetailsCard from './components/JobFullDetailsCard';
import BidAndBidderFullDetails from './components/BidAndBidderFullDetails';

class ReviewAwardedJobAndBidsPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;

    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    }
  }

  componentDidMount() {
    const { a_getAwardedBidFullDetails } = this.props;

    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.getMyOpenJobsAwardedJobsTab());
      return null;
    }

    a_getAwardedBidFullDetails(this.jobId);
  }

  render() {
    const { selectedAwardedJob } = this.props;

    if (!selectedAwardedJob || !selectedAwardedJob._id) {
      return (
        <section className="section">
          <div className="container">
            <Spinner isLoading={true} size={'large'} />
          </div>
        </section>
      );
    }

    const { _awardedBidRef } = selectedAwardedJob;
    const title = templatesRepo[selectedAwardedJob.fromTemplateId].title;

    return (
      <div className="bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div>
              <h1 style={{ color: 'white' }} className="title">
                My Requests
              </h1>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            {breadCrumbs({
              activePageTitle: title,
            })}
            <div className="columns is-multiline">
              <div className="column">
                <BidAndBidderFullDetails bid={_awardedBidRef} job={selectedAwardedJob} />
              </div>
              <div className="column">
                <JobFullDetailsCard job={selectedAwardedJob} />
              </div>
            </div>
          </div>
        </section>
      </div>
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

const breadCrumbs = (props) => {
  const { activePageTitle } = props;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.getMyOpenJobsAwardedJobsTab());
              }}
            >
              Awarded
            </a>
          </li>
          <li className="is-active">
            <a aria-current="page">{activePageTitle}</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
