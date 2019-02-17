import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Switch from 'react-switch';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';

import { TAB_IDS } from './components/helperComponents';
import FilterSideNav from './components/FilterSideNav';
import ActiveSearchFilters from './components/ActiveSearchFilters';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import AllJobsView from './components/AllJobsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';

const google = window.google;

class BidderRootPage extends React.Component {
  constructor(props) {
    super(props);

    let initialTabSelection = TAB_IDS.openRequests;
    if (props.match && props.match.params && props.match.params.tabId) {
      const { tabId } = props.match.params;
      if (tabId && TAB_IDS[`${tabId}`]) {
        initialTabSelection = TAB_IDS[`${tabId}`];
      }
    }

    this.state = {
      allowAutoDetect: false,
      displayedJobList: this.props.ListOfJobsToBidOn,
      activeTab: initialTabSelection,
      showSideNav: false,
      mapCenterPoint: {
        lng: -75.6972,
        lat: 45.4215,
      },
    };
  }

  componentDidMount() {
    const { isLoggedIn, a_getCurrentUser, a_getAllJobsToBidOn } = this.props;
    if (!isLoggedIn) {
      a_getCurrentUser();
    }
    a_getAllJobsToBidOn();

    // xxx do not do that automatically it will scare people
    // navigator && navigator.geolocation && this.getCurrentAddress();
  }

  getCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
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

  handleGeoSearch = (vals) => {
    let { locationField, searchRaduisField, filterJobsByCategoryField } = vals;
    let filteredJobs = this.props.ListOfJobsToBidOn;

    if (filterJobsByCategoryField && filterJobsByCategoryField.length > 0) {
      // filter by type first
      filteredJobs = this.props.ListOfJobsToBidOn.filter((job) => {
        if (
          filterJobsByCategoryField &&
          filterJobsByCategoryField.length > 0 &&
          !filterJobsByCategoryField.includes(job.fromTemplateId)
        ) {
          return false;
        }
        return true;
      });
    }

    if (locationField && searchRaduisField) {
      let searchArea = new google.maps.Circle({
        center: new google.maps.LatLng(locationField.lat, locationField.lng),
        radius: searchRaduisField * 1000, //in KM
      });
      const center = searchArea.getCenter();
      const raduis = searchArea.getRadius();

      filteredJobs = filteredJobs.filter((job) => {
        let marker = new google.maps.LatLng(
          job.location.coordinates[1],
          job.location.coordinates[0],
        );

        if (google.maps.geometry.spherical.computeDistanceBetween(marker, center) <= raduis) {
          return true;
        }
        return false;
      });
    }
    if (!locationField || !locationField.lat || !locationField.lng) {
      locationField = {
        lat: 45.4215,
        lng: -75.6972,
      };
    }
    this.setState(
      {
        hasActiveSearch: true,
        displayedJobList: filteredJobs,
        mapCenterPoint: {
          lat: locationField.lat,
          lng: locationField.lng,
        },
      },
      () => {
        this.toggleSideNav();
      },
    );
  };

  changeActiveTab = (tabId) => {
    this.setState({ activeTab: tabId });
  };

  updateMapCenter = (pos) => {
    this.setState({
      mapCenterPoint: {
        ...pos,
      },
    });
  };
  toggleSideNav = () => {
    this.setState({ showSideNav: !this.state.showSideNav });
  };

  handleChange = () => {
    this.setState({ allowAutoDetect: !this.state.allowAutoDetect }, () => {
      navigator && navigator.geolocation && this.getCurrentAddress();
    });
  };

  render() {
    const { isLoading, isLoggedIn, ListOfJobsToBidOn, userDetails } = this.props;
    if (isLoading) {
      return (
        <div className="container is-widescreen bidorbooContainerMargins">
          <Spinner isLoading={isLoading} size={'large'} />
        </div>
      );
    }

    const {
      activeTab,
      showSideNav,
      displayedJobList,
      mapCenterPoint,
      hasActiveSearch,
    } = this.state;

    let currentJobsList = hasActiveSearch ? displayedJobList : ListOfJobsToBidOn;
    const currentUserId = userDetails && userDetails._id ? userDetails._id : '';

    if (isLoggedIn) {
      if (activeTab === TAB_IDS.openRequests) {
        currentJobsList = currentJobsList.filter((job) => job._ownerRef._id !== currentUserId);
      } else if (activeTab === TAB_IDS.myRequests) {
        currentJobsList = currentJobsList.filter((job) => job._ownerRef._id === currentUserId);
      }
    }

    return (
      <div className="container is-widescreen bidorbooContainerMargins">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Provide a Service</h1>
              <h2 className="subtitle">Start by bidding on the available requests in your area</h2>
              <div
                style={{ marginBottom: 6 }}
                className="help container is-widescreen has-text-centered"
              >
                <Switch
                  uncheckedIcon={false}
                  onChange={this.handleChange}
                  checked={this.state.allowAutoDetect}
                />
                <div>
                  {this.state.allowAutoDetect
                    ? 'BidOrBoo is serving custom results based on your location'
                    : `Allow BidOrBoo to auto detect my location for better search results`}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <Tabs
          activeTab={activeTab}
          changeActiveTab={this.changeActiveTab}
          isLoggedIn={isLoggedIn}
        /> */}
        <FloatingFilterButton toggleSideNav={this.toggleSideNav} showSideNav={showSideNav} />
        <FilterSideNav
          isSideNavOpen={showSideNav}
          toggleSideNav={this.toggleSideNav}
          updateMapCenter={this.updateMapCenter}
          onCancel={this.clearFilter}
          handleGeoSearch={this.handleGeoSearch}
        />

        {hasActiveSearch && <ActiveSearchFilters toggleSideNav={this.toggleSideNav} />}

        <MapSection mapCenterPoint={mapCenterPoint} jobsList={currentJobsList} {...this.props} />
        <div
          style={{ marginBottom: 6 }}
          className="help container is-widescreen has-text-grey has-text-centered"
        >
          {` ${(currentJobsList && currentJobsList.length) || 0} open requests`}
        </div>
        <br />

        <AllJobsView activeTab={activeTab} jobsList={currentJobsList} {...this.props} />
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
    a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch),
    a_getAllJobsToBidOn: bindActionCreators(getAllJobsToBidOn, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRootPage);

const FloatingFilterButton = ({ toggleSideNav, showSideNav }) => {
  return (
    <a
      style={{
        zIndex: showSideNav ? 0 : 999,
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleSideNav();
      }}
      className="button is-link bdbFloatingButtonText iconbutton"
    >
      <span className="icon">
        <i className="fas fa-filter" />
      </span>
    </a>
  );
};

const Tabs = ({ activeTab, changeActiveTab, isLoggedIn }) => {
  return (
    <div className="tabs is-medium is-marginless">
      <ul>
        <li className={`${activeTab === TAB_IDS.openRequests ? 'is-active' : null}`}>
          <a
            onClick={(e) => {
              e.preventDefault();
              changeActiveTab(TAB_IDS.openRequests);
            }}
          >
            {TAB_IDS.openRequests}
          </a>
        </li>
        {isLoggedIn && (
          <li className={`${activeTab === TAB_IDS.myRequests ? 'is-active' : null}`}>
            <a
              onClick={(e) => {
                e.preventDefault();
                changeActiveTab(TAB_IDS.myRequests);
              }}
            >
              {TAB_IDS.myRequests}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};
