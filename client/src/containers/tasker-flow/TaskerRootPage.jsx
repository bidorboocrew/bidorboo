import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse } from 'react-collapse';
import ShareButtons from '../ShareButtons.jsx';
import { getBugsnagClient } from '../../index';
import { getCurrentUser } from '../../app-state/actions/authActions';

import { searchRequestsToBidOn } from '../../app-state/actions/requestActions';

import TaskerRootLocationFilter from '../../components/forms/TaskerRootLocationFilter';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';
import TaskerVerificationBanner from './TaskerVerificationBanner';
import AllRequestsView from './components/AllRequestsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import SubscribeToSearchResultsToggle from './SubscribeToSearchResultsToggle';
import NoTasksFound from '../../assets/images/NoTasksFound.png';

class TaskerRootPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearchFilters: true,
      showMapView: true,
      isThereAnActiveSearch: false,
      mapZoomLevel: 10,
      mapCenterPoint: {
        lng: -75.801867,
        lat: 45.296898,
      },
      activeSearchParams: {
        searchRadius: '100',
        addressText: '',
        latLng: { lng: -75.801867, lat: 45.296898 },
        tasksTypeFilter: ['bdbHouseCleaning', 'bdbPetSittingWalking'],
      },
    };
    this.mapRootRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { userDetails, searchRequestsToBidOn } = this.props;

    if (this.props.isLoggedIn && prevProps.isLoggedIn !== this.props.isLoggedIn) {
      const userLastStoredSearchParams = userDetails && userDetails.lastSearch;
      if (
        userLastStoredSearchParams &&
        userLastStoredSearchParams.location &&
        userLastStoredSearchParams.addressText &&
        userLastStoredSearchParams.searchRadius &&
        userLastStoredSearchParams.location.coordinates
      ) {
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
            searchRequestsToBidOn({
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
    const { isLoggedIn, userDetails, searchRequestsToBidOn } = this.props;

    if (isLoggedIn) {
      // window.localStorage && window.localStorage.removeItem('bob_prevTaskFilters');

      const userLastStoredSearchParams = userDetails && userDetails.lastSearch;

      if (
        userLastStoredSearchParams &&
        userLastStoredSearchParams.location &&
        userLastStoredSearchParams.addressText &&
        userLastStoredSearchParams.searchRadius &&
        userLastStoredSearchParams.location.coordinates
      ) {
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
              mapCenterPoint: {
                lng: coordinates[0],
                lat: coordinates[1],
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
            searchRequestsToBidOn({
              searchRadius,
              location: { lng: coordinates[0], lat: coordinates[1] },
              addressText,
              tasksTypeFilter,
            });
          },
        );
      }
    } else {
      if (window.localStorage) {
        if (!!window.localStorage.getItem('bob_prevTaskFilters')) {
          try {
            const previouslyActiveSearchParams = JSON.parse(
              window.localStorage.getItem('bob_prevTaskFilters'),
            );

            if (
              previouslyActiveSearchParams &&
              previouslyActiveSearchParams.latLng &&
              previouslyActiveSearchParams.addressText &&
              previouslyActiveSearchParams.searchRadius &&
              previouslyActiveSearchParams.latLng.lng &&
              previouslyActiveSearchParams.latLng.lat
            ) {
              if (
                !previouslyActiveSearchParams.tasksTypeFilter ||
                !previouslyActiveSearchParams.tasksTypeFilter.length ||
                !previouslyActiveSearchParams.tasksTypeFilter.length > 1
              ) {
                previouslyActiveSearchParams.tasksTypeFilter = [
                  'bdbHouseCleaning',
                  'bdbPetSittingWalking',
                ];
              }

              this.setState(
                () => ({
                  isThereAnActiveSearch: true,
                  activeSearchParams: { ...previouslyActiveSearchParams },
                  mapCenterPoint: {
                    lng: previouslyActiveSearchParams.latLng.lng,
                    lat: previouslyActiveSearchParams.latLng.lat,
                  },
                }),
                () => {
                  searchRequestsToBidOn({
                    searchRadius: previouslyActiveSearchParams.searchRadius,
                    location: {
                      lng: previouslyActiveSearchParams.latLng.lng,
                      lat: previouslyActiveSearchParams.latLng.lat,
                    },
                    addressText: previouslyActiveSearchParams.addressText,
                    tasksTypeFilter: previouslyActiveSearchParams.tasksTypeFilter,
                  });
                },
              );
            }
          } catch (e) {
            getBugsnagClient().leaveBreadcrumb('tasker root page');
            getBugsnagClient().notify(e);
          }
        }
      }
    }
  }

  submitSearchLocationParams = ({ addressText, latLng, searchRadius, tasksTypeFilter }) => {
    const { searchRequestsToBidOn } = this.props;

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
        searchRequestsToBidOn({
          searchRadius: searchRadius,
          location: latLng,
          addressText,
          tasksTypeFilter,
        });
      },
    );
  };

  updateSearchLocationState = (newSearchParams, withSearch = true) => {
    const { isLoggedIn } = this.props;
    const { activeSearchParams } = this.state;

    this.setState(
      () => ({
        activeSearchParams: {
          ...activeSearchParams,
          ...newSearchParams,
        },
      }),
      () => {
        if (withSearch) {
          if (!isLoggedIn) {
            window.localStorage &&
              window.localStorage.setItem(
                'bob_prevTaskFilters',
                JSON.stringify(activeSearchParams),
              );
          }
          this.submitSearchLocationParams(this.state.activeSearchParams);
        }
      },
    );
  };

  zoomAndCenterAroundMarker = (latLngNewCenter, callback) => {
    this.setState(
      () => {
        return { mapCenterPoint: { ...latLngNewCenter }, mapZoomLevel: 10 };
      },
      () => {
        callback && callback();
      },
    );
  };

  toggleMapView = () => {
    this.setState({ showMapView: !this.state.showMapView });
  };

  toggleShowSearchFilters = () => {
    this.setState({ showSearchFilters: !this.state.showSearchFilters });
  };

  renderSubscribeToSearchResults = () => {
    return this.props.isLoggedIn ? (
      <div className="has-text-left">
        <SubscribeToSearchResultsToggle />
      </div>
    ) : null;
  };
  render() {
    const { isLoading, isLoggedIn, listOfRequestsToBidOn, userDetails } = this.props;
    const {
      isThereAnActiveSearch,
      userLastStoredSearchParams,
      showMapView,
      showSearchFilters,
    } = this.state;

    const { mapCenterPoint, mapZoomLevel, activeSearchParams } = this.state;

    let currentRequestsList = listOfRequestsToBidOn;
    const taskerCanBid = userDetails && userDetails.canBid;

    currentRequestsList = currentRequestsList.map((request) => {
      return {
        ...request,
        reactMapClusterRef: React.createRef(),
        zoomOnInfo: this.zoomAndCenterAroundMarker,
      };
    });

    const anyVisibleRequests = currentRequestsList && currentRequestsList.length > 0;
    const searchWithNoResults = isThereAnActiveSearch && !anyVisibleRequests;

    return (
      <>
        <TaskerVerificationBanner></TaskerVerificationBanner>
        <section className="hero is-white is-small">
          <div style={{ paddingBottom: 0 }} className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }} className="title">
                Find Tasks In Your Area
              </h1>

              <Collapse
                isOpened={showSearchFilters}
                // initialStyle={{ height: 0, overflow: 'hidden' }}
              >
                <TaskerRootLocationFilter
                  // submitSearchLocationParams={this.submitSearchLocationParams}
                  updateSearchLocationState={this.updateSearchLocationState}
                  activeSearchParams={activeSearchParams}
                  userLastStoredSearchParams={userLastStoredSearchParams}
                  {...this.props}
                  renderSubscribeToSearchResults={this.renderSubscribeToSearchResults}
                />
              </Collapse>
              {!showSearchFilters && (
                <button
                  onClick={this.toggleShowSearchFilters}
                  style={{
                    borderRadius: 0,
                    border: '1px solid rgb(219,219,219)',
                    boxShadow: 'none',
                    borderTop: 0,
                    borderRight: 0,
                    borderLeft: 0,
                  }}
                  className="button is-fullwidth"
                >
                  <span style={{ marginRight: 4 }}>Show Filters</span>
                  <span className="icon">
                    <i className="fas fa-angle-double-down" />
                  </span>
                </button>
              )}
              {showSearchFilters && (
                <button
                  onClick={this.toggleShowSearchFilters}
                  style={{
                    borderRadius: 0,
                    border: '1px solid rgb(219,219,219)',
                    boxShadow: 'none',
                    borderTop: 0,
                    borderRight: 0,
                    borderLeft: 0,
                  }}
                  className="button is-fullwidth"
                >
                  <span style={{ marginRight: 4 }}>Hide Filters</span>
                  <span className="icon">
                    <i className="fas fa-angle-double-up" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>
        <div>
          {isLoading && (
            <section className="section">
              <Spinner renderLabel="getting requests..." isLoading size={'large'} />
            </section>
          )}
          {!isLoading && (
            <React.Fragment>
              <Collapse isOpened={showMapView && anyVisibleRequests}>
                <div style={{ marginTop: '2rem' }} className="container slide-in-bottom-small">
                  <MapSection
                    mapCenterPoint={mapCenterPoint}
                    mapZoomLevel={mapZoomLevel}
                    requestsList={currentRequestsList}
                    {...this.props}
                  />
                </div>
              </Collapse>
              {isThereAnActiveSearch && currentRequestsList && currentRequestsList.length > 0 && (
                <div
                  style={{ marginTop: 2 }}
                  className="help container is-widescreen has-text-grey has-text-centered"
                >
                  {` ${currentRequestsList.length} tasks available in the search area`}
                </div>
              )}
              {currentRequestsList && currentRequestsList.length > 0 && (
                <>
                  <AllRequestsView
                    requestsList={currentRequestsList}
                    {...this.props}
                    showMapView={showMapView}
                  />
                </>
              )}

              {!isThereAnActiveSearch && (
                <>
                  <br></br>
                  <div className="HorizontalAligner-center column slide-in-bottom-small">
                    <div className="is-fullwidth">
                      <div>
                        <div className="card-content VerticalAligner">
                          <div className="has-text-centered">
                            <div className="is-size-4">Search for tasks in areas near you</div>
                            <div className="is-size-6">Help us spread BidOrBoo in your area</div>
                            <br />
                            <div style={{ margin: 6 }}>
                              <ShareButtons shareUrl={'/'}></ShareButtons>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {searchWithNoResults && (
                <>
                  <br></br>
                  <div className="HorizontalAligner-center column slide-in-bottom-small">
                    <div className="is-fullwidth">
                      <div>
                        <div className="card-content VerticalAligner">
                          <div className="has-text-centered">
                            <div className="is-size-4 has-text-danger">
                              Sorry, No Tasks available around this area at this time.
                            </div>
                            <div className="is-size-6">
                              Try Changing Your Search Criteria or search a different area
                            </div>

                            <section
                              style={{ padding: 0 }}
                              className="hero is-small has-text-centered fade-in"
                            >
                              <div style={{ padding: 0 }} className="hero-body">
                                <div className="container has-text-centered">
                                  <img
                                    style={{ width: 280 }}
                                    src={NoTasksFound}
                                    alt="Placeholder"
                                  />
                                </div>
                              </div>
                            </section>

                            <div className="is-size-6">Help us spread BidOrBoo in your area</div>
                            <div style={{ margin: 6 }}>
                              <ShareButtons shareUrl={'/'}></ShareButtons>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </React.Fragment>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ requestsReducer, userReducer }) => {
  return {
    isLoading: requestsReducer.isLoading,
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
    listOfRequestsToBidOn: requestsReducer.listOfRequestsToBidOn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    searchRequestsToBidOn: bindActionCreators(searchRequestsToBidOn, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskerRootPage);
