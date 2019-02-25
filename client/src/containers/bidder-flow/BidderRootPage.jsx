import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
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
      obsessAboutMeToggle: false,
      mapCenterPoint: {
        lng: -75.6972,
        lat: 45.4215,
      },
    };
  }

  componentDidMount() {
    // const { isLoggedIn, a_getCurrentUser, a_getAllJobsToBidOn, userDetails } = this.props;
    // if (!isLoggedIn) {
    //   a_getCurrentUser();
    // } else {
    //   if (userDetails.autoDetectlocation && navigator && navigator.geolocation) {
    //     this.getCurrentAddress();
    //   }
    // }
    this.getCurrentAddress();

    // a_getAllJobsToBidOn();
  }

  toggleObsessAboutMeToggle = () => {
    this.setState({ obsessAboutMeToggle: !this.state.obsessAboutMeToggle });
  };
  getCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator && navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 5000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      const errorHandling = (e) => {
        console.error('can not auto detect address ' + e);
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
        <section className="section">
          <Spinner isLoading={isLoading} size={'large'} />
        </section>
      );
    }

    const { activeTab, displayedJobList, mapCenterPoint, hasActiveSearch } = this.state;

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
      <div>
        <nav
          style={{ background: '#00BF6F !important', color: 'white !important' }}
          className={`navbar is-fixed-top ${
            this.state.obsessAboutMeToggle ? 'color-change-2x' : ''
          }`}
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <a className="navbar-item">
              <img
                src="https://cdn.smassets.net/wp-content/themes/survey-monkey-theme/images/surveymonkey_logo_dark.svg?ver=1.108.0"
                width="112"
                height="64"
              />
            </a>
            <div class="navbar-item">
              <input
                id="switchRoundedSuccess"
                type="checkbox"
                name="switchRoundedSuccess"
                class="switch is-rounded is-info"
                onChange={this.toggleObsessAboutMeToggle}
                checked={this.state.obsessAboutMeToggle}
              />
              <label style={{ color: 'white', fontWeight: 600 }} for="switchRoundedSuccess">
                Obsession
              </label>
            </div>
          </div>
          <div class="navbar-end navbar-item">
            <a className="navbar-item button is-danger" href={'/api/auth/google'}>
              Login
            </a>
          </div>
        </nav>
        <div id="placesmap" />
        <MapSection
          obsessAboutMe={this.state.obsessAboutMeToggle}
          mapCenterPoint={mapCenterPoint}
          jobsList={currentJobsList}
          {...this.props}
        />
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
