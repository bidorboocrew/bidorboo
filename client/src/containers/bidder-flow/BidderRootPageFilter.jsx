import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import FilterSideNav from './components/FilterSideNav';
import ActiveSearchFilters from './components/ActiveSearchFilters';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import AllJobsView from './components/AllJobsView';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { StepsForTasker } from '../commonComponents';

const google = window.google;

class BidderRootPageFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allowAutoDetect: false,
      displayedJobList: this.props.ListOfJobsToBidOn,
    };
  }

  componentDidMount() {
    // xxxxx use this for rate limiting this will cause getalljobs to continue to be called
    const { isLoggedIn, getAllJobsToBidOn } = this.props;

    if (!isLoggedIn) {
      getCurrentUser();
    }

    // getAllJobsToBidOn();
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
    if (isLoading) {
      return (
        <section className="section">
          <Spinner
            renderLabel="getting requests near you..."
            isLoading={isLoading}
            size={'large'}
          />
        </section>
      );
    }

    const { hasActiveSearch } = this.state;

    return <div className="container is-widescreen">test</div>;
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
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRootPageFilter);

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
      className="button is-success bdbFloatingButtonText iconbutton"
    >
      <span className="icon">
        <i className="fas fa-search" />
      </span>
    </a>
  );
};
