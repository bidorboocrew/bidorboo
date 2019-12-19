import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { RenderBackButton } from '../commonComponents';

import { Spinner } from '../../components/Spinner';
import {
  getAwardedRequestFullDetailsforRequester,
  requesterConfirmsRequestCompletion,
} from '../../app-state/actions/requestActions';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';

class ReviewMyAwardedRequestAndWinningBidPage extends React.Component {
  constructor(props) {
    super(props);
    this.requestId = null;

    if (props.match && props.match.params && props.match.params.requestId) {
      this.requestId = props.match.params.requestId;
    }
  }

  componentDidMount() {
    const { getAwardedRequestFullDetailsforRequester } = this.props;
    if (!this.requestId) {
      switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
      return null;
    }

    getAwardedRequestFullDetailsforRequester(this.requestId);
  }

  componentDidUpdate() {
    // if route changed reload the request
    let newRequestId = this.requestId;

    if (this.props.match && this.props.match.params && this.props.match.params.requestId) {
      newRequestId = this.props.match.params.requestId;
    }
    if (newRequestId !== this.requestId) {
      this.requestId = newRequestId;
      if (!this.requestId) {
        switchRoute(ROUTES.CLIENT.REQUESTER.myRequestsPage);
        return null;
      }

      this.props.getAwardedRequestFullDetailsforRequester(this.requestId);
    }
  }

  render() {
    const { selectedAwardedRequest } = this.props;

    if (!selectedAwardedRequest || !selectedAwardedRequest._id) {
      return (
        <div className="container is-widescreen">
          <Spinner renderLabel={'Getting Your Request Details'} isLoading={true} size={'large'} />
        </div>
      );
    }

    return (
      <div className="columns is-centered is-mobile">
        <div className="column limitLargeMaxWidth slide-in-right">
          <RenderBackButton />
          {getMeTheRightRequestCard({
            request: selectedAwardedRequest,
            isSummaryView: false,
            pointOfView: POINT_OF_VIEW.REQUESTER,
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ requestsReducer, userReducer }) => {
  return {
    selectedAwardedRequest: requestsReducer.selectedAwardedRequest,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAwardedRequestFullDetailsforRequester: bindActionCreators(
      getAwardedRequestFullDetailsforRequester,
      dispatch,
    ),
    requesterConfirmsRequestCompletion: bindActionCreators(
      requesterConfirmsRequestCompletion,
      dispatch,
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewMyAwardedRequestAndWinningBidPage);
