import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BidderMapSection from '../../components/bidder-components/BidderMapSection';

import { Spinner } from '../../components/Spinner';
import JobsToBidOnListView from '../../components/bidder-components/JobsToBidOnListView';
import JobsLocationFilterForm from '../../components/forms/JobsLocationFilterForm';

import { getAllJobsToBidOn, searchByLocation } from '../../app-state/actions/jobActions';
import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import BidderStepper from './BidderStepper';
class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      showFilterDialog: false,
      hideMyJobs: false,
      displayedJobList: null,
    };
    autoBind(this, 'toggleFilterDialog');
  }

  toggleFilterDialog(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      showFilterDialog: !this.state.showFilterDialog,
    });
  }

  // toggleHideMyJobs(e, excludeMyJobs) {
  //   e.preventDefault();

  //   const { ListOfJobsToBidOn, userDetails } = this.props;
  //   if (userDetails && ListOfJobsToBidOn && ListOfJobsToBidOn.length > 0 && excludeMyJobs) {
  //     const filteredJobList = ListOfJobsToBidOn.filter((job) => {
  //       return userDetails._id !== job._ownerRef._id;
  //     });
  //     this.setState({
  //       ...this.state,
  //       hideMyJobs: true,
  //       displayedJobList: filteredJobList,
  //     });
  //   } else {
  //     this.setState({
  //       ...this.state,
  //       hideMyJobs: false,
  //       displayedJobList: ListOfJobsToBidOn,
  //     });
  //   }
  // }

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

    const userId = userDetails._id;

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
          {/* <section className="hero is-small">
            <div style={{ backgroundColor: '#F0A6CA' }} className="hero-body">
              <div className="container">
                <h1 style={{ color: 'white' }} className="title">
                  Bid
                </h1>
                <h2 style={{ color: 'white' }} className="subtitle">
                  Start Earning money by doing things you are good at.
                </h2>
              </div>
            </div>
          </section> */}
          {/* map view */}

          <section className="section">
            <div>
              {isLoading && <Spinner isLoading={isLoading} size={'large'} />}
              {!isLoading && (
                <BidderMapSection
                  selectJobToBidOn={a_selectJobToBidOn}
                  mapCenterPoint={mapCenterPoint}
                  isLoggedIn={isLoggedIn}
                  showLoginDialog={a_showLoginDialog}
                  currentUserId={userDetails._id}
                  jobsList={
                    this.state.displayedJobList === null
                      ? ListOfJobsToBidOn
                      : this.state.displayedJobList
                  }
                />
              )}
            </div>
            <br />
            <div>
              {!isLoading && ListOfJobsToBidOn && ListOfJobsToBidOn.length > 0 && (
                <a
                  style={{ marginBottom: '1.5rem' }}
                  onClick={this.toggleFilterDialog}
                  className="button"
                >
                  Filter Jobs
                </a>
              )}

              <JobsToBidOnListView
                isLoggedIn={isLoggedIn}
                showLoginDialog={a_showLoginDialog}
                currentUserId={userDetails._id}
                selectJobToBidOn={a_selectJobToBidOn}
                jobsList={
                  this.state.displayedJobList === null
                    ? ListOfJobsToBidOn
                    : this.state.displayedJobList
                }
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
)(BidderRoot);
