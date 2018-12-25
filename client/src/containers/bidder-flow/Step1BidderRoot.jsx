import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BidderMapSection from '../../components/bidder-components/BidderMapSection';

import { Spinner } from '../../components/Spinner';
import JobsToBidOnListView from '../../components/bidder-components/JobsToBidOnListView';
import JobsLocationFilterForm from '../../components/forms/JobsLocationFilterForm';

import {
  updateBooedBy,
  getAllJobsToBidOn,
  searchByLocation,
} from '../../app-state/actions/jobActions';
import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

// import BidderStepper from './BidderStepper';
import { getCurrentUser } from '../../app-state/actions/authActions';

const TAB_IDS = {
  openRequests: 'Requests',
  postedBids: 'Posted Bids',
  mine: 'Mine',
};
const google = window.google;
class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchTermActive: false,
      hideMyJobs: false,
      displayedJobList: this.props.ListOfJobsToBidOn,
      centerOfMap: {
        lng: -75.6972,
        lat: 45.4215,
      },
      activeTab: TAB_IDS.openRequests,
    };
  }
  updateMapCenter = (position) => {
    this.setState({
      centerOfMap: {
        lng: position.lng,
        lat: position.lat,
      },
    });
  };
  clearFilter = () => {
    this.setState({
      displayedJobList: this.props.ListOfJobsToBidOn,
      isSearchTermActive: false,
    });
  };
  changeActiveTab = (tabId) => {
    this.setState({ activeTab: tabId });
  };

  componentDidMount() {
    if (!this.props.isLoggedIn) {
      this.props.a_getCurrentUser();
    }

    this.props.a_getAllJobsToBidOn();
  }

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
    this.setState({
      isSearchTermActive: true,
      displayedJobList: filteredJobs,
      centerOfMap: {
        lat: locationField.lat,
        lng: locationField.lng,
      },
    });
  };

  render() {
    const {
      isLoading,
      ListOfJobsToBidOn,
      userDetails,
      a_searchByLocation,
      a_selectJobToBidOn,
      isLoggedIn,
      a_showLoginDialog,
      a_updateBooedBy,
    } = this.props;

    const currentUserId = userDetails._id;

    const { activeTab, displayedJobList, centerOfMap, isSearchTermActive } = this.state;

    let currentJobsList = isSearchTermActive ? displayedJobList : ListOfJobsToBidOn;

    if (activeTab === TAB_IDS.openRequests) {
      currentJobsList = currentJobsList.filter((job) => job._ownerRef._id !== currentUserId);
    } else if (activeTab === TAB_IDS.mine) {
      currentJobsList = currentJobsList.filter((job) => job._ownerRef._id === currentUserId);
    }

    return (
      <React.Fragment>
        {/* <BidderStepper currentStepNumber={1} /> */}

        <div className="" id="bdb-bidder-root">
          <section className="hero is-small is-dark">
            <div className="hero-body">
              <div>
                <h1 style={{ color: 'white' }} className="title">
                  Post Bids
                </h1>
              </div>
            </div>
          </section>

          {isLoading && (
            <section className="section">
              <div className="container">
                <Spinner isLoading={isLoading} size={'large'} />
              </div>
            </section>
          )}
          {!isLoading && (
            <React.Fragment>
              <section style={{ padding: 0 }} className="modal-card-body">
                <JobsLocationFilterForm
                  updateMapCenter={this.updateMapCenter}
                  onCancel={this.clearFilter}
                  onSubmit={(vals) => {
                    this.handleGeoSearch(vals);
                  }}
                />
              </section>

              <div className="tabs is-marginless">
                <ul>
                  <li className={`${activeTab === TAB_IDS.openRequests ? 'is-active' : null}`}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        this.changeActiveTab(TAB_IDS.openRequests);
                      }}
                    >
                      {TAB_IDS.openRequests}
                    </a>
                  </li>
                  <li className={`${activeTab === TAB_IDS.mine ? 'is-active' : null}`}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        this.changeActiveTab(TAB_IDS.mine);
                      }}
                    >
                      {TAB_IDS.mine}
                    </a>
                  </li>
                </ul>
              </div>
              <section className="section">
                <BidderMapSection
                  selectJobToBidOn={a_selectJobToBidOn}
                  mapCenterPoint={centerOfMap}
                  isLoggedIn={isLoggedIn}
                  showLoginDialog={a_showLoginDialog}
                  currentUserId={userDetails._id}
                  jobsList={currentJobsList}
                />
                <br />
                <JobsToBidOnListView
                  activeTab={activeTab}
                  isLoggedIn={isLoggedIn}
                  showLoginDialog={a_showLoginDialog}
                  currentUserId={userDetails._id}
                  selectJobToBidOn={a_selectJobToBidOn}
                  jobsList={currentJobsList}
                  {...this.props}
                />
              </section>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    error: jobsReducer.error,
    isLoading: jobsReducer.isLoading,
    ListOfJobsToBidOn: jobsReducer.ListOfJobsToBidOn,
    mapCenterPoint: jobsReducer.mapCenterPoint,
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllJobsToBidOn: bindActionCreators(getAllJobsToBidOn, dispatch),
    a_searchByLocation: bindActionCreators(searchByLocation, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRoot);
