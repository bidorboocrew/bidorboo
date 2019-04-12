import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReCAPTCHA from 'react-google-recaptcha';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { getJobToBidOnDetails } from '../../app-state/actions/bidsActions';

import PostYourBid from '../../components/forms/PostYourBid';
import { updateBooedBy } from '../../app-state/actions/jobActions';

import { findAvgBidInBidList } from '../commonComponents';
import { Spinner } from '../../components/Spinner';

import getBidOnFullDetailsCardByTemplateJobId from '../../bdb-tasks/getBidOnFullDetailsCardByTemplateJobId';

class BidOnJobPage extends React.Component {
  constructor(props) {
    super(props);
    const { location } = props;

    this.state = {
      recaptchaField: '',
      jobDetails: location.state && location.state.jobDetails,
    };

    this.recaptchaRef = React.createRef();
  }

  updateRecaptchaField = (value) => {
    this.setState({ recaptchaField: value });
  };

  componentDidUpdate(prevProps) {
    const newJobDetailsShowedUp = !prevProps.jobDetails && this.props.jobDetails;
    const jobTobidOnExists = prevProps.jobDetails && this.props.jobDetails;
    const differentJobId =
      jobTobidOnExists && prevProps.jobDetails._id !== this.props.jobDetails._id;

    if (newJobDetailsShowedUp || differentJobId) {
      this.setState({ jobDetails: this.props.jobDetails });
    }
  }

  componentDidMount() {
    const { match, getJobToBidOnDetails } = this.props;
    const { jobDetails } = this.state;
    if (!jobDetails || !jobDetails._id) {
      if (match.params && match.params.jobId) {
        getJobToBidOnDetails(match.params.jobId);
      }
    }
    if (this.recaptchaRef.current) {
      this.recaptchaRef.current.execute();
    }
  }
  render() {
    const { submitBid, updateBooedBy, isLoggedIn } = this.props;
    const { jobDetails } = this.state;
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
      <React.Fragment>
        <ReCAPTCHA
          style={{ display: 'none' }}
          onExpired={() => this.recaptchaRef.current.execute()}
          ref={this.recaptchaRef}
          size="invisible"
          badge="bottomright"
          onChange={this.updateRecaptchaField}
          sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
        />
        <div style={{ marginBottom: '3rem' }} className="container is-widescreen">
          {breadCrumbs()}
          <PostYourBid
            avgBid={avgBid}
            onSubmit={(values) => {
              submitBid({
                jobId: jobDetails._id,
                bidAmount: values.bidAmountField,
                recaptchaField,
              });
            }}
            onCancel={() => {
              updateBooedBy(jobDetails);
              switchRoute(ROUTES.CLIENT.BIDDER.root);
            }}
          />
          {getBidOnFullDetailsCardByTemplateJobId(jobDetails)}
        </div>
        <br /> <br />
      </React.Fragment>
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
            <a>Place Your Bid</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
