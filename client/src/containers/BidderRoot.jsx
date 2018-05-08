import React from 'react';
// import GeoSearch from '../components/GeoSearch';
import BidderMapSection from '../components/BidderMapSection';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../components/Spinner';

// import PlacesAutocomplete, {
//   geocodeByAddress,
//   // geocodeByPlaceId,
//   getLatLng
// } from 'react-places-autocomplete';
import { switchRoute } from '../app-state/actions/routerActions';
import { getAllPostedJobs } from '../app-state/actions/jobActions';

class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    //render map only after we show everything
    this.state = { address: '', initiallyLoading: true };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.a_getAllPostedJobs();
  }

  render() {
    const {
      s_error,
      s_myPostedJobsList,
      s_isLoading,
      s_userDetails,
      s_allThePostedJobsList
    } = this.props;

    return (
      <div className="slide-in-left" id="bdb-bidder-root">
        <section className="hero is-small is-dark">
          <div style={{ backgroundColor: '#c786f8' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Bid on Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Start Earning money by doing things you are good at.
              </h2>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          {(s_isLoading || this.state.initiallyLoading) && (
            <div className="container">
              <Spinner isLoading={s_isLoading} size={'large'} />
            </div>
          )}
          {!s_isLoading &&
            this.state.initiallyLoading && (
              <div className="container">
                {/* <GeoSearch
              fieldId={'addressSearch'}
              onError={(e)=> {console.log('google api error '+e)}}
              handleSelect={address => {
                geocodeByAddress(address)
                  .then(results => getLatLng(results[0]))
                  .then(latLng => console.log('Success', latLng))
                  .catch(error => console.error('Error', error));
              }}
            /> */}
                <div id="available-jobs">
                  <p className="title">The Map View</p>
                </div>
                <div id="existing-jobs">
                  <div className="columns">
                    <div className="column">
                      <BidderMapSection jobsList={s_allThePostedJobsList} />
                    </div>
                  </div>
                </div>
              </div>
            )}
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    s_error: jobsReducer.error,
    s_myPostedJobsList: jobsReducer.myPostedJobsList,
    s_isLoading: jobsReducer.isLoading,
    s_userDetails: userModelReducer.userDetails,
    s_allThePostedJobsList: jobsReducer.allThePostedJobsList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_getAllPostedJobs: bindActionCreators(getAllPostedJobs, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BidderRoot);
