import React from 'react';

import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { enforceNumericField } from './FormsValidators';

class BidModal extends React.Component {
  onAutoBid = (val) => {
    const { setFieldValue } = this.props;
    setFieldValue('bidAmountField', val, true);
  };

  componentWillUnmount() {
    const { resetForm, setFieldValue } = this.props;
    setFieldValue('bidAmountField', '', false);
    setFieldValue('recaptchaField', '', false);
    resetForm();
    console.log('unmounting');
  }

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      handleClose,
      isValid,
      isSubmitting,
      avgBid,
    } = this.props;

    const autoBidOptions =
      avgBid < 10 ? (
        <div className="buttons">
          <span onClick={() => this.onAutoBid(25)} className="button is-success is-small">
            25$
          </span>
          <span onClick={() => this.onAutoBid(50)} className="button is-success is-small">
            50$
          </span>
          <span onClick={() => this.onAutoBid(100)} className="button is-success is-small">
            100$
          </span>
          <span onClick={() => this.onAutoBid(125)} className="button is-success is-small">
            125$
          </span>
          <span onClick={() => this.onAutoBid(150)} className="button is-success is-small">
            150$
          </span>
        </div>
      ) : (
        <div className="buttons">
          <span style={{ marginRight: 6 }} className="has-text-grey">{`Smart Bid `}</span>
          <span onClick={() => this.onAutoBid(avgBid - 10)} className="button is-success is-small">
            {`${avgBid - 10}$`}
          </span>
          <span onClick={() => this.onAutoBid(avgBid - 5)} className="button is-success is-small">
            {`${avgBid - 5}$`}
          </span>
          <span onClick={() => this.onAutoBid(avgBid)} className="button is-success is-small">
            {`${avgBid}$`}
          </span>
          <span onClick={() => this.onAutoBid(avgBid + 5)} className="button is-success is-small">
            {`${avgBid + 5}$`}
          </span>
          <span onClick={() => this.onAutoBid(avgBid + 10)} className="button is-success is-small">
            {`${avgBid + 10}$`}
          </span>
        </div>
      );
    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Place Your Bid!</div>
            <button onClick={handleClose} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <p>
              Enter a <strong>$ total amount</strong> you want to recieve in exchange for fulfilling
              this task
            </p>

            <TextInput
              // setFocusImmediately={true}
              label="Enter Your Bid Amount"
              id="bidAmountField"
              className="input is-focused"
              onBlur={handleBlur}
              // helpText={
              //   avgBid > 0
              //     ? `*Current Avg bid is $ ${avgBid}$ (CAD)`
              //     : `* Bid Amount are in (CAD). E.g 50`
              // }
              error={touched.bidAmountField && errors.bidAmountField}
              value={values.bidAmountField || ''}
              onChange={(e) => {
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

            {/* <div className="group">
              <div className="label">BidOrBoo Rules</div>

              {values.bidAmountField && values.bidAmountField > 1 && (
                <div className="help has-text-success">
                  * Your Net Payout After deucting BidOrBoo Service Fee:
                  <strong>
                    {` ${values.bidAmountField - Math.ceil(values.bidAmountField * 0.04)}$ (CAD)`}
                  </strong>
                </div>
              )}
              <div className="help">
                * You must read all the request details thoroughly before bidding.
              </div>
              <div className="help">* If your bid is chosen this task will be assigned to you</div>
              <div className="help">
                {`* `}
                <strong>
                  Canceling after being assigned will negatively impact your rating or if done
                  frequently will put a ban on your account
                </strong>
              </div>
            </div> */}
          </section>

          <footer className="modal-card-foot">
            <button onClick={handleClose} className="button is-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              onClick={handleSubmit}
              className="button is-success"
            >
              Submit Bid
            </button>
          </footer>
        </div>
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
    props.onSubmit({ ...values, recaptchaField: props.recaptcha });
    setSubmitting(false);
  },

  displayName: 'BidOnJobForm',
});

export default EnhancedForms(BidModal);
