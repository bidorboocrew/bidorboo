import React from 'react';
import MapWithAMarkerClusterer from '../googleMapsComponents/MapWithAMarkerClusterer';

export default class BidderMapSection extends React.Component {
  render() {
    const { jobsList, mapCenterPoint, selectJobToBidOn } = this.props;
    return jobsList && jobsList.length > 0 ? (
      <MapWithAMarkerClusterer
        selectJobToBidOn={selectJobToBidOn}
        mapCenterPoint={mapCenterPoint}
        markers={jobsList}
      />
    ) : null;
  }
}
