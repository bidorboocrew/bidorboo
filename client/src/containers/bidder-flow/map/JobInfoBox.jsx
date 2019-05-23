/*global google*/
import React from 'react';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';

import {
  getMeTheRightRequestCard,
  POINT_OF_VIEW,
} from '../../../bdb-tasks/getMeTheRightRequestCard';
export default class JobInfoBox extends React.Component {
  render() {
    const { job, userDetails, toggleShowInfoBox } = this.props;

    return (
      <InfoBox
        id={`infobox-bid-${job._id}`}
        className="info-Box-map"
        options={{
          pixelOffset: new google.maps.Size(-50, -50),
          zIndex: 999,
          boxStyle: {
            zIndex: '30',
            padding: '0px 0px 0px 0px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
          },
          closeBoxURL: '',
          infoBoxClearance: new google.maps.Size(10, 10),
          isHidden: false,
          pane: 'mapPane',
          enableEventPropagation: true,
        }}
      >
        {getMeTheRightRequestCard({
          job,
          isSummaryView: true,
          pointOfView: POINT_OF_VIEW.TASKER,
          userDetails: userDetails,
          onCloseHandler: toggleShowInfoBox,
          isOnMapView: true,
        })}
      </InfoBox>
    );
  }
}
