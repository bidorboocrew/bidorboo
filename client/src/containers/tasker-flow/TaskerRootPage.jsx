import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse } from 'react-collapse';
import ShareButtons from '../ShareButtons.jsx';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { searchRequestsToBidOn } from '../../app-state/actions/requestActions';

import TaskerRootLocationFilter from '../../components/forms/TaskerRootLocationFilter';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';
import TaskerVerificationBanner from './TaskerVerificationBanner';
import AllRequestsView from './components/AllRequestsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import SubscribeToSearchResultsToggle from './SubscribeToSearchResultsToggle';

class TaskerRootPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
            console.log(e);
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

  render() {
    const { isLoading, isLoggedIn, listOfRequestsToBidOn, userDetails } = this.props;
    const { isThereAnActiveSearch, userLastStoredSearchParams, showMapView } = this.state;

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

        <div>
          <section className="hero is-small is-bold">
            <div className="hero-body">
              <div className="container">
                <h1
                  style={{ marginBottom: '0.5rem', paddingLeft: 10 }}
                  className="subtitle has-text-weight-semibold"
                >
                  Search For Requests:
                </h1>

                <TaskerRootLocationFilter
                  submitSearchLocationParams={this.submitSearchLocationParams}
                  updateSearchLocationState={this.updateSearchLocationState}
                  activeSearchParams={activeSearchParams}
                  userLastStoredSearchParams={userLastStoredSearchParams}
                  {...this.props}
                />
                <br></br>
                {isLoggedIn && (
                  <div className="has-text-left">
                    <SubscribeToSearchResultsToggle />
                  </div>
                )}

                {isThereAnActiveSearch && (
                  <div className="has-text-left">
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
                      <label style={{ fontWeight: 500 }} htmlFor="togglemapView">
                        Toggle map view
                      </label>
                    </div>
                  </div>
                )}
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
              <Collapse isOpened={showMapView && anyVisibleRequests}>
                <div style={{ marginTop: '1.25rem' }} className="container slide-in-bottom-small">
                  <MapSection
                    mapCenterPoint={mapCenterPoint}
                    mapZoomLevel={mapZoomLevel}
                    requestsList={currentRequestsList}
                    {...this.props}
                  />
                </div>
              </Collapse>
              {isThereAnActiveSearch && (
                <div
                  style={{ marginTop: 2 }}
                  className="help container is-widescreen has-text-grey has-text-centered"
                >
                  {` ${(currentRequestsList && currentRequestsList.length) ||
                    0} tasks available in the search area`}
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
                  <div className="HorizontalAligner-center column">
                    <div className="is-fullwidth">
                      <div className="card">
                        <div className="card-content VerticalAligner">
                          <div className="has-text-centered">
                            <div className="is-size-6">Search for tasks in areas near you</div>
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
              {searchWithNoResults && (
                <>
                  <br></br>
                  <div className="HorizontalAligner-center column">
                    <div className="is-fullwidth">
                      <div className="card">
                        <div className="card-content VerticalAligner">
                          <div className="has-text-centered">
                            <div className="is-size-6">
                              No Tasks available around this area at this time.
                            </div>
                            <div className="help">
                              Try Changing Your Search Criteria or search a different area
                            </div>
                            <br />
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
