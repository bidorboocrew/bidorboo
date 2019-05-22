import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { getJobToBidOnDetails } from '../../app-state/actions/bidsActions';

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
    const { submitBid, isLoggedIn, jobDetails, currentUserDetails } = this.props;
    let dontShowThisPage = !jobDetails || !jobDetails._id || !jobDetails._ownerRef || !isLoggedIn;
    if (dontShowThisPage) {
      return (
        <section className="section">
          <Spinner isLoading size={'large'} />
        </section>
      );
    }

    return (
      <div className="container is-widescreen">
        <section className="hero is-white is-small has-text-centered">
          <div
            style={{ paddingLeft: '0px !important', paddingRight: '0px !important' }}
            className="hero-body"
          >
            <h1 className="title is-hidden-touch">How it works ?</h1>
            <HowItWorks step={2} isMoreDetails isSmall />
          </div>
        </section>
        <div className="columns is-centered">
          <div className="column limitLargeMaxWidth">
            <div style={{ marginBottom: '0.7rem' }}>
              <a
                className="button is-outlined"
                onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.root)}
              >
                <span className="icon">
                  <i className="far fa-arrow-alt-circle-left" />
                </span>
                <span>Bid On Other Requests</span>
              </a>
            </div>

            {getMeTheRightRequestCard({
              job: jobDetails,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.TASKER,
              submitBid,
              userDetails: currentUserDetails,
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
    currentUserDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    submitBid: bindActionCreators(submitBid, dispatch),
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
            <a>Place Your Bid!</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export const HowItWorks = ({ step, isMoreDetails, isSmall }) => {
  return (
    <ul
      className={`limitLargeMaxWidth steps has-content-centered is-horizontal ${
        isSmall ? 'is-small' : ''
      }`}
    >
      <li className={`steps-segment ${step === 1 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-book" />
          </span>
        </span>
        <div className="steps-content">
          <p className={`${isSmall ? 'help' : ''}`}>Review Details</p>
        </div>
      </li>
      <li className={`steps-segment ${step === 2 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-pencil-alt" />
          </span>
        </span>
        <div className="steps-content">
          <p className={`${isSmall ? 'help' : ''}`}>Place your Bid</p>
        </div>
      </li>
      {isMoreDetails && (
        <li className={`steps-segment ${step === 3 ? 'is-active' : ''}`}>
          <span className="steps-marker">
            <span className="icon">
              <i className="fas fa-check" />
            </span>
          </span>
          <div className="steps-content">
            <p className={`${isSmall ? 'help' : ''}`}>Requester Selects a Tasker</p>
          </div>
        </li>
      )}
      <li className={`steps-segment ${step === 4 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fa fa-usd" />
          </span>
        </span>
        <div className="steps-content">
          <p className={`${isSmall ? 'help' : ''}`}>Do it, get paid</p>
        </div>
      </li>
    </ul>
  );
};
