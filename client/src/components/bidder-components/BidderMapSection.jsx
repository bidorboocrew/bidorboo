import React from 'react';
import MapWithAMarkerClusterer from '../googleMapsComponents/MapWithAMarkerClusterer';

export default class BidderMapSection extends React.Component {
  render() {
    const {
      jobsList,
      mapCenterPoint,
      selectJobToBidOn,
      currentUserId,
      isLoggedIn,
      showLoginDialog,
      markersRef,
    } = this.props;
    return jobsList ? (
      <MapWithAMarkerClusterer
        selectJobToBidOn={selectJobToBidOn}
        mapCenterPoint={mapCenterPoint}
        markers={jobsList}
        currentUserId={currentUserId}
        isLoggedIn={isLoggedIn}
        showLoginDialog={showLoginDialog}
        markersRef={markersRef}
      />
    ) : null;
  }
}
