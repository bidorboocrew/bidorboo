/*global google*/
import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import RequestsTabSummaryCard from '../components/RequestsTabSummaryCard';

import MineTabSummaryCard from './../components/MineTabSummaryCard';

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
    const isMyJob = job._ownerRef._id === userDetails._id;
    const showJobSummaryCard = isMyJob
      ? () => (
          <MineTabSummaryCard
            onClickHandler={() => {
              switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
            }}
            onCloseHandler={toggleShowInfoBox}
            cardSpecialclassName="bdb-infoBoxCard"
            showCoverImg={false}
            withButtons={true}
            job={job}
            userDetails={userDetails}
          />
        )
      : () => (
          <RequestsTabSummaryCard
            onClickHandler={() => {
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                selectJobToBidOn(job);
              }
            }}
            onCloseHandler={toggleShowInfoBox}
            cardSpecialclassName="bdb-infoBoxCard"
            showCoverImg={false}
            withButtons={true}
            job={job}
            userDetails={userDetails}
          />
        );
    return (
      <InfoBox
        className="info-Box-map"
        options={{
          pixelOffset: new google.maps.Size(-50, -10),
          zIndex: 999,
          boxStyle: {
            padding: '0px 0px 0px 0px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
          },
          closeBoxURL: '',
          infoBoxClearance: new google.maps.Size(1, 1),
          isHidden: false,
          pane: 'mapPane',
          enableEventPropagation: true,
        }}
      >
        {showJobSummaryCard()}
      </InfoBox>
    );
  }
}
