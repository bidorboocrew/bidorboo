import React from 'react';
import { AddAwardedJobToCalendar } from './helperComponents';
import { isHappeningToday } from '../../../utils';

export default class RequesterAndAwardedBid extends React.Component {
  render() {
    const { bid, job } = this.props;

    if (!job || !job._id || !job._ownerRef || !bid || !bid._id) {
      return null;
    }

    const {
      rating,
      displayName,
      profileImage,
      email = { emailAddress: 'not provided' },
      phone = { phoneNumber: 'not provided' },
    } = job._ownerRef;
    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    const { startingDateAndTime } = job;
    const isJobHappeningToday = isHappeningToday(startingDateAndTime.date);

    return (
      <div className="card disabled">
        <header className="card-header is-clipped">
          <p className="card-header-title">Your Bid Info</p>
        </header>
        <div className="card-content">
          <br />
          {/*     <div style={{ marginBottom: 6 }} className="has-text-weight-bold is-size-5">
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
          <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
          <DisplayLabelValue labelText="Phone Number:" labelValue={phone.phoneNumber} />
          <br />
          <div style={{ marginBottom: 6 }} className="has-text-weight-bold is-size-5">
            Your Bid Info
          </div>*/}
          <div style={{ marginBottom: 6 }}>
            <div className="is-size-7">Your Bid:</div>
            <div className="is-size-6 has-text-success has-text-weight-bold">{`${bidAmount} ${bidCurrency}`}</div>
          </div>
          <div style={{ marginBottom: 6 }}>
            <div className="is-size-7">Your Bid Status :</div>
            <div className="is-size-6 has-text-success has-text-weight-bold">Awarded</div>
          </div>
          <div className="help">* you will recieve the payment after completing the task</div>
          <br />

          {isJobHappeningToday ? (
            <BidderConfirmsJobIsDone />
          ) : (
            <AddAwardedJobToCalendar job={job} />
          )}
        </div>
      </div>
    );
  }
}

const DisplayLabelValue = (props) => {
  return (
    <div style={{ marginBottom: 6 }}>
      <div className="is-size-7">{props.labelText}</div>
      <div className="is-size-6 is-success">{props.labelValue}</div>
    </div>
  );
};

class BidderConfirmsJobIsDone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successfulCompletion: true,
      dispute: false,
    };
  }
  render() {
    const { successfulCompletion, dispute } = this.state;
    return (
      <div>
        <div className="control">
          <label className="radio">
            <input
              checked={successfulCompletion}
              onChange={() => this.setState({ successfulCompletion: true, dispute: false })}
              type="radio"
              name="success"
            />
            {' By clicking this I confirm that I have fullfilled this job and both '}
          </label>
        </div>
        <a
          disabled={!successfulCompletion}
          style={{ marginTop: 6 }}
          className={`button is-success ${successfulCompletion ? 'heartbeat' : ''}`}
        >
          Confirm Job is Completed
        </a>
        <div style={{ marginTop: 20 }} className="control">
          <label className="radio">
            <input
              checked={dispute}
              onChange={() => this.setState({ dispute: true, successfulCompletion: false })}
              type="radio"
              name="dispute"
            />
            {' I would like to file a dispute'}
          </label>
        </div>
        <a disabled={!dispute} style={{ marginTop: 6 }} className="button is-danger is-outlined">
          Report a dispute
        </a>
      </div>
    );
  }
}
