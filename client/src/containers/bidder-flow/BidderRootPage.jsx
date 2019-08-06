import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn, searchJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';

import BidderRootFilterWrapper from '../../components/forms/BidderRootFilterWrapper';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import AllJobsView from './components/AllJobsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';

class BidderRootPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMapView: false,
      shouldShowSearch: false,
      isThereAnActiveSearch: false,
      mapZoomLevel: 6,
      mapCenterPoint: {
        lng: -75.801867,
        lat: 45.296898,
      },
      activeSearchParams: {
        searchRadius: '',
        addressText: '',
        latLng: { lng: -75.801867, lat: 45.296898 },
        notifyMeAboutNewTasks: false,
      },
    };
    this.mapRootRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { userDetails, searchJobsToBidOn } = this.props;

    if (this.props.isLoggedIn && prevProps.isLoggedIn !== this.props.isLoggedIn) {
      const userLastStoredSearchParams = userDetails && userDetails.lastSearch;
      if (userLastStoredSearchParams) {
        const {
          searchRadius,
          location,
          addressText,
          notifyMeAboutNewTasks,
        } = userLastStoredSearchParams;
        const { coordinates } = location;

        this.setState(
          () => {
            return {
              isThereAnActiveSearch: true,
              userLastStoredSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                notifyMeAboutNewTasks,
              },
              activeSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                notifyMeAboutNewTasks,
              },
            };
          },
          () => {
            searchJobsToBidOn({
              searchRadius,
              location: { lng: coordinates[0], lat: coordinates[1] },
              addressText,
              notifyMeAboutNewTasks,
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
        const {
          searchRadius,
          location,
          addressText,
          notifyMeAboutNewTasks,
        } = userLastStoredSearchParams;
        const { coordinates } = location;

        this.setState(
          () => {
            return {
              isThereAnActiveSearch: true,
              userLastStoredSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                notifyMeAboutNewTasks,
              },
              activeSearchParams: {
                searchRadius,
                latLng: { lng: coordinates[0], lat: coordinates[1] },
                addressText,
                notifyMeAboutNewTasks,
              },
            };
          },
          () => {
            searchJobsToBidOn({
              searchRadius,
              location: { lng: coordinates[0], lat: coordinates[1] },
              addressText,
              notifyMeAboutNewTasks,
            });
          },
        );
      }
    }
  }

  submitSearchLocationParams = ({ addressText, latLng, searchRadius, notifyMeAboutNewTasks }) => {
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
          notifyMeAboutNewTasks,
        },
      }),
      () => {
        searchJobsToBidOn({
          searchRadius: searchRadius,
          location: latLng,
          addressText,
          notifyMeAboutNewTasks,
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
  toggleShouldShowSearch = () => {
    this.setState({ shouldShowSearch: !this.state.shouldShowSearch });
  };

  render() {
    const { isLoading, isLoggedIn, ListOfJobsToBidOn, userDetails } = this.props;
    const {
      isThereAnActiveSearch,
      userLastStoredSearchParams,
      showMapView,
      shouldShowSearch,
    } = this.state;

    const { mapCenterPoint, mapZoomLevel, activeSearchParams } = this.state;

    let currentJobsList = isLoggedIn
      ? ListOfJobsToBidOn.filter((job) => job._ownerRef._id !== userDetails._id)
      : ListOfJobsToBidOn;

    currentJobsList = currentJobsList.map((job) => {
      return {
        ...job,
        reactMapClusterRef: React.createRef(),
        zoomOnInfo: this.zoomAndCenterAroundMarker,
      };
    });

    const anyVisibleJobs = currentJobsList && currentJobsList.length > 0;
    const searchWithNoResults = isThereAnActiveSearch && !anyVisibleJobs;
    const { searchRadius, addressText } = activeSearchParams;

    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={this.toggleShouldShowSearch}
          className="button is-info bdbFloatingButtonText iconbutton"
        >
          <i className="fas fa-chevron-right" />
        </button>
        <BidderRootFilterWrapper
          toggleSideNav={this.toggleShouldShowSearch}
          show={shouldShowSearch}
          submitSearchLocationParams={this.submitSearchLocationParams}
          updateSearchLocationState={this.updateSearchLocationState}
          activeSearchParams={activeSearchParams}
          userLastStoredSearchParams={userLastStoredSearchParams}
          {...this.props}
        />

        <section className="hero is-transparent is-small has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: 0, fontWeight: 300 }} className="title">
                {`Provide Your Services`}
              </h1>
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
            {showMapView && currentJobsList && currentJobsList.length > 0 && (
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
              </React.Fragment>
            )}

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
                <div className="container">
                  <div
                    style={{ border: '1px solid #6b88e0' }}
                    className="card cardWithButton nofixedwidth"
                  >
                    <div className="card-content">
                      <div className="content has-text-centered">
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ color: '#6b88e0', fontWeight: 400 }}>
                            You're Viewing Tasks
                          </div>
                          <div>{`within ${searchRadius}km`}</div>
                          <div>{`of ${addressText}`}</div>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <input
                            id="togglemapView"
                            type="checkbox"
                            name="togglemapView"
                            className="switch is-rounded is-success"
                            onChange={this.toggleMapView}
                            checked={showMapView}
                          />
                          <label style={{ fontWeight: 400 }} htmlFor="togglemapView">
                            Toggle Map
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={this.toggleShouldShowSearch}
                      className="button is-info firstButtonInCard"
                    >
                      Edit Filters
                    </button>
                  </div>
                </div>
                <AllJobsView jobsList={currentJobsList} {...this.props} showMapView={showMapView} />
              </>
            )}

            {!isThereAnActiveSearch && (
              <div className="HorizontalAligner-center column">
                <div className="is-fullwidth">
                  <div className="card">
                    <div className="card-content VerticalAligner">
                      <div className="has-text-centered">
                        <div className="is-size-6">
                          Find Requests in the Areas where you're able to provide them
                        </div>
                        <div>
                          <br />
                          <button onClick={this.toggleShouldShowSearch} className="button is-info">
                            <span className="icon">
                              <i className="fas fa-search-location" />
                            </span>
                            <span>Change Your Search Criteria</span>
                          </button>
                        </div>
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
                          No Requests match your search criteria at this time.
                        </div>
                        <div>
                          <br />
                          <button onClick={this.toggleShouldShowSearch} className="button is-info">
                            <span className="icon">
                              <i className="fas fa-search-location" />
                            </span>
                            <span>Change Your Search Criteria</span>
                          </button>
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
