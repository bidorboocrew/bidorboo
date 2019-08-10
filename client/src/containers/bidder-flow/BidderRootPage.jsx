import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse } from 'react-collapse';

import BidRootBg from '../../assets/images/BidRootBg.png';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn, searchJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';

import BidderRootFilterWrapper from '../../components/forms/BidderRootFilterWrapper';
import BidderRootLocationFilter from '../../components/forms/BidderRootLocationFilter';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import AllJobsView from './components/AllJobsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';

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
      },
    };
    this.mapRootRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { userDetails, searchJobsToBidOn } = this.props;

    if (this.props.isLoggedIn && prevProps.isLoggedIn !== this.props.isLoggedIn) {
      const userLastStoredSearchParams = userDetails && userDetails.lastSearch;
      if (userLastStoredSearchParams) {
        const { searchRadius, location, addressText } = userLastStoredSearchParams;
        const { coordinates } = location;

        this.setState(
          () => {
            return {
              isThereAnActiveSearch: true,
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
              isThereAnActiveSearch: true,
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
        isThereAnActiveSearch: true,
        mapCenterPoint: latLng,
        activeSearchParams: {
          addressText,
          latLng,
          searchRadius,
        },
      }),
      () => {
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
    const { isLoading, isLoggedIn, ListOfJobsToBidOn, userDetails } = this.props;
    const { isThereAnActiveSearch, userLastStoredSearchParams, showMapView } = this.state;

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

    return (
      <div>
        <section className="hero is-small">
          <div
            style={{ padding: '1rem 0.5rem', backgroundImage: `url(${BidRootBg})` }}
            className="hero-body"
          >
            <div className="container">
              <h1 className="has-text-white title">Search For Tasks</h1>

              <div
                style={{ background: 'transparent' }}
                className="card cardWithButton nofixedwidth disabled has-text-centered"
              >
                <div style={{ padding: 0 }} className="card-content">
                  <BidderRootLocationFilter
                    submitSearchLocationParams={this.submitSearchLocationParams}
                    updateSearchLocationState={this.updateSearchLocationState}
                    activeSearchParams={activeSearchParams}
                    userLastStoredSearchParams={userLastStoredSearchParams}
                    {...this.props}
                  />
                </div>
              </div>
              <div className="columns is-centered is-mobile is-multiline">
                <div className="column has-text-left">
                  <div style={{ marginBottom: '0.75rem', textAlign: 'left', marginTop: '0.75rem' }}>
                    <input
                      id="togglemapView"
                      type="checkbox"
                      name="togglemapView"
                      className="switch is-rounded is-success"
                      onChange={this.toggleMapView}
                      checked={showMapView}
                    />
                    <label style={{ fontWeight: 500, color: 'white' }} htmlFor="togglemapView">
                      Toggle Map View
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
            <Collapse isOpened={showMapView}>
              <div style={{ marginTop: '1.25rem' }} className="container slide-in-bottom-small">
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
                          Search to Find Tasks in Areas where you're able to provide them
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
