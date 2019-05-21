import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../components/forms/FormsHelpers';
import { enforceNumericField } from '../../../components/forms/FormsValidators';
import ReCAPTCHA from 'react-google-recaptcha';

import { DisplayLabelValue } from '../../commonComponents';

class TaskerPendingBidInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateBidDialog: false,
      confirmRead: false,
      recaptchaField: '',
    };

    this.recaptchaRef = React.createRef();
  }

  updateRecaptchaField = (value) => {
    this.setState({ recaptchaField: value });
  };

  componentDidMount() {
    if (this.recaptchaRef && this.recaptchaRef.current && this.recaptchaRef.current.execute) {
      this.recaptchaRef.current.execute();
    }
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
    const { recaptchaField } = this.state;
    const { updateBidAction, bid, setSubmitting, values } = this.props;
    updateBidAction({ bidId: bid._id, bidAmount: values.bidAmountField, recaptchaField });
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

    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    const autoBidOptions =
      bidAmount > 10 ? (
        <div className="buttons">
          <span
            onClick={() => this.onAutoBid(bidAmount - 10)}
            className="button is-success is-outlined is-small"
          >
            {`${bidAmount - 10}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(bidAmount - 5)}
            className="button is-success is-outlined is-small"
          >
            {`${bidAmount - 5}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(bidAmount)}
            className="button is-success is-outlined is-small"
          >
            {`${bidAmount}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(bidAmount + 5)}
            className="button is-success is-outlined is-small"
          >
            {`${bidAmount + 5}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(bidAmount + 10)}
            className="button is-success is-outlined is-small"
          >
            {`${bidAmount + 10}$`}
          </span>
        </div>
      ) : null;
    return (
      <div>
        {/* <FloatingAddNewBidButton /> */}
        <ReCAPTCHA
          style={{ display: 'none' }}
          onExpired={() => this.recaptchaRef.current.execute()}
          ref={this.recaptchaRef}
          size="invisible"
          badge="bottomright"
          onChange={this.updateRecaptchaField}
          sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
        />
        {showUpdateBidDialog && (
          <div className="modal is-active">
            <div className="modal-background" />
            <div className="modal-card">
              <header className="modal-card-head">
                <div className="modal-card-title">Change Bid Amount</div>
                <button onClick={this.closeUpdateBidModal} className="delete" aria-label="close" />
              </header>
              <section className="modal-card-body">
                <div>
                  You have placed a bid for the amount of
                  <strong>{` ${bid.bidAmount.value} ${bid.bidAmount.currency} `}</strong>
                  on this job.
                  <br />
                  Please enter the new total payment amount you'd like to recieve in exchange for
                  doing this task.
                </div>

                <br />
                <TextInput
                  label="Enter The New Bid Amount"
                  id="bidAmountField"
                  className="input is-focused"
                  type="number"
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
                <div style={{ marginTop: -8 }}>
                  <div className="help">* Use our quick bid options</div>
                  {autoBidOptions}
                </div>
                <br />
                <div className="field">
                  <div className="label">BidOrBoo Rules</div>
                  <div className="help">
                    * After you submit. The bid will be reviewed by the requester
                  </div>
                  <div className="help">
                    * You will be assigned to this task if the requester selects you
                  </div>
                  <div className="help">
                    *
                    <strong>
                      Canceling after being assigned will negatively impact your rating or if done
                      frequently will put a ban on your account
                    </strong>
                  </div>
                </div>
              </section>

              <footer className="modal-card-foot">
                <button
                  disabled={isSubmitting || !isValid}
                  onClick={this.submitUpdateBid}
                  className="button is-success"
                >
                  Submit Bid Chagnes
                </button>
                <button onClick={this.closeUpdateBidModal} className="button is-outline">
                  Cancel
                </button>
              </footer>
            </div>
          </div>
        )}

        <a
          onClick={() => {
            this.showUpdateBidModal();
          }}
          className="button is-info is-outlined is-outline is-fullwidth"
        >
          <span className="icon">
            <i className="far fa-edit" />
          </span>
          <span>Change My Bid Amount</span>
        </a>
      </div>
    );
  }
}

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

export default EnhancedForms(TaskerPendingBidInfo);
