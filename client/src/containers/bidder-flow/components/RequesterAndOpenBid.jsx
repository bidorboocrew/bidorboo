import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../components/forms/FormsHelpers';
import { enforceNumericField } from '../../../components/forms/FormsValidators';

class RequesterAndOpenBid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showUpdateBidDialog: false,
    };
  }

  closeUpdateBidModal = (e) => {
    e.preventDefault();

    this.props.resetForm();

    this.setState({
      showUpdateBidDialog: false,
    });
  };

  showUpdateBidModal = () => {
    this.setState({
      showUpdateBidDialog: true,
    });
  };

  submitUpdateBid = (e) => {
    e.preventDefault();

    const { updateBidAction, bid, setSubmitting, values } = this.props;
    updateBidAction({ bidId: bid._id, bidAmount: values.bidAmountField });
    this.setState({
      showUpdateBidDialog: false,
    });
    setSubmitting(false);
  };

  render() {
    const {
      bid,
      job,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      isValid,
      isSubmitting,
    } = this.props;

    if (!job || !job._id || !job._ownerRef || !bid || !bid._id) {
      return null;
    }
    const { showUpdateBidDialog } = this.state;

    const { rating, displayName, profileImage } = job._ownerRef;
    const bidderProfileImgUrl = profileImage.url;
    const bidderOverallRating = rating.globalRating;
    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    return (
      <React.Fragment>
        {showUpdateBidDialog && (
          <div className="modal is-active">
            <div className="modal-background" />
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Update Your Bid</p>
                <button
                  onClick={(e) => {
                    this.closeUpdateBidModal(e);
                  }}
                  className="delete"
                  aria-label="close"
                />
              </header>
              <section className="modal-card-body">
                <div>
                  You have a placed bid for the amount of
                  <strong>{` ${bid.bidAmount.value} ${bid.bidAmount.currency} `}</strong>
                  on this job. You can keep changing your bid amount as long as the job is not
                  Awarded or Expired.
                </div>

                <br />
                <TextInput
                  setFocusImmediately={true}
                  label="Update Your Bid Amount"
                  id="bidAmountField"
                  className="input is-focused"
                  type="text"
                  onBlur={handleBlur}
                  helpText="* Enter a new bid . Bid Amount is in CAD. E.g 50"
                  error={touched.bidAmountField && errors.bidAmountField}
                  value={values.bidAmountField || ''}
                  onChange={(e) => {
                    //run normalizer to get rid of alpha chars
                    const normalizedVal = enforceNumericField(e.target.value);
                    e.target.value = normalizedVal;
                    handleChange(e);
                  }}
                />
              </section>
              <footer className="modal-card-foot">
                <button
                  disabled={isSubmitting || !isValid}
                  onClick={this.submitUpdateBid}
                  className="button is-success"
                >
                  Update
                </button>
                <button
                  onClick={(e) => {
                    this.closeUpdateBidModal(e);
                  }}
                  className="button is-outline"
                >
                  Cancel
                </button>
              </footer>
            </div>
          </div>
        )}

        <div style={{ height: 'auto' }} className="card disabled">
          <header className="card-header is-clipped">
            <p className="card-header-title"> Your Bid Info</p>
          </header>
          <div className="card-content">
            <br />
            {/* <div style={{ marginBottom: 6 }} className="has-text-weight-bold is-size-5">
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
            </div>*/}
            <div style={{ marginBottom: 6 }}>
              <div className="is-size-7">Your Bid:</div>

              <div className="is-size-6">
                <span className="has-text-weight-bold">{`${bidAmount} ${bidCurrency}`}</span>
                <a
                  onClick={() => {
                    this.showUpdateBidModal();
                  }}
                  style={{
                    boxShadow:
                      '0 2px 3px rgba(255, 255, 255, 0.31), 0 1px 3px rgba(200, 200, 200, 0.08)',
                    marginLeft: 10,
                  }}
                  className="button is-outline is-small has-text-dark"
                >
                  <span className="icon">
                    <i className="far fa-edit" />
                  </span>
                  <span>Edit</span>
                </a>
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div className="is-size-7">Your Bid Status :</div>
              <div className="is-size-6">Pending</div>
            </div>
            <div className="help">* Requester did not award this job to anyone yet</div>
          </div>
        </div>
      </React.Fragment>
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

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    bidAmountField: Yup.number()
      .positive('Can only have positive integers')
      .max(9999, 'The maximum amout is 9999')
      .required('amount is required.'),
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    props.updateBidAction({ bidId: props.bid._id, bidAmount: values.bidAmountField });
    this.closeUpdateBidModal();
    setSubmitting(false);
  },
  displayName: 'UpdateBidForm',
});

export default EnhancedForms(RequesterAndOpenBid);
