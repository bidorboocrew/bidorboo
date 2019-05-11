import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';

import { getMyOpenBids } from '../../app-state/actions/bidsActions';
import {
  getMyAwardedBids,
  updateBidState,
  deleteOpenBid,
} from '../../app-state/actions/bidsActions';

import MyBidsOpenBid from './components/MyBidsOpenBid';
import MyBidsAwardedBid from './components/MyBidsAwardedBid';
import { MYBIDS_TAB_IDS } from './components/helperComponents';
import PastBids from './PastBids';

class MyBidsPage extends React.Component {
  constructor(props) {
    super(props);
    let initialTabSelection = MYBIDS_TAB_IDS.myBidsTab;
    if (props.match && props.match.params && props.match.params.tabId) {
      const { tabId } = props.match.params;
      if (tabId && MYBIDS_TAB_IDS[`${tabId}`]) {
        initialTabSelection = MYBIDS_TAB_IDS[`${tabId}`];
      }
    }

    this.state = {
      activeTab: initialTabSelection,
    };
  }

  componentDidMount() {
    // get all posted bids
    this.props.getAllPostedBids();
    this.props.getMyAwardedBids();
  }

  changeActiveTab = (tabId) => {
    this.setState({ activeTab: tabId });
  };

  render() {
    const {
      isLoading,
      openBidsList,
      awardedBidsList,
      notificationFeed,
      updateBidState,
      deleteOpenBid,
    } = this.props;

    const { activeTab } = this.state;

    const pendingBidsList =
      openBidsList && openBidsList.length > 0 ? (
        openBidsList.map((bidDetails) => {
          return (
            <div key={bidDetails._id} className="column limitMaxdWidth">
              <MyBidsOpenBid
                deleteOpenBid={deleteOpenBid}
                key={bidDetails._id}
                bidDetails={bidDetails}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    const awardedBidsListComponent =
      awardedBidsList && awardedBidsList.length > 0 ? (
        awardedBidsList.map((bidDetails) => {
          return (
            <div key={bidDetails._id} className="column limitMaxdWidth">
              <MyBidsAwardedBid
                bidDetails={bidDetails}
                notificationFeed={notificationFeed}
                updateBidState={updateBidState}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    return (
      <div className="container is-widescreen">
        <FloatingAddNewBidButton />

        <div style={{ position: 'relative' }} className="tabs is-medium">
          <ul>
            <li className={`${activeTab === MYBIDS_TAB_IDS.myBidsTab ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(MYBIDS_TAB_IDS.myBidsTab);
                }}
              >
                {`${MYBIDS_TAB_IDS.myBidsTab}`}
              </a>
            </li>
            <li className={`${activeTab === MYBIDS_TAB_IDS.pastBids ? 'is-active' : null}`}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.changeActiveTab(MYBIDS_TAB_IDS.pastBids);
                }}
              >
                <span className="icon">
                  <i className="fas fa-history" aria-hidden="true" />
                </span>
                <span>{`${MYBIDS_TAB_IDS.pastBids} `}</span>
              </a>
            </li>
          </ul>
        </div>
        {activeTab === MYBIDS_TAB_IDS.myBidsTab && (
          <React.Fragment>
            <div className="container is-widescreen">
              <section className="hero is-dark has-text-centered">
                <div className="hero-body">
                  <div className="container">
                    <h1 className="has-text-weight-bold is-size-6">{`My Scheduled Tasks (${(awardedBidsList &&
                      awardedBidsList.length) ||
                      0})`}</h1>
                    <h2 style={{ color: 'lightgrey' }} className="is-size-8">
                      These are your upcoming scheduled tasks. Once you fulfil the task you will
                      recieve your payment.
                    </h2>
                  </div>
                </div>
              </section>

              <Spinner isLoading={isLoading} size={'large'} />
              {!isLoading && (
                <div className="columns is-multiline is-centered">
                  {awardedBidsListComponent}
                </div>
              )}
            </div>
            <br />
            <div className="container is-widescreen">
              <section className="hero is-dark has-text-centered">
                <div className="hero-body">
                  <div className="container">
                    <h1 className="has-text-weight-bold is-size-6">
                      {`Bids pending Approval (${(pendingBidsList && pendingBidsList.length) ||
                        0})`}
                    </h1>
                    <h2 style={{ color: 'lightgrey' }} className="is-size-8">
                      These are all your offers that are waiting on the Requester's approval.
                      GoodLuck!
                    </h2>
                  </div>
                </div>
              </section>
              <Spinner isLoading={isLoading} size={'large'} />
              {!isLoading && (
                <div className="columns is-multiline is-mobile is-centered">{pendingBidsList}</div>
              )}
            </div>
          </React.Fragment>
        )}
        {activeTab === MYBIDS_TAB_IDS.pastBids && <PastBids />}
      </div>
    );
  }
}

const mapStateToProps = ({ bidsReducer, uiReducer }) => {
  return {
    openBidsList: bidsReducer.openBidsList,
    isLoading: bidsReducer.isLoadingBids,
    awardedBidsList: bidsReducer.awardedBidsList,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllPostedBids: bindActionCreators(getMyOpenBids, dispatch),
    getMyAwardedBids: bindActionCreators(getMyAwardedBids, dispatch),
    updateBidState: bindActionCreators(updateBidState, dispatch),
    deleteOpenBid: bindActionCreators(deleteOpenBid, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyBidsPage);

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">You have no bids. Start bidding to earn money!</div>
            <br />
            <a
              className="button is-success "
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            >
              Bid
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const FloatingAddNewBidButton = () => {
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        switchRoute(ROUTES.CLIENT.BIDDER.root);
      }}
      className="button is-link bdbFloatingButtonText"
    >
      <span className="icon">+ </span>
    </a>
  );
};
