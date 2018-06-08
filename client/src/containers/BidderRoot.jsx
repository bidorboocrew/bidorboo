import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
// import GeoSearch from '../components/GeoSearch';
import BidderMapSection from '../components/BidderMapSection';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../components/Spinner';
import PostedJobsToBidOnCard from '../components/PostedJobsToBidOnCard';
import SearchForm from '../components/forms/SearchForm';

// import PlacesAutocomplete, {
//   geocodeByAddress,
//   // geocodeByPlaceId,
//   getLatLng
// } from 'react-places-autocomplete';
import { switchRoute } from '../app-state/actions/routerActions';
import {
  getAllPostedJobs,
  searchByLocation
} from '../app-state/actions/jobActions';
import { selectJobToBidOn } from '../app-state/actions/bidsActions';

class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    //render map only after we show everything
    this.state = { address: '', showFilterDialog: false };
    autoBind(this, 'toggleFilterDialog');
  }

  toggleFilterDialog(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      showFilterDialog: !this.state.showFilterDialog
    });
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
      s_userDetails,
      a_searchByLocation,
      s_mapCenterPoint,
      a_selectJobToBidOn
    } = this.props;

    return (
      <React.Fragment>
        {this.state.showFilterDialog && (
          <div
            className={classNames('modal', {
              'is-active': this.state.showFilterDialog
            })}
          >
            <div
              onClick={this.toggleFilterDialog}
              className="modal-background"
            />
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Filter Jobs</p>
                <button onClick={this.toggleFilterDialog} class="delete" aria-label="close" />
              </header>
              <section style={{padding:0}} class="modal-card-body">
                <SearchForm
                  onCancel={() => console.log('cancel')}
                  onSubmit={vals => {
                    a_searchByLocation(vals);
                  }}
                />
              </section>
            </div>

            <button
              onClick={this.toggleFilterDialog}
              className="modal-close is-large"
              aria-label="close"
            />
          </div>
        )}
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
            <div className="container">
              <a onClick={this.toggleFilterDialog} className="button">
                Filter Jobs
              </a>
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

                <BidderMapSection
                  selectJobToBidOn={a_selectJobToBidOn}
                  mapCenterPoint={s_mapCenterPoint}
                  jobsList={s_allThePostedJobsList}
                />
              </div>
            )}
          </section>

          {/* jobs view */}
          <section className="mainSectionContainer">
            <div className="container">
              <div
                // style={{ alignItems: 'flex-end' }}
                className="columns is-multiline"
              >
                <PostedJobsToBidOnCard
                  currentUserId={s_userDetails._id}
                  switchRoute={a_switchRoute}
                  selectJobToBidOn={a_selectJobToBidOn}
                  jobsList={s_allThePostedJobsList}
                />
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BidderRoot);
