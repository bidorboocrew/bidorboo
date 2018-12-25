import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import PostYourBid from '../../components/forms/PostYourBid';
import { updateBooedBy } from '../../app-state/actions/jobActions';
import OthersJobDetailsCard from './components/OthersJobDetailsCard';
class BidOnJobPage extends React.Component {
  render() {
    const { jobDetails, a_submitBid, a_updateBooedBy, isLoggedIn } = this.props;

    let dontShowThisPage = !jobDetails || !jobDetails._id || !jobDetails._ownerRef || !isLoggedIn;
    if (dontShowThisPage) {
      switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    return (
      <div className="bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <p className="subtitle has-text-light is-5">
                    <strong className="title has-text-light">Provide A Service</strong>
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {breadCrumbs()}

            <PostYourBid
              onSubmit={(values) => {
                a_submitBid({ jobId: jobDetails._id, bidAmount: values.bidAmountField });
              }}
              onCancel={() => {
                a_updateBooedBy(jobDetails);
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            />

            <OthersJobDetailsCard job={jobDetails} />
            <br />
          </div>
        </section>
      </div>
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
    <div style={{ marginBottom: '1rem' }}>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            >
              Requests
            </a>
          </li>

          <li className="is-active">
            <a>Bid</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
