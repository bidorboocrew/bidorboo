import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitBid } from '../../app-state/actions/bidsActions';

import { RenderBackButton } from '../commonComponents';

import { getRequestToBidOnDetails } from '../../app-state/actions/bidsActions';

import { Spinner } from '../../components/Spinner';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';

class BidOnRequestPage extends React.Component {
  componentDidMount() {
    const { match, getRequestToBidOnDetails } = this.props;

    if (match.params && match.params.requestId) {
      getRequestToBidOnDetails(match.params.requestId);
    }
  }
  render() {
    const { submitBid, requestDetails, currentUserDetails, isLoggedIn, showLoginDialog } = this.props;
    let dontShowThisPage = !requestDetails || !requestDetails._id || !requestDetails._ownerRef;
    if (dontShowThisPage) {
      return (
        <section className="section">
          <Spinner renderLabel="getting request details" isLoading size={'large'} />
        </section>
      );
    }

    return (
      <>
        <div>
          <div className="columns is-centered">
            <div className="column limitLargeMaxWidth">
              <RenderBackButton />

              {getMeTheRightRequestCard({
                request: requestDetails,
                isSummaryView: false,
                pointOfView: POINT_OF_VIEW.TASKER,
                submitBid,
                userDetails: currentUserDetails,
                showLoginDialog,
                isLoggedIn,
              })}
            </div>
          </div>
        </div>
        <br />
      </>
    );
  }
}
const mapStateToProps = ({ bidsReducer, userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    requestDetails: bidsReducer.requestToBidOnDetails,
    currentUserDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    submitBid: bindActionCreators(submitBid, dispatch),
    getRequestToBidOnDetails: bindActionCreators(getRequestToBidOnDetails, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidOnRequestPage);
