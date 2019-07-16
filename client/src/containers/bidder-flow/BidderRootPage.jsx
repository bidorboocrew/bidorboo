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

import { StepsForTasker } from '../commonComponents';

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

  componentDidUpdate(prevProps) {
    const { isLoggedIn, userDetails, searchJobsToBidOn } = this.props;

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

  render() {
    const { isLoading, isLoggedIn, ListOfJobsToBidOn, userDetails } = this.props;
    const { isThereAnActiveSearch, userLastStoredSearchParams } = this.state;

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
        <div
          style={{ background: 'transparent', marginBottom: 0 }}
          className="tabs is-large is-centered"
        >
          <ul>
            <li>
              <a>
                {/* <span className="icon is-large">
                  <i className="fas fa-hand-rock" aria-hidden="true" />
                </span> */}
                <span>PROVIDE A SERVICE</span>
              </a>
            </li>
          </ul>
        </div>

        {isLoading && (
          <section className="section">
            <Spinner renderLabel="getting requests..." isLoading={isLoading} size={'large'} />
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
              </React.Fragment>
            )}
            <div className="has-text-centered">
              {anyVisibleJobs && (
                <BidderRootFilterWrapper
                  submitSearchLocationParams={this.submitSearchLocationParams}
                  updateSearchLocationState={this.updateSearchLocationState}
                  activeSearchParams={activeSearchParams}
                  userLastStoredSearchParams={userLastStoredSearchParams}
                />
              )}
            </div>

            {currentJobsList && currentJobsList.length > 0 && (
              <AllJobsView jobsList={currentJobsList} {...this.props} />
            )}
            {!isThereAnActiveSearch && (
              <div className="HorizontalAligner-center column">
                <div className="is-fullwidth">
                  <div className="card">
                    <div className="card-content VerticalAligner">
                      <div className="has-text-centered">
                        {/* <StepsForTasker isSmall={true} step={1} /> */}
                        <br />
                        <div className="is-size-6">
                          Find Requests in the Areas where you're able to provide them
                        </div>

                        <BidderRootFilterWrapper
                          isHorizontal={false}
                          submitSearchLocationParams={this.submitSearchLocationParams}
                          updateSearchLocationState={this.updateSearchLocationState}
                          activeSearchParams={activeSearchParams}
                          userLastStoredSearchParams={userLastStoredSearchParams}
                        />
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
                        <StepsForTasker isSmall={true} step={1} />
                        <br />
                        <div className="is-size-6">
                          No Requests match your search criteria at this time.
                          <br /> Please try Changing your search criteria or check again later.
                        </div>

                        <BidderRootFilterWrapper
                          isHorizontal={false}
                          submitSearchLocationParams={this.submitSearchLocationParams}
                          updateSearchLocationState={this.updateSearchLocationState}
                          activeSearchParams={activeSearchParams}
                          userLastStoredSearchParams={userLastStoredSearchParams}
                        />
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
