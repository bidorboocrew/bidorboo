import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReCAPTCHA from 'react-google-recaptcha';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import PostYourBid from '../../components/forms/PostYourBid';
import { updateBooedBy } from '../../app-state/actions/jobActions';
import MyOpenBidJobDetails from './components/MyOpenBidJobDetails';
import { findAvgBidInBidList } from '../commonComponents';

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
    this.recaptchaRef.current.execute();
  }
  render() {
    const { jobDetails, a_submitBid, a_updateBooedBy, isLoggedIn } = this.props;
    const { recaptchaField } = this.state;
    let dontShowThisPage = !jobDetails || !jobDetails._id || !jobDetails._ownerRef || !isLoggedIn;
    if (dontShowThisPage) {
      switchRoute(ROUTES.CLIENT.BIDDER.root);
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
        <div
          style={{ marginBottom: '3rem' }}
          className="container is-widescreen"
        >
          {breadCrumbs()}
          <PostYourBid
            avgBid={avgBid}
            onSubmit={(values) => {
              a_submitBid({
                jobId: jobDetails._id,
                bidAmount: values.bidAmountField,
                recaptchaField,
              });
            }}
            onCancel={() => {
              a_updateBooedBy(jobDetails);
              switchRoute(ROUTES.CLIENT.BIDDER.root);
            }}
          />
          <MyOpenBidJobDetails job={jobDetails} />
        </div>
        <br /> <br />
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ bidsReducer, userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    jobDetails: bidsReducer.jobDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_submitBid: bindActionCreators(submitBid, dispatch),
    a_updateBooedBy: bindActionCreators(updateBooedBy, dispatch),
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
