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

const TAB_IDS = {
  openRequests: 'Open Tasks',
  postedBids: 'Posted Bids',
  mine: 'Mine',
};
class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      showFilterDialog: false,
      hideMyJobs: false,
      displayedJobList: null,
      activeTab: TAB_IDS.openRequests,
    };
    autoBind(this, 'toggleFilterDialog', 'changeActiveTab');
  }
  changeActiveTab(tabId) {
    this.setState({ activeTab: tabId });
  }

  toggleFilterDialog(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      showFilterDialog: !this.state.showFilterDialog,
    });
  }

  componentDidMount() {
    this.props.a_getAllJobsToBidOn();
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

    const { activeTab } = this.state;

    let currentlyViewedjobs = [];
    let jobsList =
      this.state.displayedJobList === null ? ListOfJobsToBidOn : this.state.displayedJobList;

    if (activeTab === TAB_IDS.openRequests) {
      currentlyViewedjobs = jobsList.filter((job) => job._ownerRef._id !== currentUserId);
    } else if (activeTab === TAB_IDS.mine) {
      currentlyViewedjobs = jobsList.filter((job) => job._ownerRef._id === currentUserId);
    }

    return (
      <React.Fragment>
        {/* <BidderStepper currentStepNumber={1} /> */}

        {this.state.showFilterDialog && (
          <div className="modal is-active">
            <div onClick={this.toggleFilterDialog} className="modal-background" />
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Filter Jobs</p>
                <button onClick={this.toggleFilterDialog} className="delete" aria-label="close" />
              </header>
              <section style={{ padding: 0 }} className="modal-card-body">
                <JobsLocationFilterForm
                  onCancel={() => {
                    this.setState({ showFilterDialog: false });
                  }}
                  onSubmit={(vals) => {
                    a_searchByLocation(vals);
                    this.setState({ showFilterDialog: false });
                  }}
                />
              </section>
            </div>

            <button onClick={this.toggleFilterDialog} className="modal-close " aria-label="close" />
          </div>
        )}

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
              onCancel={() => {
                this.setState({ showFilterDialog: false });
              }}
              onSubmit={(vals) => {
                a_searchByLocation(vals);
                this.setState({ showFilterDialog: false });
              }}
            />
          </section>
          <section style={{ paddingBottom: 0 }} className="section">
            {/* {!isLoading && ListOfJobsToBidOn && ListOfJobsToBidOn.length > 0 && (
              <a
                style={{ marginBottom: '1.5rem' }}
                onClick={this.toggleFilterDialog}
                className="button"
              >
                Filter Jobs
              </a>
            )} */}

            <div>
              <BidderMapSection
                selectJobToBidOn={a_selectJobToBidOn}
                mapCenterPoint={mapCenterPoint}
                isLoggedIn={isLoggedIn}
                showLoginDialog={a_showLoginDialog}
                currentUserId={userDetails._id}
                jobsList={currentlyViewedjobs}
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
                jobsList={currentlyViewedjobs}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(windowSize(BidderRoot));
