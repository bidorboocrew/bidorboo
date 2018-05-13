import React from 'react';
// import GeoSearch from '../components/GeoSearch';
import BidderMapSection from '../components/BidderMapSection';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../components/Spinner';
import BidJobCard from '../components/BidJobCard';
import SearchForm from '../components/forms/SearchForm';

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
    this.state = { address: '' };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.a_getAllPostedJobs();
  }

  render() {
    const {
      s_error,
      s_isLoading,
      s_allThePostedJobsList,
      a_switchRoute,
      s_userDetails
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
        {/* map view */}
        <section className="mainSectionContainer">
          {s_isLoading && (
            <div className="container">
              <Spinner isLoading={s_isLoading} size={'large'} />
            </div>
          )}
          {!s_isLoading && (
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

                <BidderMapSection jobsList={s_allThePostedJobsList} />

            </div>
          )}
        </section>
        <section className="mainSectionContainer">
          <div className="container">
            <SearchSection />
          </div>
        </section>
        {/* jobs view */}
        <section className="mainSectionContainer">
          <div className="container">
            <div className="columns is-multiline">
              <BidJobCard
                currentUserId={s_userDetails._id}
                switchRoute={a_switchRoute}
                jobsList={s_allThePostedJobsList}
              />
            </div>
          </div>
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
    s_userDetails: userModelReducer.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_getAllPostedJobs: bindActionCreators(getAllPostedJobs, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BidderRoot);

const SearchSection = () => {
  return (
    <SearchForm
      onCancel={() => console.log('cancel')}
      onSubmit={vals => console.log(vals)}
    />
  );
  // return (
  //   <div className="field has-addons">
  //     <div className="control  has-icons-left  is-loading">
  //       <span className="icon is-small is-left">
  //         <i className="fas fa-search" />
  //       </span>
  //       <input
  //         className="input"
  //         type="text"
  //         placeholder="Search by address"
  //       />
  //     </div>

  //   </div>
  // );
};

{
  /* <div className="field has-addons">
<div className="control is-fullwidth has-icons-left  is-loading">
  <span className="icon is-small is-left">
    <i className="fas fa-search" />
  </span>
  <input className="input" type="text" placeholder="Search by address" />
</div>
<p class="control">
  <button class="button">Search</button>
</p>
</div> */
}
