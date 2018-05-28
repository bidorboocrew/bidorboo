import React from 'react';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../components/Spinner';
import { switchRoute } from '../app-state/actions/routerActions';
import {
  getAllPostedJobs,
  searchByLocation
} from '../app-state/actions/jobActions';
import {
  selectJobToBidOn,
} from '../app-state/actions/bidderActions';

class BidderMyBids extends React.Component {
  constructor(props) {
    super(props);
    //render map only after we show everything
    this.state = { address: '' };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // get all posted bids
    // this.props.a_getAllPostedJobs();
  }

  render() {

    return (
      <div className="slide-in-left" id="bdb-bidder-my-bids">
        <section className="hero is-small is-dark">
          <div style={{ backgroundColor: '#c786f8' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Your Bids
              </h1>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
         here we start bidder view
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    s_error: jobsReducer.error,
    s_isLoading: jobsReducer.isLoading,
    s_allThePostedJobsList: jobsReducer.allThePostedJobsList,
    s_mapCenterPoint: jobsReducer.mapCenterPoint,
    s_userDetails: userModelReducer.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_getAllPostedJobs: bindActionCreators(getAllPostedJobs, dispatch),
    a_searchByLocation: bindActionCreators(searchByLocation, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch)

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BidderMyBids);
