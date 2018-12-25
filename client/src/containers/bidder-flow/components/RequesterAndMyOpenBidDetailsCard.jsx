import React from 'react';

export default class MyAwardedBidDetails extends React.Component {
  render() {
    const { bid, job } = this.props;

    if (!job || !job._id || !job._ownerRef || !bid || !bid._id) {
      return null;
    }

    const { rating, displayName, profileImage } = job._ownerRef;
    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    return (
      <div
        style={{ borderRight: 0, background: '#363636', color: 'white' }}
        className="card disabled"
      >
        <header style={{ borderBottom: '1px solid white' }} className="card-header is-clipped">
          <p style={{ color: 'white' }} className="card-header-title">
            Bid Details
          </p>
        </header>
        <div className="card-content">
          <br />
          <div style={{ marginBottom: 6 }} className="has-text-weight-bold is-size-5">
            Requester Info
          </div>
          <div className="media">
            <div
              style={{
                border: '1px solid #eee',
                cursor: 'pointer',
                boxShadow:
                  '0 4px 6px rgba(255, 255, 255, 0.31), 0 1px 3px rgba(200, 200, 200, 0.08)',
              }}
              className="media-left"
            >
              <figure className="image is-48x48">
                <img src={bidderProfileImgUrl} alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="is-size-6">{displayName}</p>
              <p className="is-size-6">{bidderOverallRating}</p>
            </div>
          </div>
          <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
          <div className="help">* contact info will be displayed when you are awarded</div>

          <br />
          <div style={{ marginBottom: 6 }} className="has-text-weight-bold is-size-5">
            Your Bid Info
          </div>
          <div style={{ marginBottom: 6 }}>
            <div className="has-text-light is-size-7">Your Bid:</div>
            <div className="has-text-weight-bold is-size-6 has-text-warning">{`${bidAmount} ${bidCurrency}`}</div>
          </div>
          <div style={{ marginBottom: 6 }}>
            <div className="has-text-light is-size-7">Your Bid Status :</div>
            <div className="has-text-weight-bold is-size-6 has-text-warning">Pending</div>
          </div>
          <div className="help">* Requester did not award this job to anyone yet</div>
        </div>
      </div>
    );
  }
}

const DisplayLabelValue = (props) => {
  return (
    <div style={{ marginBottom: 6 }}>
      <div className="has-text-light is-size-7">{props.labelText}</div>
      <div className="has-text-weight-bold is-size-6 is-primary">{props.labelValue}</div>
    </div>
  );
};
