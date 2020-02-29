import React from 'react';
import ReactDOM from 'react-dom';

import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../components/forms/FormsHelpers';
import { enforceNumericField } from '../../../components/forms/FormsValidators';

class TaskerEditOrUpdateBid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateBidDialog: false,
      confirmRead: false,
    };
  }

  closeUpdateBidModal = () => {
    const { resetForm, setFieldValue } = this.props;
    setFieldValue('bidAmountField', '', false);

    resetForm();

    this.setState({ showUpdateBidDialog: false });
  };

  showUpdateBidModal = () => {
    this.setState({
      showUpdateBidDialog: true,
    });
  };

  submitUpdateBid = (e) => {
    e.preventDefault();

    const { updateBidAction, bid, setSubmitting, values, request } = this.props;
    updateBidAction({ bidId: bid._id, bidAmount: values.bidAmountField, request });
    this.setState({
      showUpdateBidDialog: false,
    });
    setSubmitting(false);
  };

  onAutoBid = (val) => {
    const { setFieldValue } = this.props;
    setFieldValue('bidAmountField', val, true);
  };

  render() {
    const {
      bid,
      request,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      isValid,
      isSubmitting,
    } = this.props;

    if (!request || !request._id || !request._ownerRef || !bid || !bid._id) {
      return null;
    }

    const { showUpdateBidDialog } = this.state;

    const bidAmount = bid.bidAmount.value;
    const isNewBid = bid.isNewBid;

    const autoBidOptions =
      bidAmount > 10 ? (
        <div className="buttons">
          <span
            onClick={() => this.onAutoBid(bidAmount - 10)}
            className="button is-success is-small"
          >
            {`${bidAmount - 10}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(bidAmount - 5)}
            className="button is-success is-small"
          >
            {`${bidAmount - 5}$`}
          </span>
          <span onClick={() => this.onAutoBid(bidAmount)} className="button is-success is-small">
            {`${bidAmount}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(bidAmount + 5)}
            className="button is-success is-small"
          >
            {`${bidAmount + 5}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(bidAmount + 10)}
            className="button is-success is-small"
          >
            {`${bidAmount + 10}$`}
          </span>
        </div>
      ) : null;
    return (
      <div>
        {/* <FloatingAddNewBidButton /> */}

        {showUpdateBidDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active has-text-left">
              <div className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Change Your Bid?</div>
                  <button
                    onClick={this.closeUpdateBidModal}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <p>
                    What is the <strong>total dollar amount</strong> do you want to receive in
                    exchange for completing this task?
                  </p>

                  <TextInput
                    label="Enter A New Bid Amount"
                    id="bidAmountField"
                    className="input is-focused"
                    helpText="remember to consider all factors like time, commute, material ..etc"
                    onBlur={handleBlur}
                    error={touched.bidAmountField && errors.bidAmountField}
                    value={values.bidAmountField || ''}
                    onChange={(e) => {
                      //run normalizer to get rid of alpha chars
                      const normalizedVal = enforceNumericField(e.target.value);
                      e.target.value = normalizedVal;
                      handleChange(e);
                    }}
                  />
                  <div style={{ marginTop: -6 }}>
                    <div className="help">quick bid options</div>
                    {autoBidOptions}
                  </div>
                </section>

                <footer className="modal-card-foot has-text-right">
                  <button onClick={this.closeUpdateBidModal} className="button is-outline">
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting || !isValid}
                    onClick={this.submitUpdateBid}
                    className="button is-success"
                  >
                    Submit Bid Changes
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('body'),
          )}
        <br></br>

        {isNewBid && (
          <div
            onClick={(e) => {
              e.preventDefault();
              this.showUpdateBidModal();
            }}
            className="button is-info centeredButtonInCard"
          >
            <span className="icon">
              <i className="far fa-edit" />
            </span>
            <span>Change Bid</span>
          </div>
        )}
      </div>
    );
  }
}

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    bidAmountField: Yup.number()
      .positive('Can only have positive integers')
      .min(20, 'The minimum bid amount is 20')
      .max(2000, 'The maximum amount is 2000')
      .required('amount is required.'),
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    props.updateBidAction({ bidId: props.bid._id, bidAmount: parseInt(values.bidAmountField) });
    this.closeUpdateBidModal();
    setSubmitting(false);
  },
  displayName: 'UpdateBidForm',
});

export default EnhancedForms(TaskerEditOrUpdateBid);
