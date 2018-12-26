import React from 'react';
import moment from 'moment';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  DisplayLabelValue,
  CountDownComponent,
  CardTitleWithBidCount,
  JobStats,
  getDaysSinceCreated,
  MinBidDisplayLabelValue,
} from '../../commonComponents';

export default class MineTabSummaryCard extends React.Component {
  render() {
    const {
      job,
      showCoverImg = true,
      cardSpecialClass = 'bidderRootSpecial',
      onClickHandler = () => null,
      onCloseHandler = () => null,
      withButtons = false,
    } = this.props;
    const { startingDateAndTime, createdAt, fromTemplateId, _bidsListRef, viewedBy, state } = job;

    let daysSinceCreated = getDaysSinceCreated(createdAt);
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          if (!withButtons) {
            onClickHandler();
          }
        }}
        className={`card is-clipped ${cardSpecialClass}`}
      >
        <CardTitleWithBidCount
          jobState={state}
          fromTemplateId={fromTemplateId}
          bidsList={_bidsListRef}
        />

        {showCoverImg && (
          <div className="card-image is-clipped">
            <img className="bdb-cover-img" src={`${templatesRepo[fromTemplateId].imageUrl}`} />
          </div>
        )}
        <div
          style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', position: 'relative' }}
          className="card-content"
        >
          <DisplayLabelValue labelText="Requester:" labelValue={'Me'} />
          <div className="content">
            <DisplayLabelValue
              labelText="Start Date:"
              labelValue={
                startingDateAndTime && ` ${moment(startingDateAndTime.date).format('MMMM Do YYYY')}`
              }
            />
            <MinBidDisplayLabelValue bidsList={_bidsListRef} />

            <JobStats daysSinceCreated={daysSinceCreated} viewedBy={viewedBy} />
          </div>
        </div>
        {withButtons && (
          <footer className="card-footer">
            <div className="card-footer-item">
              <a onClick={onClickHandler} className="button is-success is-fullwidth">
                View Bids
              </a>
            </div>
            <div className="card-footer-item">
              <a onClick={onCloseHandler} className="button is-outlined is-fullwidth">
                Close
              </a>
            </div>
          </footer>
        )}

        <CountDownComponent startingDate={startingDateAndTime.date} isJobStart={false} />
      </div>
    );
  }
}
