import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse } from 'react-collapse';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { searchJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';

import BidderRootFilterWrapper from '../../components/forms/BidderRootFilterWrapper';
import BidderRootLocationFilter from '../../components/forms/BidderRootLocationFilter';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import AllJobsView from './components/AllJobsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import SubscribeToSearchResultsToggle from './SubscribeToSearchResultsToggle';

class BidderRootPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMapView: false,
      isThereAnActiveSearch: false,
      mapZoomLevel: 6,
      mapCenterPoint: {
        lng: -75.801867,
        lat: 45.296898,
      },
      activeSearchParams: {
        searchRadius: '100',
        addressText: '',
        latLng: { lng: -75.801867, lat: 45.296898 },
        tasksTypeFilter: [],
      },
    };
    this.mapRootRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { userDetails, searchJobsToBidOn } = this.props;

    if (this.props.isLoggedIn && prevProps.isLoggedIn !== this.props.isLoggedIn) {
      const userLastStoredSearchParams = userDetails && userDetails.lastSearch;
      if (userLastStoredSearchParams) {
        const { searchRadius, location, addressText, tasksTypeFilter } = userLastStoredSearchParams;
        const { coordinates } = location;

        this.setState(
          () => {
            return {
              isThereAnActiveSearch: true,
              userLastStoredSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                tasksTypeFilter,
              },
              activeSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                tasksTypeFilter,
              },
            };
          },
          () => {
            searchJobsToBidOn({
              searchRadius,
              location: { lng: coordinates[0], lat: coordinates[1] },
              addressText,
              tasksTypeFilter,
            });
          },
        );
      }
    }
  }
  componentDidMount() {
    const { isLoggedIn, userDetails, searchJobsToBidOn } = this.props;

    if (isLoggedIn) {
      const userLastStoredSearchParams = userDetails && userDetails.lastSearch;
      if (userLastStoredSearchParams) {
        const { searchRadius, location, addressText, tasksTypeFilter } = userLastStoredSearchParams;
        const { coordinates } = location;

        this.setState(
          () => {
            return {
              isThereAnActiveSearch: true,
              userLastStoredSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                tasksTypeFilter,
              },
              activeSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                tasksTypeFilter,
              },
            };
          },
          () => {
            searchJobsToBidOn({
              searchRadius,
              location: { lng: coordinates[0], lat: coordinates[1] },
              addressText,
              tasksTypeFilter,
            });
          },
        );
      }
    }
  }

  submitSearchLocationParams = ({ addressText, latLng, searchRadius, tasksTypeFilter }) => {
    const { searchJobsToBidOn } = this.props;

    // do some validation xxxxx latLng
    this.setState(
      () => ({
        isThereAnActiveSearch: true,
        mapCenterPoint: latLng,
        activeSearchParams: {
          addressText,
          latLng,
          searchRadius,
          tasksTypeFilter,
        },
      }),
      () => {
        searchJobsToBidOn({
          searchRadius: searchRadius,
          location: latLng,
          addressText,
          tasksTypeFilter,
        });
      },
    );
  };

  updateSearchLocationState = (newSearchParams) => {
    const { activeSearchParams } = this.state;
    // do some validation xxxxx latLng
    this.setState(() => ({
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

  toggleMapView = () => {
    this.setState({ showMapView: !this.state.showMapView });
  };

  render() {
    const { isLoading, isLoggedIn, listOfJobsToBidOn, userDetails, showLoginDialog } = this.props;
    const { isThereAnActiveSearch, userLastStoredSearchParams, showMapView } = this.state;

    const { mapCenterPoint, mapZoomLevel, activeSearchParams } = this.state;

    let currentJobsList = isLoggedIn
      ? listOfJobsToBidOn.filter((job) => job._ownerRef._id !== userDetails._id)
      : listOfJobsToBidOn;
    const taskerCanBid = userDetails && userDetails.canBid;

    currentJobsList = currentJobsList.map((job) => {
      return {
        ...job,
        reactMapClusterRef: React.createRef(),
        zoomOnInfo: this.zoomAndCenterAroundMarker,
      };
    });

    const anyVisibleJobs = currentJobsList && currentJobsList.length > 0;
    const searchWithNoResults = isThereAnActiveSearch && !anyVisibleJobs;

    return (
      <>
        {!taskerCanBid && (
          <section className="hero is-warning is-small">
            <div className="hero-body">
              <div className="container">
                <h1 style={{ marginBottom: '0.5rem', paddingLeft: 10 }} className="subtitle">
                  Want to provide your services and earn money?
                </h1>
                <button
                  className="button is-link"
                  onClick={() => {
                    if (!isLoggedIn) {
                      showLoginDialog(true);
                      return;
                    }

                    switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
                  }}
                >
                  SETUP TASKER ACCOUNT
                </button>
                <div className="help has-text-dark">*Registration will take ~5 minutes</div>
              </div>
            </div>
          </section>
        )}

        <div>
          <section className="hero is-small is-dark">
            <div className="hero-body">
              <div className="container">
                <h1
                  style={{ marginBottom: '0.5rem', paddingLeft: 10 }}
                  className="has-text-white subtitle"
                >
                  Search For Jobs Near
                </h1>

                <BidderRootLocationFilter
                  submitSearchLocationParams={this.submitSearchLocationParams}
                  updateSearchLocationState={this.updateSearchLocationState}
                  activeSearchParams={activeSearchParams}
                  userLastStoredSearchParams={userLastStoredSearchParams}
                  {...this.props}
                />
                <br></br>
                {/* <TasksICanDoSettings></TasksICanDoSettings> */}

                <div className="columns is-centered is-mobile is-multiline">
                  <div className="column has-text-left">
                    <SubscribeToSearchResultsToggle />
                  </div>
                </div>
                <div className="columns is-centered is-mobile is-multiline">
                  <div className="column has-text-left">
                    <div
                      style={{ marginBottom: '0.75rem', textAlign: 'left', marginTop: '0.75rem' }}
                    >
                      <input
                        id="togglemapView"
                        type="checkbox"
                        name="togglemapView"
                        className="switch is-rounded is-success"
                        onChange={this.toggleMapView}
                        checked={showMapView}
                      />
                      <label style={{ fontWeight: 500, color: 'white' }} htmlFor="togglemapView">
                        Toggle map view
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {isLoading && (
            <section className="section">
              <Spinner renderLabel="getting requests..." isLoading={isLoading} size={'large'} />
            </section>
          )}
          {!isLoading && (
            <React.Fragment>
              {isThereAnActiveSearch && (
                <div
                  style={{ marginBottom: 6 }}
                  className="help container is-widescreen has-text-grey has-text-centered"
                >
                  {` ${(currentJobsList && currentJobsList.length) ||
                    0} tasks available in the search area`}
                </div>
              )}
              <Collapse isOpened={showMapView}>
                <div style={{ marginTop: '1.25rem' }} className="container slide-in-bottom-small">
                  <MapSection
                    mapCenterPoint={mapCenterPoint}
                    mapZoomLevel={mapZoomLevel}
                    jobsList={currentJobsList}
                    {...this.props}
                  />
                </div>
              </Collapse>

              {anyVisibleJobs && (
                <BidderRootFilterWrapper
                  submitSearchLocationParams={this.submitSearchLocationParams}
                  updateSearchLocationState={this.updateSearchLocationState}
                  activeSearchParams={activeSearchParams}
                  userLastStoredSearchParams={userLastStoredSearchParams}
                  {...this.props}
                />
              )}

              {currentJobsList && currentJobsList.length > 0 && (
                <>
                  <AllJobsView
                    jobsList={currentJobsList}
                    {...this.props}
                    showMapView={showMapView}
                  />
                </>
              )}

              {!isThereAnActiveSearch && (
                <div className="HorizontalAligner-center column">
                  <div className="is-fullwidth">
                    <div className="card">
                      <div className="card-content VerticalAligner">
                        <div className="has-text-centered">
                          <div className="is-size-6">Search for tasks in areas near you</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {searchWithNoResults && (
                <div className="HorizontalAligner-center column">
                  <div className="is-fullwidth">
                    <div className="card">
                      <div className="card-content VerticalAligner">
                        <div className="has-text-centered">
                          <div className="is-size-6">
                            No Tasks available around this area at this time.
                          </div>
                          <br />
                          <div className="help">
                            Try Changing Your Search Criteria or search a different area
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
    listOfJobsToBidOn: jobsReducer.listOfJobsToBidOn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch),

    searchJobsToBidOn: bindActionCreators(searchJobsToBidOn, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRootPage);
