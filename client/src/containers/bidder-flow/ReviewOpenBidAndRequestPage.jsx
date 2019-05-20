import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { getOpenBidDetails, updateBid } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';

import TaskerPendingBidInfo from './components/TaskerPendingBidInfo';
import jobTemplateIdToDefinitionObjectMapper from '../../bdb-tasks/jobTemplateIdToDefinitionObjectMapper';
import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightRequestCard';

class ReviewOpenBidAndRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.bidId = null;

    if (props.match && props.match.params && props.match.params.bidId) {
      this.bidId = props.match.params.bidId;
    }
  }

  componentDidMount() {
    if (!this.bidId) {
      switchRoute(ROUTES.CLIENT.BIDDER.root);
      return null;
    }

    this.props.getOpenBidDetails(this.bidId);
  }

  showBidReviewModal = (bid) => {
    this.setState({ showBidReviewModal: true, bidUnderReview: bid });
  };
  hideBidReviewModal = () => {
    this.setState({ showBidReviewModal: false, bidUnderReview: {} });
  };

  render() {
    const { selectedOpenBid, updateBid, currentUserDetails } = this.props;
    // while fetching the job
    if (
      !selectedOpenBid ||
      !selectedOpenBid._id ||
      !selectedOpenBid._jobRef ||
      !selectedOpenBid._jobRef._id
    ) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading={true} size={'large'} />
        </div>
      );
    }

    const selectedAwardedJob = selectedOpenBid._jobRef;
    const title = jobTemplateIdToDefinitionObjectMapper[selectedAwardedJob.fromTemplateId].TITLE;

    return (
      <div className="container is-widescreen">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">My Bid Details</h1>
            </div>
          </div>
        </section>
        <hr className="divider" />
        <div className="columns is-centered">
          <div className="column is-narrow">
            <div style={{ marginBottom: '0.7rem' }}>
              <a
                className="button is-outlined"
                onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.mybids)}
              >
                <span className="icon">
                  <i className="far fa-arrow-alt-circle-left" />
                </span>
                <span>View My Other Bids</span>
              </a>
            </div>

            {getMeTheRightRequestCard({
              job: selectedAwardedJob,
              isSummaryView: false,
              pointOfView: POINT_OF_VIEW.TASKER,
              userDetails: currentUserDetails,
              renderTaskerBidInfo: () => {
                return (
                  <TaskerPendingBidInfo
                    bid={selectedOpenBid}
                    job={selectedAwardedJob}
                    updateBidAction={updateBid}
                  />
                );
              },
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ bidsReducer, userReducer }) => {
  return {
    selectedOpenBid: bidsReducer.selectedOpenBid,
    isLoading: bidsReducer.isLoadingBids,
    currentUserDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOpenBidDetails: bindActionCreators(getOpenBidDetails, dispatch),
    updateBid: bindActionCreators(updateBid, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewOpenBidAndRequestPage);
