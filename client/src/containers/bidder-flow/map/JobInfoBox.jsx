/*global google*/
import React from 'react';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';

import RequestsTabSummaryCard from '../components/RequestsTabSummaryCard';

export default class JobInfoBox extends React.Component {
  render() {
    const {
      job,
      userDetails,
      isLoggedIn,
      showLoginDialog,
      selectJobToBidOn,
      toggleShowInfoBox,
    } = this.props;

    return (
      <InfoBox
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
        <RequestsTabSummaryCard
          onClickHandler={() => {
            if (!isLoggedIn) {
              showLoginDialog(true);
            } else {
              selectJobToBidOn(job);
            }
          }}
          onCloseHandler={toggleShowInfoBox}
          cardSpecialStyle="bdb-infoBoxCard"
          showCoverImg={false}
          withButtons={true}
          job={job}
          userDetails={userDetails}
        />
      </InfoBox>
    );
  }
}
