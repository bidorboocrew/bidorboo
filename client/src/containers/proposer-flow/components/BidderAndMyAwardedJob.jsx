import React from 'react';
import ReactDOM from 'react-dom';
import ReactStars from 'react-stars';

import { AddAwardedJobToCalendar } from './helperComponents';
import { isBeforeToday } from '../../../utils';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

export default class BidderAndMyAwardedJob extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAcceptModal: false,
    };
  }

  render() {
    const { bid, job, isReadOnlyView = false } = this.props;
    if (!bid || !bid._id || !bid._bidderRef || !job || !job._id) {
      return null;
    }

    const { rating, displayName, profileImage, email, phone, _id } = bid._bidderRef;

    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    const { startingDateAndTime, jobCompletion } = job;
    const isJobHappeningBeforeEndOfToday = isBeforeToday(startingDateAndTime);

    const didProposerConfirmCompletionAlready = jobCompletion.proposerConfirmed;

    return (
      <div style={{ height: 'auto' }} className="card disabled">
        <header className="card-header is-clipped">
          <p className="card-header-title">Awarded Bidder Details</p>
        </header>
        <div className="card-content">
          <br />
          <div className="media">
            <div
              style={{
                border: '1px solid #eee',
                cursor: 'pointer',
                boxShadow:
                  '0 4px 6px rgba(255, 255, 255, 0.31), 0 1px 3px rgba(200, 200, 200, 0.08)',
              }}
              onClick={() => {
                switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(_id));
              }}
              className="media-left"
            >
              <figure className="image is-48x48">
                <img src={bidderProfileImgUrl} alt="img" />
              </figure>
            </div>
            <div className="media-content">
              <p className="is-size-6">{displayName}</p>
              {bidderOverallRating === 'No Ratings Yet' || bidderOverallRating === 0 ? (
                <p className="is-size-6">No Ratings Yet</p>
              ) : (
                <ReactStars
                  className="is-size-6"
                  half
                  count={5}
                  value={bidderOverallRating}
                  edit={false}
                  size={25}
                  color1={'lightgrey'}
                  color2={'#ffd700'}
                />
              )}
            </div>
          </div>

          <div className="is-size-7" />
          <br />
          <div style={{ marginBottom: 6 }} className="has-text-weight-bold is-size-5">
            Contact Info
          </div>
          <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
          <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
          <DisplayLabelValue
            labelText="Phone Number:"
            labelValue={phone.phoneNumber || 'not provided'}
          />
          <DisplayLabelValue labelText="Bid Amount :" labelValue={`${bidAmount} ${bidCurrency}`} />
          <br />
          {!isReadOnlyView && (
            <div>
              {/* job happened and is confirmed completion . show redirect to review page button */}
              {didProposerConfirmCompletionAlready && (
                <a
                  className="button is-info heartbeatInstant"
                  onClick={() => {
                    switchRoute(
                      ROUTES.CLIENT.REVIEW.getProposerJobReview(
                        job._ownerRef._id,
                        job._id,
                        bid._bidderRef._id,
                      ),
                    );
                  }}
                >
                  Review This Task
                </a>
              )}

              {/* job is happening today show confirm job completion flow*/}
              {isJobHappeningBeforeEndOfToday && !didProposerConfirmCompletionAlready && (
                <ProposerVerifiesJobCompletion {...this.props} />
              )}
              {/* job is not happening today show add to calendar*/}
              {!isJobHappeningBeforeEndOfToday && <AddAwardedJobToCalendar job={job} />}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const DisplayLabelValue = (props) => {
  return (
    <div className="field">
      <label className="label">{props.labelText}</label>
      <div className="control"> {props.labelValue}</div>
    </div>
  );
};

class ProposerVerifiesJobCompletion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationModal: false,
      successfulCompletion: false,
    };
  }

  toggleModal = () => {
    this.setState({ showConfirmationModal: !this.state.showConfirmationModal });
  };

  toggleConfirmation = () => {
    this.setState({ successfulCompletion: !this.state.successfulCompletion });
  };

  submitConfirmation = () => {
    const { proposerConfirmsJobCompletion, job } = this.props;

    this.setState({ showConfirmationModal: false }, () => {
      proposerConfirmsJobCompletion(job._id);
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
                  <p>BidOrBoo crew is happy to help !</p>
                  <br />
                  <p>
                    Once you confirm the completion of this task you will get a chance to rate your
                    Tasker and the overall experience.
                  </p>
                  <br />
                  <div>
                    <div className="control">
                      <label className="radio">
                        <input
                          checked={successfulCompletion}
                          onChange={this.toggleConfirmation}
                          type="checkbox"
                          name="success"
                          required
                        />
                        <span className="has-text-weight-semibold">
                          {` I Confirm the task was done to my satisfaction.`}
                        </span>
                      </label>
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    type="submit"
                    disabled={!successfulCompletion}
                    onClick={this.submitConfirmation}
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
          <p className="has-text-weight-semibold">
            Click here After the Tasker is DONE thier work:
          </p>
          <a onClick={this.toggleModal} className="button is-meduim is-success heartbeatInstant">
            Tasker Completed this task
          </a>
        </div>
      </React.Fragment>
    );
  }
}
