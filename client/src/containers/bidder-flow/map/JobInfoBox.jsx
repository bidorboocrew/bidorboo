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

        {/* <div className="card is-clipped bdb-infoBoxCard">
          <header className="card-header">
            <a
              style={{ borderBottom: '1px solid #dbdbdb', padding: '4px 0.75rem' }}
              onClick={this.toggleShow}
              className="is-paddingless card-header-icon is-outline"
            >
              <span style={{ color: '#a7a7a7' }} className="icon">
                <i className="fa fa-times fa-w-12" />
              </span>
            </a>
          </header>
          <div style={{ padding: '0.25rem 0.75rem' }} className="card-content">
            <div className="content">
              <div>
                <figure className="image is-48x48 is-marginless">
                  <img alt="profile" src={job._ownerRef.profileImage.url} />
                </figure>
              </div>
              <div className="level-item">
                <p className="has-text-weight-bold">{job._ownerRef.displayName}</p>
              </div>
            </div>
          </div>
          <footer style={{ padding: '2px' }} className="card-footer">
            <div className="card-footer-item is-paddingless">
              {(!isLoggedIn || job._ownerRef._id !== currentUserId) && (
                <a
                  style={{ borderRadius: 0 }}
                  className="button is-primary is-fullwidth"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoggedIn) {
                      showLoginDialog(true);
                    } else {
                      if (job._ownerRef._id !== currentUserId) {
                        this.bidOnThisJob();
                      }
                    }
                  }}
                >
                  <span style={{ marginLeft: 4 }}>
                    <i className="fas fa-dollar-sign" /> Bid
                  </span>
                </a>
              )}
              {isLoggedIn && job._ownerRef._id === currentUserId && (
                <a className="button is-static disabled is-fullwidth">My Request</a>
              )}
            </div>
          </footer>
        </div> */}
      </InfoBox>
    );
  }
}
