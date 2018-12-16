import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BidderMapSection from '../../components/bidder-components/BidderMapSection';

import { Spinner } from '../../components/Spinner';
import JobsToBidOnListView from '../../components/bidder-components/JobsToBidOnListView';
import JobsLocationFilterForm from '../../components/forms/JobsLocationFilterForm';

import { getAllJobsToBidOn, searchByLocation } from '../../app-state/actions/jobActions';
import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import windowSize from 'react-window-size';

import BidderStepper from './BidderStepper';
import { getCurrentUser } from '../../app-state/actions/authActions';

const TAB_IDS = {
  openRequests: 'Open Tasks',
  postedBids: 'Posted Bids',
  mine: 'Mine',
};
const google = window.google;
class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      hideMyJobs: false,
      displayedJobList: this.props.ListOfJobsToBidOn,
      centerOfMap: {
        lng: -75.6972,
        lat: 45.4215,
      },
      activeTab: TAB_IDS.openRequests,
    };
    autoBind(this, 'updateMapCenter', 'toggleFilterDialog', 'changeActiveTab', 'handleGeoSearch');
  }
  updateMapCenter(position) {
    debugger;
    this.setState({
      centerOfMap: {
        lng: position.lng,
        lat: position.lat,
      },
    });
  }

  changeActiveTab(tabId) {
    this.setState({ activeTab: tabId });
  }

  componentDidMount() {
    if (!this.props.isLoggedIn) {
      this.props.a_getCurrentUser();
    }

    this.props.a_getAllJobsToBidOn();
  }

  handleGeoSearch(vals) {
    const { locationField, searchRaduisField } = vals;

    let searchArea = new google.maps.Circle({
      center: new google.maps.LatLng(locationField.lat, locationField.lng),
      radius: searchRaduisField * 1000, //in KM
    });
    const center = searchArea.getCenter();
    const raduis = searchArea.getRadius();

    let filteredJobs = this.props.ListOfJobsToBidOn.filter((job) => {
      let marker = new google.maps.LatLng(job.location.coordinates[1], job.location.coordinates[0]);

      if (google.maps.geometry.spherical.computeDistanceBetween(marker, center) <= raduis) {
        debugger;
        return true;
      }
      return false;
    });
    debugger;
    this.setState({
      displayedJobList: filteredJobs,
      centerOfMap: {
        lat: locationField.lat,
        lng: locationField.lng,
      },
    });
  }

  render() {
    const {
      isLoading,
      ListOfJobsToBidOn,
      userDetails,
      a_searchByLocation,
      mapCenterPoint,
      a_selectJobToBidOn,
      isLoggedIn,
      a_showLoginDialog,
    } = this.props;

    const currentUserId = userDetails._id;

    if (isLoading) {
      return <Spinner isLoading={isLoading} size={'large'} />;
    }

    const { activeTab, displayedJobList, centerOfMap } = this.state;
    debugger;

    let currentlyViewedjobs = [];
    let currentJobsList =
      displayedJobList && displayedJobList.length > 0 ? displayedJobList : ListOfJobsToBidOn;
    if (activeTab === TAB_IDS.openRequests) {
      currentlyViewedjobs = currentJobsList.filter((job) => job._ownerRef._id !== currentUserId);
    } else if (activeTab === TAB_IDS.mine) {
      currentlyViewedjobs = currentJobsList.filter((job) => job._ownerRef._id === currentUserId);
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
          <section style={{ padding: 0 }} className="modal-card-body">
            <JobsLocationFilterForm
              updateMapCenter={this.updateMapCenter}
              onCancel={() => {
                this.setState({ showFilterDialog: false });
              }}
              onSubmit={(vals) => {
                this.handleGeoSearch(vals);
                // a_searchByLocation(vals);
                this.setState({ showFilterDialog: false });
              }}
            />
          </section>
          <section style={{ paddingBottom: 0 }} className="section">
            <div>
              <BidderMapSection
                selectJobToBidOn={a_selectJobToBidOn}
                mapCenterPoint={centerOfMap}
                isLoggedIn={isLoggedIn}
                showLoginDialog={a_showLoginDialog}
                currentUserId={userDetails._id}
                jobsList={currentJobsList}
              />
            </div>
          </section>
          <section className="section">
            <div className="tabs">
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
            <div>
              <JobsToBidOnListView
                activeTab={activeTab}
                isLoggedIn={isLoggedIn}
                showLoginDialog={a_showLoginDialog}
                currentUserId={userDetails._id}
                selectJobToBidOn={a_selectJobToBidOn}
                jobsList={currentJobsList}
                {...this.props}
              />
            </div>
          </section>
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
)(windowSize(BidderRoot));
