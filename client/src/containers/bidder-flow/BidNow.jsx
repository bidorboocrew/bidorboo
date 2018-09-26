import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { switchRoute } from '../../app-state/actions/routerActions';
import { submitBid } from '../../app-state/actions/bidsActions';

import * as ROUTES from '../../constants/frontend-route-consts';
import BidOnAJobCard from '../../components/bidder-components/BidOnAJobCard';

class BidNow extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    s_jobDetails: PropTypes.shape({
      state: PropTypes.string,
      _id: PropTypes.string,
      createdAt: PropTypes.string,
      fromTemplateId: PropTypes.string,
      startingDateAndTime: PropTypes.shape({
        date: PropTypes.string,
        hours: PropTypes.number,
        minutes: PropTypes.number,
        period: PropTypes.string
      }),
      detailedDescription: PropTypes.string,
      title: PropTypes.string,
      _ownerId: PropTypes.shape({
        profileImage: PropTypes.shape({
          url: PropTypes.string.isRequired,
          public_id: PropTypes.string
        }),
        displayName: PropTypes.string
      })
    }),
    a_switchRoute: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { a_switchRoute, s_jobDetails, a_submitBid } = this.props;

    //if user tried to manually set the url to this page without selecting a job
    if (!s_jobDetails || !s_jobDetails._ownerId) {
      //reroute them to bidder root
      this.props.a_switchRoute(ROUTES.CLIENT.BIDDER.root);
    }

    return (
      <div className="slide-in-left" id="bdb-bidder-bidNow">
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    a_switchRoute(ROUTES.CLIENT.BIDDER.root);
                  }}
                >
                  Bidder Home
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Bidding</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer">
          <div className="container">
            <div className="columns is-mobile is-centered">
              <div
                className="column is-12-mobile
                          is-8-tablet"
              >
                <BidOnAJobCard
                  onSubmit={a_submitBid}
                  switchRoute={a_switchRoute}
                  jobDetails={s_jobDetails}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ bidsReducer }) => {
  return {
    s_jobDetails: bidsReducer.jobDetails
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_submitBid: bindActionCreators(submitBid, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BidNow);
