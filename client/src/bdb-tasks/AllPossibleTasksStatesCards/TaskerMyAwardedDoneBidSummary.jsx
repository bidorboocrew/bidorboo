import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { proposerConfirmsJobCompletion } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import {
  CountDownComponent,
  StartDateAndTime,
  DisplayShortAddress,
} from '../../containers/commonComponents';
import { cancelAwardedBid } from '../../app-state/actions/bidsActions';

import TASKS_DEFINITIONS from '../tasksDefinitions';

class TaskerMyAwardedDoneBidSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteDialog: false,
      showMoreOptionsContextMenu: false,
      showMore: false,
    };
  }

  toggleShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };
  toggleDeleteConfirmationDialog = () => {
    this.setState({ showDeleteDialog: !this.state.showDeleteDialog });
  };

  toggleShowMoreOptionsContextMenu = (e) => {
    e.preventDefault();
    this.setState({ showMoreOptionsContextMenu: !this.state.showMoreOptionsContextMenu }, () => {
      if (this.state.showMoreOptionsContextMenu) {
        document.addEventListener('mousedown', this.handleClick, false);
      } else {
        document.removeEventListener('mousedown', this.handleClick, false);
      }
    });
  };

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (e) => {
    if (this.node && e.target && this.node.contains(e.target)) {
      return;
    } else {
      this.toggleShowMoreOptionsContextMenu(e);
    }
  };
  render() {
    const { bid, job, cancelAwardedBid } = this.props;
    if (!bid || !job || !cancelAwardedBid) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }

    const {
      startingDateAndTime,
      addressText,
      isPastDue,
      isHappeningSoon,
      isHappeningToday,
      _reviewRef = {
        revealToBoth: false,
        requiresProposerReview: true,
        requiresBidderReview: true,
      },
    } = job;
    if (
      !startingDateAndTime ||
      !addressText ||
      isHappeningSoon === 'undefined' ||
      isHappeningToday === 'undefined' ||
      isPastDue === 'undefined'
    ) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }
    const { TITLE, ICON } = TASKS_DEFINITIONS[`${job.templateId}`];
    if (!TITLE) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }
    const { displayStatus, bidAmount, _id } = bid;
    if (!displayStatus || !bidAmount || !_id) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }
    // xxx get currency from processed payment
    const { value: bidValue, currency: bidCurrency } = bidAmount;
    if (!bidValue || !bidCurrency) {
      return <div>TaskerMyAwardedDoneBidSummary missing properties</div>;
    }

    const { revealToBoth, requiresProposerReview, requiresBidderReview } = _reviewRef;

    const { showDeleteDialog, showMoreOptionsContextMenu } = this.state;

    return (
      <div className={`card limitWidthOfCard`}>
        <div className="card-content">
          <div className="content">
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                <span className="icon">
                  <i className={ICON} />
                </span>
                <span style={{ marginLeft: 4 }}>{TITLE}</span>
              </div>
              <div
                ref={(node) => (this.node = node)}
                className={`dropdown is-right ${showMoreOptionsContextMenu ? 'is-active' : ''}`}
              >
                <div className="dropdown-trigger">
                  <button
                    onClick={this.toggleShowMoreOptionsContextMenu}
                    className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    style={{ border: 'none' }}
                  >
                    <div style={{ padding: 6 }} className="icon">
                      <i className="fas fa-ellipsis-v" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: ' whitesmoke',
                border: 'none',
                display: 'block',
                height: 2,
                margin: '0.5rem 0',
              }}
              className="navbar-divider"
            />
            {!requiresBidderReview && (
              <div className="group">
                <label className="label">Request Status</label>
                <div className="control has-text-dark">Archived !</div>
                <div className="help">* Congratulations. This was a success</div>
              </div>
            )}

            {requiresBidderReview && (
              <div className="group">
                <label className="label">Request Status</label>
                <div className="control has-text-success">Done!</div>
                <div className="help">
                  * Congratulations. Now it is time to review the Requester
                </div>
              </div>
            )}
            <div className="group">
              <label className="label">My Bid</label>
              <div className="control">{`${bidValue -
                Math.ceil(bidValue * 0.04)}$ (${bidCurrency})`}</div>
              <div className="help">* Paid Out</div>
            </div>
            <StartDateAndTime
              date={startingDateAndTime}
              renderHelpComponent={() => (
                <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
              )}
            />
          </div>
        </div>

        <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
          {requiresBidderReview && (
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className={`button is-fullwidth is-success`}
            >
              Review Requester
            </a>
          )}
          {!requiresBidderReview && (
            <a
              onClick={() => {
                switchRoute(
                  ROUTES.CLIENT.BIDDER.dynamicReviewMyAwardedBidAndTheRequestDetails(bid._id),
                );
              }}
              className={`button is-fullwidth`}
            >
              View In Archive
            </a>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    selectedAwardedJob: jobsReducer.selectedAwardedJob,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    proposerConfirmsJobCompletion: bindActionCreators(proposerConfirmsJobCompletion, dispatch),
    cancelAwardedBid: bindActionCreators(cancelAwardedBid, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskerMyAwardedDoneBidSummary);
