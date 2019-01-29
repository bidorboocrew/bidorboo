import React from 'react';
import ReactDOM from 'react-dom';

import { AddAwardedJobToCalendar } from './helperComponents';
import { isHappeningToday } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
export default class RequesterAndMyAwardedBid extends React.Component {
  render() {
    const { bid, job, isReadOnlyView = false } = this.props;

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

    const { startingDateAndTime, jobCompletion } = job;
    const isJobHappeningToday = isHappeningToday(startingDateAndTime);

    const didBidderConfirmCompletionAlready = jobCompletion.bidderConfirmed;

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

          {!isReadOnlyView && (
            <div>
              {/* job happened and is confirmed completion . show redirect to review page button */}

              {didBidderConfirmCompletionAlready && (
                <a
                  className="button is-info heartbeatInstant"
                  onClick={() => {
                    switchRoute(
                      ROUTES.CLIENT.REVIEW.getBidderJobReview(
                        bid._bidderRef._id,
                        bid._id,
                        job._ownerRef._id,
                        job._id,
                      ),
                    );
                  }}
                >
                  Review This Task
                </a>
              )}
              {/* job is happening today show confirm job completion flow*/}
              {isJobHappeningToday && !didBidderConfirmCompletionAlready && (
                <BidderConfirmsJobIsDone {...this.props} />
              )}
              {/* job is not happening today show add to calendar*/}
              {!isJobHappeningToday && <AddAwardedJobToCalendar job={job} />}
            </div>
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
      showConfirmationModal: false,
      successfulCompletion: false,
    };
  }

  toggleSuccessfulCompletion = () => {
    this.setState({ successfulCompletion: !this.state.successfulCompletion });
  };

  toggleModal = () => {
    this.setState({ showConfirmationModal: !this.state.showConfirmationModal });
  };

  proposerConfirmJobCompletion = () => {
    const { bidderConfirmsJobCompletion, job } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      bidderConfirmsJobCompletion(job._id);
    });
  };
  render() {
    const { successfulCompletion, dispute, showConfirmationModal } = this.state;
    return (
      <React.Fragment>
        {showConfirmationModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Congratulations</p>
                </header>
                <section className="modal-card-body">
                  <p>You have completed this task!</p>
                  <br />
                  <p>
                    We are getting in touch with the task owner to confirm the task completion. You
                    will recieve your payment shortly after we verify it. You will also get a chance
                    to rate the Task Owner and your overall experience.
                  </p>
                  <br />
                  <div>
                    <div className="control">
                      <label className="radio">
                        <input
                          checked={successfulCompletion}
                          onChange={this.toggleSuccessfulCompletion}
                          type="checkbox"
                          name="success"
                          required
                        />
                        <span className="has-text-success has-text-weight-semibold">
                          {` I Confirm that I've completed this task.`}
                        </span>
                      </label>
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    type="submit"
                    disabled={!successfulCompletion}
                    onClick={this.proposerConfirmJobCompletion}
                    className="button is-success"
                  >
                    Confirm
                  </button>
                  <button onClick={this.toggleModal} className="button is-outline">
                    Cancel
                  </button>
                  <a
                    disabled={!dispute}
                    style={{ marginTop: 6 }}
                    className="button has-text-grey is-text"
                  >
                    Report a Dispute
                  </a>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <div>
          <p className="has-text-weight-semibold">Click here after you completed this task:</p>
          <a onClick={this.toggleModal} className="button is-meduim is-success heartbeatInstant">
            I Completed this Task
          </a>
        </div>
      </React.Fragment>
    );
  }
}
