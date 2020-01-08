import React from 'react';

import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { enforceNumericField } from './FormsValidators';
import Recaptcha from 'react-google-invisible-recaptcha';

class BidModal extends React.Component {
  onAutoBid = (val) => {
    const { setFieldValue } = this.props;
    setFieldValue('bidAmountField', val, true);
  };

  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.recaptcha.execute();
    } else {
      this.props.setFieldValue('recaptchaField', 'development_test', true);
    }
  }

  componentWillUnmount() {
    const { resetForm, setFieldValue } = this.props;
    setFieldValue('bidAmountField', '', false);
    resetForm();
  }

  onResolved = () => {
    this.props.setFieldValue('recaptchaField', this.recaptcha.getResponse());
  };

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
      recaptchaField,
    } = this.props;

    const autoBidOptions =
      !avgBid || avgBid < 20 ? (
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
          <span
            onClick={() => this.onAutoBid(parseInt(avgBid) - 10)}
            className="button is-success is-small"
          >
            {`${parseInt(avgBid) - 10}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(parseInt(avgBid) - 5)}
            className="button is-success is-small"
          >
            {`${parseInt(avgBid) - 5}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(parseInt(avgBid))}
            className="button is-success is-small"
          >
            {`${parseInt(avgBid)}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(parseInt(avgBid) + 5)}
            className="button is-success is-small"
          >
            {`${parseInt(avgBid) + 5}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(parseInt(avgBid) + 10)}
            className="button is-success is-small"
          >
            {`${parseInt(avgBid) + 10}$`}
          </span>
        </div>
      );
    return (
      <div className="modal is-active has-text-left">
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Enter Your Bid!</div>
            <button onClick={handleClose} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <p>
              Enter a <strong>$ total amount</strong> you want to receive in exchange for fulfilling
              this task
            </p>

            <TextInput
              type="number"
              // setFocusImmediately={true}
              label="Enter Your Bid Amount"
              id="bidAmountField"
              className="input is-focused"
              placeholder={'Enter total bid amount...'}
              onBlur={handleBlur}
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
            <input
              id="recaptchaField"
              className="input is-invisible"
              type="hidden"
              value={values.recaptchaField || recaptchaField}
            />
            {process.env.NODE_ENV === 'production' && (
              <>
                <Recaptcha
                  ref={(ref) => (this.recaptcha = ref)}
                  sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
                  onResolved={this.onResolved}
                  onExpired={() => this.recaptcha.reset()}
                  badge={'inline'}
                />
                {/* https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-v3-badge-what-is-allowed */}
              </>
            )}
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
      .max(5000, 'The maximum amount is 5000')
      .required('amount is required.'),
    recaptchaField: Yup.string()
      .ensure()
      .trim()
      .required('require pass recaptcha.'),
  }),
  mapPropsToValues: (props) => {
    return {
      recaptchaField: process.env.NODE_ENV === 'production' ? '' : 'development_test',
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit({ ...values });
    setSubmitting(false);
  },

  displayName: 'BidOnRequestForm',
});

export default EnhancedForms(BidModal);
