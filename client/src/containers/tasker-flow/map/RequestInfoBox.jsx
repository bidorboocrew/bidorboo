/*global google*/

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateViewedBy } from '../../../app-state/actions/requestActions';
import { showLoginDialog } from '../../../app-state/actions/uiActions';
import React from 'react';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../../bdb-tasks/getMeTheRightCard';
export class RequestInfoBox extends React.Component {
  render() {
    const {
      request,
      userDetails,
      toggleShowInfoBox,
      isLoggedIn,
      showLoginDialog,
      updateViewedBy,
    } = this.props;

    return (
      <InfoBox
        id={`infobox-bid-${request._id}`}
        className="info-Box-map"
        options={{
          pixelOffset: new google.maps.Size(0, -5),
          zIndex: 999,
          boxStyle: {
            maxWidth: '220px',
            zIndex: '30',
            padding: '0px 0px 0px 0px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
          },
          closeBoxURL: '',
          infoBoxClearance: new google.maps.Size(20, 20),
          isHidden: false,
          pane: 'mapPane',
          enableEventPropagation: true,
        }}
      >
        {getMeTheRightRequestCard({
          request,
          isSummaryView: true,
          pointOfView: POINT_OF_VIEW.TASKER,
          onCloseHandler: toggleShowInfoBox,
          isOnMapView: true,
          isLoggedIn,
          userDetails,
          showLoginDialog,
          updateViewedBy,
        })}
      </InfoBox>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
    updateViewedBy: bindActionCreators(updateViewedBy, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestInfoBox);
