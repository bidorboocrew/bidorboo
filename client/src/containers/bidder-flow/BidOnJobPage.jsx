import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { getJobToBidOnDetails } from '../../app-state/actions/bidsActions';

import PostYourBid from '../../components/forms/PostYourBid';
import { updateBooedBy } from '../../app-state/actions/jobActions';

import { findAvgBidInBidList } from '../commonComponents';
import { Spinner } from '../../components/Spinner';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightRequestCard';

class BidOnJobPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recaptchaField: '',
    };

    this.recaptchaRef = React.createRef();
  }

  updateRecaptchaField = (value) => {
    this.setState({ recaptchaField: value });
  };

  // componentDidUpdate(prevProps) {
  //   const newJobDetailsShowedUp = !prevProps.jobDetails && this.props.jobDetails;
  //   const jobTobidOnExists = prevProps.jobDetails && this.props.jobDetails;
  //   const differentJobId =
  //     jobTobidOnExists && prevProps.jobDetails._id !== this.props.jobDetails._id;

  //   if (newJobDetailsShowedUp || differentJobId) {
  //     this.setState({ jobDetails: this.props.jobDetails });
  //   }
  // }

  componentDidMount() {
    const { match, getJobToBidOnDetails } = this.props;
    const { jobDetails } = this.state;
    if (!jobDetails || !jobDetails._id) {
      if (match.params && match.params.jobId) {
        getJobToBidOnDetails(match.params.jobId);
      }
    }
    if (this.recaptchaRef && this.recaptchaRef.current && this.recaptchaRef.current.execute) {
      this.recaptchaRef.current.execute();
    }
  }
  render() {
    const { submitBid, isLoggedIn, jobDetails } = this.props;
    const { recaptchaField } = this.state;
    let dontShowThisPage = !jobDetails || !jobDetails._id || !jobDetails._ownerRef || !isLoggedIn;
    if (dontShowThisPage) {
      return (
        <section className="section">
          <Spinner isLoading size={'large'} />
        </section>
      );
    }
    let avgBid = 0;
    if (jobDetails && jobDetails._bidsListRef && jobDetails._bidsListRef.length > 0) {
      avgBid = findAvgBidInBidList(jobDetails._bidsListRef);
    }

    return (
      <div className="container is-widescreen">
        <div className="columns is-centered">
          <div className="column is-narrow">
            {breadCrumbs()}
            <PostYourBid
              avgBid={avgBid}
              onSubmit={(values) => {
                submitBid({
                  jobId: jobDetails._id,
                  bidAmount: values.bidAmountField,
                  recaptchaField: values.recaptchaField,
                });
              }}
              onCancel={() => {
                // updateBooedBy(jobDetails);
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            />
            {getMeTheRightRequestCard({
              job: jobDetails,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.TASKER,
            })}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ bidsReducer, userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    jobDetails: bidsReducer.jobToBidOnDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    submitBid: bindActionCreators(submitBid, dispatch),
    updateBooedBy: bindActionCreators(updateBooedBy, dispatch),
    getJobToBidOnDetails: bindActionCreators(getJobToBidOnDetails, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidOnJobPage);

const breadCrumbs = () => {
  return (
    <div style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            >
              All Requests
            </a>
          </li>

          <li className="is-active">
            <a>Bid Now!</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
