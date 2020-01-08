import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MapWithAMarkerClusterer from './MapWithAMarkerClusterer';
import { showLoginDialog } from '../../../app-state/actions/uiActions';

class MapSection extends React.Component {
  render() {
    const {
      mapCenterPoint,
      isLoggedIn,
      showLoginDialog,
      userDetails,
      requestsList,
      mapZoomLevel,
    } = this.props;

    return requestsList ? (
      <MapWithAMarkerClusterer
        mapCenterPoint={mapCenterPoint}
        isLoggedIn={isLoggedIn}
        showLoginDialog={showLoginDialog}
        userDetails={userDetails}
        requestsList={requestsList}
        mapZoomLevel={mapZoomLevel}
      />
    ) : null;
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch, showLoginDialog: bindActionCreators(showLoginDialog, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSection);
