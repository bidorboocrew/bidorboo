import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn, searchJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
// import * as ROUTES from '../../constants/frontend-route-consts';
// import { switchRoute } from '../../utils';
// import FilterSideNav from './components/FilterSideNav';
// import ActiveSearchFilters from './components/ActiveSearchFilters';
import JobsLocationFilterForm from '../../components/forms/JobsLocationFilterForm';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import AllJobsView from './components/AllJobsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { StepsForTasker } from '../commonComponents';

const google = window.google;

class BidderRootPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedJobList: this.props.ListOfJobsToBidOn,
      isThereAnActiveSearch: false,
      // showSideNav: false,
      mapZoomLevel: 6,
      mapCenterPoint: {
        lng: -75.801867,
        lat: 45.296898,
      },
      lastKnownSearch: {
        searchRadius: '',
        address: '',
        location: { coordinates: { lng: '', lat: '' } },
      },
    };
    this.mapRootRef = React.createRef();
  }

  componentDidMount() {
    this.updateStateWithLastKnownSearch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
      this.updateStateWithLastKnownSearch();
    }
  }

  updateStateWithLastKnownSearch = () => {
    const { userDetails } = this.props;

    if (this.props.isLoggedIn) {
      const lastKnownSearch = userDetails && userDetails.lastSearch;
      if (lastKnownSearch) {
        debugger;
        const { searchRadius, location, addressText } = lastKnownSearch;
        this.setState(() => {
          return {
            lastKnownSearch: {
              searchRadius,
              location,
              addressText,
            },
          };
        });
      }
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.ListOfJobsToBidOn.length !== prevState.displayedJobList.length) {
      return { displayedJobList: nextProps.ListOfJobsToBidOn };
    }
    return null;
  }

  getCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator && navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 10000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      const errorHandling = () => {
        console.error('can not auto detect address');
      };
      const successfulRetrieval = (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.updateMapCenter(pos);
      };

      //get the current location
      navigator.geolocation.getCurrentPosition(
        successfulRetrieval,
        errorHandling,
        getCurrentPositionOptions,
      );
    } else {
      console.log('no html 5 geo location');
    }
  };

  clearFilter = () => {
    this.setState(
      {
        displayedJobList: this.props.ListOfJobsToBidOn,
        hasActiveSearch: false,
      },
      () => {
        this.toggleSideNav();
      },
    );
  };

  handleJobSearch = ({
    searchRadiusField,
    locationField,
    addressTextField,
    filterJobsByCategoryField,
  }) => {
    const { searchJobsToBidOn } = this.props;
    this.setState(
      () => ({
        hasActiveSearch: true,
        lastKnownSearch: {
          searchRadiusField,
          locationField,
          addressTextField,
          filterJobsByCategoryField,
        },
      }),
      () => {
        //debugger;
        searchJobsToBidOn({
          searchRadius: searchRadiusField,
          location: locationField,
          addressText: addressTextField,
          selectedTemplateIds: filterJobsByCategoryField,
        });
      },
    );
  };

  updateMapCenter = (pos) => {
    this.setState({
      mapCenterPoint: {
        ...pos,
      },
    });
  };
  zoomAndCenterAroundMarker = (latLngNewCenter, callback) => {
    this.setState(
      () => {
        return { mapCenterPoint: { ...latLngNewCenter }, mapZoomLevel: 12 };
      },
      () => {
        callback && callback();
      },
    );
  };

  handleChange = () => {
    this.setState({ allowAutoDetect: !this.state.allowAutoDetect }, () => {
      navigator && navigator.geolocation && this.getCurrentAddress();
    });
  };

  render() {
    const { isLoading, isLoggedIn, ListOfJobsToBidOn, userDetails } = this.props;
    const { isThereAnActiveSearch } = this.state;
    const searchWithNoResults =
      isThereAnActiveSearch && (displayedJobList && displayedJobList.length === 0);

    const { displayedJobList, mapCenterPoint, mapZoomLevel, lastKnownSearch } = this.state;

    let currentJobsList = isLoggedIn
      ? displayedJobList.filter((job) => job._ownerRef._id !== userDetails._id)
      : displayedJobList;
    currentJobsList = currentJobsList.map((job) => {
      return {
        ...job,
        reactMapClusterRef: React.createRef(),
        zoomOnInfo: this.zoomAndCenterAroundMarker,
      };
    });

    return (
      <div className="container is-widescreen">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Provide a Service</h1>
              <StepsForTasker isSmall={true} step={1} />
              <h2 className="subtitle" />
            </div>
          </div>
        </section>
        <JobsLocationFilterForm
          updateMapCenter={this.updateMapCenter}
          onCancel={this.clearFilter}
          onSubmit={this.handleJobSearch}
          lastKnownSearch={lastKnownSearch}
        />
        <br />

        {isLoading && (
          <section className="section">
            <Spinner
              renderLabel="getting requests near you..."
              isLoading={isLoading}
              size={'large'}
            />
          </section>
        )}
        {!isLoading && (
          <React.Fragment>
            {displayedJobList && displayedJobList.length > 0 && (
              <React.Fragment>
                <MapSection
                  mapCenterPoint={mapCenterPoint}
                  mapZoomLevel={mapZoomLevel}
                  jobsList={currentJobsList}
                  {...this.props}
                />
                <div
                  style={{ marginBottom: 6 }}
                  className="help container is-widescreen has-text-grey has-text-centered"
                >
                  {` ${(currentJobsList && currentJobsList.length) ||
                    0} open requests in the search area`}
                </div>
                <br />
                <AllJobsView jobsList={currentJobsList} {...this.props} />
              </React.Fragment>
            )}
            {searchWithNoResults && (
              <div className="HorizontalAligner-center column">
                <div className="is-fullwidth">
                  <div className="card-content VerticalAligner">
                    <div className="content has-text-centered">
                      <div className="is-size-5">
                        Fill out the search to get custom results based on your location
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {searchWithNoResults && (
              <div className="HorizontalAligner-center column">
                <div className="is-fullwidth">
                  <div className="card-content VerticalAligner">
                    <div className="content has-text-centered">
                      <div className="is-size-5">
                        There are no Open Requests in your area. please check again soon!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
    ListOfJobsToBidOn: jobsReducer.ListOfJobsToBidOn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch),
    getAllJobsToBidOn: bindActionCreators(getAllJobsToBidOn, dispatch),
    searchJobsToBidOn: bindActionCreators(searchJobsToBidOn, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRootPage);
