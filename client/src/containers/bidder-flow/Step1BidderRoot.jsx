import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn } from '../../app-state/actions/jobActions';

import { TAB_IDS } from './components/commonComponents';
import BidderRootSideNav from './components/BidderRootSideNav';
import ActiveSearchFilters from './components/ActiveSearchFilters';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import AllJobsToBidView from './components/AllJobsToBidView';

const google = window.google;

class BidderRoot extends React.Component {
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
  }

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
    debugger;
    this.setState({
      mapCenterPoint: {
        ...pos,
      },
    });
  };
  toggleSideNav = () => {
    this.setState({ showSideNav: !this.state.showSideNav });
  };

  render() {
    const { isLoading, isLoggedIn, ListOfJobsToBidOn, userDetails } = this.props;
    if (isLoading) {
      return (
        <section className="section">
          <div className="container is-fluid">
            <Spinner isLoading={isLoading} size={'large'} />
          </div>
        </section>
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
      <div className="bdbPage">
        <HeaderTitleAndSearch toggleSideNav={this.toggleSideNav} />
        <Tabs
          activeTab={activeTab}
          changeActiveTab={this.changeActiveTab}
          isLoggedIn={isLoggedIn}
        />
        <BidderRootSideNav
          isSideNavOpen={showSideNav}
          toggleSideNav={this.toggleSideNav}
          updateMapCenter={this.updateMapCenter}
          onCancel={this.clearFilter}
          handleGeoSearch={this.handleGeoSearch}
        />
        <div style={{ padding: '0.5rem' }}>
          {hasActiveSearch && <ActiveSearchFilters />}

          <MapSection mapCenterPoint={mapCenterPoint} jobsList={currentJobsList} />
          <br />
          <AllJobsToBidView activeTab={activeTab} jobsList={currentJobsList} {...this.props} />
        </div>
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
    a_getAllJobsToBidOn: bindActionCreators(getAllJobsToBidOn, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRoot);

const HeaderTitleAndSearch = ({ toggleSideNav }) => {
  return (
    <section className="hero is-small is-dark">
      <div className="hero-body">
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <p className="subtitle has-text-light is-5">
                <strong className="subtitle has-text-light">Provide a Service</strong>
              </p>
            </div>
          </div>

          <div className="level-right">
            <p className="level-item">
              <a onClick={toggleSideNav} className="button is-link">
                <span className="icon">
                  <i className="fas fa-filter" />
                </span>
                <span>Filter</span>
              </a>
            </p>
          </div>
        </nav>
      </div>
    </section>
  );
};

const Tabs = ({ activeTab, changeActiveTab, isLoggedIn }) => {
  return (
    <div className="tabs is-marginless">
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
