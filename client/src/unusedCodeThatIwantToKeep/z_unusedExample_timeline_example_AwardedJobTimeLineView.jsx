import React from 'react';
import moment from 'moment';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';

export default class AwardedJobTimeLineView extends React.Component {
  render() {
    const { job } = this.props;

    if (!job || !job._id) {
      return null;
    }

    const title = templatesRepo[job.fromTemplateId].title;
    const {
      startingDateAndTime,
      _bidsListRef,
      _ownerRef,
      state,
      viewedBy,
      booedBy,
      _awardedBidRef,
      fromTemplateId,
      reported,
      createdAt,
    } = job;

    const { bidAmount, _bidderRef } = _awardedBidRef;

    const {
      agreedToServiceTerms,
      displayName,
      email,
      membershipStatus,
      phone,
      profileImage,
      rating,
    } = _bidderRef;
    return (
      <div className="columns is-multiline">
        <div className="column">
          <div className="timeline is-centered">
            <header className="timeline-header">
              <span className="tag is-medium is-info">{`${title}`}</span>
            </header>

            {createdAt && (
              <div className="timeline-item is-info">
                <div className="timeline-marker is-info" />
                <div className="timeline-content">
                  <p className="heading">
                    {`Requested On ${moment(createdAt.date).format('MMMM Do YYYY')}`}
                  </p>
                </div>
              </div>
            )}

            <div className="timeline-item is-info">
              <div className="timeline-marker is-info" />
              <div className="timeline-content">
                {viewedBy && <p className="heading">{`${viewedBy.length} viewed it`}</p>}
                {_bidsListRef && <p className="heading">{`${booedBy.length} booed it`}</p>}
                {_bidsListRef && <p className="heading">{`${_bidsListRef.length} bid on it`}</p>}
              </div>
            </div>

            <div className="timeline-item is-info">
              <div className="timeline-marker is-info" />
              <div className="timeline-content">
                {_bidderRef && (
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-32x32">
                        <img src={profileImage.url} alt="Placeholder image" />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="is-size-6">{displayName}</p>
                      <p className="is-size-7">{rating.globalRating}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="timeline-item is-success">
              <div className="timeline-marker is-warning is-image is-32x32">
                <img src="http://bulma.io/images/placeholders/32x32.png" />
              </div>
              <div className="timeline-content">
                <p className="heading">February 2016</p>
                <p>Timeline content - Can include any HTML element</p>
              </div>
            </div>
            <header className="timeline-header">
              <span className="tag is-success">2017</span>
            </header>
            <div className="timeline-item is-danger">
              <div className="timeline-marker is-danger is-icon">
                <i className="fa fa-flag" />
              </div>
              <div className="timeline-content">
                <p className="heading">March 2017</p>
                <p>Timeline content - Can include any HTML element</p>
              </div>
            </div>

            <div className="timeline-item has-text-grey">
              <div className="timeline-marker has-text-grey" />
              <div className="timeline-content">
                <p>Review Bidder</p>
              </div>
            </div>

            <header className="timeline-header has-text-grey">
              <span className="tag is-medium has-text-grey">End</span>
            </header>
          </div>
        </div>
      </div>
    );
  }
}
