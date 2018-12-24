import React from 'react';

export const BidderContactModal = ({ job, close }) => {
  if (!job || !job._awardedBidRef || !job._awardedBidRef._bidderRef) {
    return null;
  }
  const user = job._awardedBidRef._bidderRef;

  const { displayName, email, phone = { phoneNumber: 'none provided' } } = user;

  return (
    <div className="modal is-active">
      <div onClick={close} className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Bidder Contact Info</p>
          <button onClick={close} className="delete" aria-label="close" />
        </header>
        <section className="modal-card-body">
          <DisplayLabelValue labelText="User Name:" labelValue={displayName} />
          <DisplayLabelValue labelText="Email:" labelValue={email.emailAddress} />
          <DisplayLabelValue labelText="Phone Number:" labelValue={phone.phoneNumber} />

          <NotesDisplayAndValue
            labelText="We Advice You To:"
            labelValue={
              <React.Fragment>
                <p>1) Make sure to agree on all necessary details about the task</p>
                <p>2) Make sure to specify exact day and time</p>
                <p>
                  3) Confirm that the final price is the one listed against this job and not a dime
                  more
                </p>
              </React.Fragment>
            }
          />
          <br />
          <NotesDisplayAndValue
            labelText="notes*"
            labelValue={
              <React.Fragment>
                {/* <p>
                  - To ensure quality you will get to rate the Bidder once they fullfilled the job.
                </p>
                <p>
                  - Tasks are expected to match the scope in the listing and the final price is not
                  negotiable
                </p> */}
                <p className="has-text-weight-bold has-text-info">
                  - For safety we will handled payments automatically throught our service.
                </p>
              </React.Fragment>
            }
          />
        </section>
        <footer className="modal-card-foot">
          <button onClick={close} className="button is-success">
            Got It!
          </button>
          <button onClick={close} className="button">
            Go Back
          </button>
        </footer>
      </div>
    </div>
  );
};

const DisplayLabelValue = (props) => {
  return (
    <div style={{ padding: 4, marginBottom: 4 }}>
      <div style={{ color: 'grey', fontSize: 12 }}>{props.labelText}</div>
      <div className="has-text-weight-bold" style={{ fontSize: 14 }}>
        {props.labelValue}
      </div>
    </div>
  );
};

const NotesDisplayAndValue = (props) => {
  return (
    <div style={{ padding: 4, marginBottom: 4 }}>
      <div style={{ color: 'grey', fontSize: 12 }}>{props.labelText}</div>
      <div className="has-text-weight-bold" style={{ fontSize: 10 }}>
        {props.labelValue}
      </div>
    </div>
  );
};
