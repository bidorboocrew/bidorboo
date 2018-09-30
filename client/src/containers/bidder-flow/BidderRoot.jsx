import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import GeoSearch from '../components/GeoSearch';
import BidderMapSection from '../../components/bidder-components/BidderMapSection';

import { Spinner } from '../../components/Spinner';
import JobsToBidOn from '../../components/bidder-components/JobsToBidOn';
import JobsLocationFilterForm from '../../components/forms/JobsLocationFilterForm';

import {
  getAllPostedJobs,
  searchByLocation
} from '../../app-state/actions/jobActions';
import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

// import PlacesAutocomplete, {
//   geocodeByAddress,
//   // geocodeByPlaceId,
//   getLatLng
// } from 'react-places-autocomplete';

class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    //render map only after we show everything
    this.state = {
      address: '',
      showFilterDialog: false,
      hideMyJobs: false,
      displayedJobList: null
    };
    autoBind(this, 'toggleFilterDialog', 'toggleHideMyJobs');
  }

  toggleFilterDialog(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      showFilterDialog: !this.state.showFilterDialog
    });
  }

  toggleHideMyJobs(e, excludeMyJobs) {
    e.preventDefault();

    const { s_allThePostedJobsList, s_userDetails } = this.props;
    if (
      s_userDetails &&
      s_allThePostedJobsList &&
      s_allThePostedJobsList.length > 0 &&
      excludeMyJobs
    ) {
      const filteredJobList = s_allThePostedJobsList.filter(job => {
        return s_userDetails._id !== job._ownerId._id;
      });
      this.setState({
        ...this.state,
        hideMyJobs: true,
        displayedJobList: filteredJobList
      });
    } else {
      this.setState({
        ...this.state,
        hideMyJobs: false,
        displayedJobList: s_allThePostedJobsList
      });
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { a_showLoginDialog, match } = this.props;
    const shouldShowLoginDialog = match.params.showLoginDialog;
    if (shouldShowLoginDialog === 'true') {
      a_showLoginDialog(true);
    }
    this.props.a_getAllPostedJobs();
  }

  render() {
    const {
      s_isLoading,
      s_allThePostedJobsList,
      s_userDetails,
      a_searchByLocation,
      s_mapCenterPoint,
      a_selectJobToBidOn,
      s_isLoggedIn,
      a_showLoginDialog
    } = this.props;

    return (
      <React.Fragment>
        {this.state.showFilterDialog && (
          <div
            className={classNames('modal', {
              'is-active': this.state.showFilterDialog
            })}
          >
            <div
              onClick={this.toggleFilterDialog}
              className="modal-background"
            />
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Filter Jobs</p>
                <button
                  onClick={this.toggleFilterDialog}
                  className="delete"
                  aria-label="close"
                />
              </header>
              <section style={{ padding: 0 }} className="modal-card-body">
                <JobsLocationFilterForm
                  onCancel={() => {
                    this.setState({ showFilterDialog: false });
                  }}
                  onSubmit={vals => {
                    a_searchByLocation(vals);
                    this.setState({ showFilterDialog: false });
                  }}
                />
              </section>
            </div>

            <button
              onClick={this.toggleFilterDialog}
              className="modal-close is-large"
              aria-label="close"
            />
          </div>
        )}
        <div className="slide-in-left" id="bdb-bidder-root">
          <section className="hero is-small">
            <div style={{ backgroundColor: '#c786f8' }} className="hero-body">
              <div className="container">
                <h1 style={{ color: 'white' }} className="title">
                  Bid on Jobs
                </h1>
                <h2 style={{ color: 'white' }} className="subtitle">
                  Start Earning money by doing things you are good at.
                </h2>
              </div>
            </div>
          </section>
          <section className="mainSectionContainer">
            <div className="container">
              <span>
                <a
                  style={{ marginRight: 8 }}
                  onClick={this.toggleFilterDialog}
                  className="button"
                >
                  Filter Jobs
                </a>
              </span>
              {s_isLoggedIn && (
                <span>
                  {this.state.hideMyJobs && (
                    <a
                      onClick={e => {
                        this.toggleHideMyJobs(e, false);
                      }}
                      className="button is-link"
                    >
                      Hide My Jobs
                    </a>
                  )}
                  {!this.state.hideMyJobs && (
                    <a
                      onClick={e => {
                        this.toggleHideMyJobs(e, true);
                      }}
                      className="button"
                    >
                      Hide My Jobs
                    </a>
                  )}
                </span>
              )}
            </div>
          </section>

          {/* map view */}
          <section className="mainSectionContainer">
            {s_isLoading && (
              <div className="container">
                <Spinner isLoading={s_isLoading} size={'large'} />
              </div>
            )}
            {!s_isLoading && (
              <div className="container">
                {/* <GeoSearch
              fieldId={'addressSearch'}
              onError={(e)=> {console.log('google api error '+e)}}
              handleSelect={address => {
                geocodeByAddress(address)
                  .then(results => getLatLng(results[0]))
                  .then(latLng => console.log('Success', latLng))
                  .catch(error => console.error('Error', error));
              }}
            /> */}

                <BidderMapSection
                  selectJobToBidOn={a_selectJobToBidOn}
                  mapCenterPoint={s_mapCenterPoint}
                  jobsList={
                    this.state.displayedJobList === null
                      ? s_allThePostedJobsList
                      : this.state.displayedJobList
                  }
                />
              </div>
            )}
          </section>

          {/* jobs view */}
          <section className="mainSectionContainer">
            <div className="container">
              <div
                // style={{ alignItems: 'flex-end' }}
                className="columns is-multiline"
              >
                <JobsToBidOn
                  isLoggedIn={s_isLoggedIn}
                  showLoginDialog={a_showLoginDialog}
                  currentUserId={s_userDetails._id}
                  selectJobToBidOn={a_selectJobToBidOn}
                  jobsList={
                    this.state.displayedJobList === null
                      ? s_allThePostedJobsList
                      : this.state.displayedJobList
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer, authReducer }) => {
  return {
    s_error: jobsReducer.error,
    s_isLoading: jobsReducer.isLoading,
    s_allThePostedJobsList: jobsReducer.allThePostedJobsList,
    s_mapCenterPoint: jobsReducer.mapCenterPoint,
    s_userDetails: userModelReducer.userDetails,
    s_isLoggedIn: authReducer.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_getAllPostedJobs: bindActionCreators(getAllPostedJobs, dispatch),
    a_searchByLocation: bindActionCreators(searchByLocation, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BidderRoot);
