import React from 'react';
import moment from 'moment';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import {
  DisplayLabelValue,
  CountDownComponent,
  CardTitleWithBidCount,
  getDaysSinceCreated,
  AvgBidDisplayLabelAndValue,
  StartDateAndTime,
} from '../../commonComponents';

export default class MineTabSummaryCard extends React.Component {
  render() {
    const {
      job,
      showCoverImg = true,
      cardSpecialStyle = 'bidderRootSpecial',
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
        className={`card is-clipped ${cardSpecialStyle}`}
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
            <StartDateAndTime date={startingDateAndTime} />
            <AvgBidDisplayLabelAndValue bidsList={_bidsListRef} />
          </div>
          <a className="button is-info is-outlined is-fullwidth">
            <span className="icon">
              <i className="fas fa-bullseye" />
            </span>
            <span>View Details</span>
          </a>
          {withButtons && (
            <a
              style={{ marginTop: 10 }}
              onClick={onCloseHandler}
              className="button is-outlined is-small is-fullwidth"
            >
              Close
            </a>
          )}
        </div>

        {!withButtons && (
          <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />
        )}
      </div>
    );
  }
}
