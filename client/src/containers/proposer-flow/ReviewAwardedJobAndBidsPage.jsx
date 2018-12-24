import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';

import { Spinner } from '../../components/Spinner';
import { getAwardedBidFullDetails } from '../../app-state/actions/jobActions';

import { BidderContactModal } from './components/BidderContactModal';

class ReviewAwardedJobAndBidsPage extends React.Component {
  constructor(props) {
    super(props);
    this.jobId = null;

    if (props.match && props.match.params && props.match.params.jobId) {
      this.jobId = props.match.params.jobId;
    }
    this.state = {
      showTimeLineDetails: false,
      jobUnderReview: {},
    };
  }

  componentDidMount() {
    const { a_getAwardedBidFullDetails } = this.props;

    if (!this.jobId) {
      switchRoute(ROUTES.CLIENT.PROPOSER.getMyOpenJobsAwardedJobsTab());
      return null;
    }

    a_getAwardedBidFullDetails(this.jobId);
  }

  showTimeLineDetails = (jobWithFullDetails) => {
    this.setState({ showTimeLineDetails: true, jobUnderReview: jobWithFullDetails });
  };
  hideTimeLineDetails = () => {
    this.setState({ showTimeLineDetails: false, jobUnderReview: {} });
  };

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

    const title = templatesRepo[selectedAwardedJob.fromTemplateId].title;
    const { showTimeLineDetails, jobUnderReview } = this.state;

    return (
      <section className="section">
        <div className="container">
          {showTimeLineDetails && (
            <BidderContactModal job={jobUnderReview} close={this.hideTimeLineDetails} />
          )}

          {!showTimeLineDetails && (
            <React.Fragment>
              {breadCrumbs({
                activePageTitle: title,
              })}

              <div className="columns is-multiline">
                <div className="column">
                  <div>hello</div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
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

const breadCrumbs = (props) => {
  const { activePageTitle } = props;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.myOpenJobs);
              }}
            >
              Awarded Jobs
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
