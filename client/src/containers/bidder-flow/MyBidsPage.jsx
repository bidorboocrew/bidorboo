import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';

import { getMyOpenBids } from '../../app-state/actions/bidsActions';
import { getMyAwardedBids, updateBidState } from '../../app-state/actions/bidsActions';

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
    this.props.a_getAllPostedBids();
    this.props.a_getMyAwardedBids();
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
      a_updateBidState,
    } = this.props;

    const { activeTab } = this.state;

    const pendingBidsList =
      openBidsList && openBidsList.length > 0 ? (
        openBidsList.map((bidDetails) => {
          return (
            <div key={bidDetails._id} className="column limitMaxdWidth">
              <MyBidsOpenBid key={bidDetails._id} bidDetails={bidDetails} />
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
                updateBidState={a_updateBidState}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    return (
      <div className="container is-widescreen bidorbooContainerMargins">
        <FloatingAddNewBidButton />

        <div style={{ position: 'relative' }} className="tabs is-large">
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
            {/* <h1 className="is-size-5">{`Awarded Bids  (${(awardedBidsList &&
              awardedBidsList.length) ||
              0})`}</h1> */}
            <div className="container is-widescreen bidorbooContainerMargins">
              <div className="tabs is-medium ">
                <ul>
                  <li>
                    <a className="has-text-weight-bold">
                      {`Awarded Bids  (${(awardedBidsList && awardedBidsList.length) || 0})`}
                    </a>
                  </li>
                </ul>
              </div>

              {isLoading && <Spinner isLoading={isLoading} size={'large'} />}
              {!isLoading && (
                <div
                  style={{ borderLeft: '1px solid #23d160' }}
                  className="columns is-multiline is-mobile is-centered"
                >
                  {awardedBidsListComponent}
                </div>
              )}
            </div>
            <div className="container is-widescreen bidorbooContainerMargins">
              <div className="tabs is-medium">
                <ul>
                  <li>
                    <a className="has-text-weight-bold">
                      {`Pending Bids  (${(pendingBidsList && pendingBidsList.length) || 0})`}
                    </a>
                  </li>
                </ul>
              </div>
              {isLoading && <Spinner isLoading={isLoading} size={'large'} />}
              {!isLoading && (
                <div
                  style={{ borderLeft: '1px solid #209cee' }}
                  className="columns is-multiline is-mobile is-centered"
                >
                  {pendingBidsList}
                </div>
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
    a_getAllPostedBids: bindActionCreators(getMyOpenBids, dispatch),
    a_getMyAwardedBids: bindActionCreators(getMyAwardedBids, dispatch),
    a_updateBidState: bindActionCreators(updateBidState, dispatch),
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
      style={{
        position: 'fixed',
        bottom: '5%',
        right: '10%',
        zIndex: 999,
        width: 56,
        height: 56,
        borderRadius: '100%',
        fontSize: 36,
        fontWeight: 600,
        boxShadow:
          '0 8px 17px 2px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        switchRoute(ROUTES.CLIENT.BIDDER.root);
      }}
      className="button is-link"
    >
      <span className="icon">+ </span>
    </a>
  );
};
