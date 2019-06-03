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
      isThereAnActiveSearch: false,
      // showSideNav: false,
      mapZoomLevel: 6,
      mapCenterPoint: {
        lng: -75.801867,
        lat: 45.296898,
      },
      activeSearchParams: {
        searchRadius: '',
        addressText: '',
        latLng: { lng: -75.801867, lat: 45.296898 },
      },
    };
    this.mapRootRef = React.createRef();
  }

  componentDidMount() {
    const { isLoggedIn, userDetails, searchJobsToBidOn } = this.props;

    if (isLoggedIn) {
      const userLastStoredSearchParams = userDetails && userDetails.lastSearch;
      if (userLastStoredSearchParams) {
        const { searchRadius, location, addressText } = userLastStoredSearchParams;
        const { coordinates } = location;

        this.setState(
          () => {
            return {
              userLastStoredSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
              },
              activeSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
              },
            };
          },
          () => {
            searchJobsToBidOn({
              searchRadius,
              location: { lng: coordinates[0], lat: coordinates[1] },
              addressText,
            });
          },
        );
      }
    }
  }

  submitSearchLocationParams = ({ addressText, latLng, searchRadius }) => {
    const { searchJobsToBidOn } = this.props;

    // do some validation xxxxx latLng
    this.setState(
      () => ({
        hasActiveSearch: true,
        mapCenterPoint: latLng,

        activeSearchParams: {
          addressText,
          latLng,
          searchRadius,
        },
      }),
      () => {
        debugger;
        searchJobsToBidOn({
          searchRadius: searchRadius,
          location: latLng,
          addressText,
        });
      },
    );
  };

  updateSearchLocationState = (newSearchParams) => {
    const { activeSearchParams } = this.state;
    // do some validation xxxxx latLng
    this.setState(() => ({
      hasActiveSearch: true,
      activeSearchParams: {
        ...activeSearchParams,
        ...newSearchParams,
      },
    }));
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

  render() {
    const { isLoading, isLoggedIn, ListOfJobsToBidOn, userDetails } = this.props;
    const { isThereAnActiveSearch, userLastStoredSearchParams } = this.state;

    const { mapCenterPoint, mapZoomLevel, activeSearchParams } = this.state;

    let currentJobsList = isLoggedIn
      ? ListOfJobsToBidOn.filter((job) => job._ownerRef._id !== userDetails._id)
      : ListOfJobsToBidOn;

    const searchWithNoResults =
      isThereAnActiveSearch && (currentJobsList && currentJobsList.length === 0);

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
              <h1 style={{ marginBottom: '0.5rem' }} className="title">
                Provide a Service
              </h1>

              <StepsForTasker isSmall={true} step={1} />
            </div>
          </div>
        </section>
        <br />

        <div className="has-text-centered">
          <JobsLocationFilterForm
            submitSearchLocationParams={this.submitSearchLocationParams}
            updateSearchLocationState={this.updateSearchLocationState}
            activeSearchParams={activeSearchParams}
            userLastStoredSearchParams={userLastStoredSearchParams}
          />
        </div>
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
            {currentJobsList && currentJobsList.length > 0 && (
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
