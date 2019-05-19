import React from 'react';
import ReactDOM from 'react-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { enforceNumericField } from './FormsValidators';

class PostYourBid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBidDialog: false,
    };
    this.recaptchaRef = React.createRef();
  }
  closeShowBidDialog = () => {
    const { resetForm, setFieldValue } = this.props;
    setFieldValue('bidAmountField', '', false);
    setFieldValue('recaptchaField', '', false);
    resetForm();

    this.setState({ showBidDialog: false });
  };

  openShowBidDialog = () => {
    this.setState({ showBidDialog: true });
  };

  onAutoBid = (val) => {
    const { setFieldValue } = this.props;
    setFieldValue('bidAmountField', val, true);
  };

  componentDidUpdate() {
    const { values } = this.props;
    if (
      this.recaptchaRef &&
      this.recaptchaRef.current &&
      this.recaptchaRef.current.execute &&
      !values.recaptchaField
    ) {
      this.recaptchaRef.current.execute();
    }
  }

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      onCancel,
      isValid,
      isSubmitting,
      avgBid,
      setFieldValue,
    } = this.props;
    const { showBidDialog } = this.state;

    const autoBidOptions =
      avgBid < 10 ? (
        <div className="buttons">
          <span
            onClick={() => this.onAutoBid(25)}
            className="button is-success is-outlined is-small"
          >
            25$
          </span>
          <span
            onClick={() => this.onAutoBid(50)}
            className="button is-success is-outlined is-small"
          >
            50$
          </span>
          <span
            onClick={() => this.onAutoBid(100)}
            className="button is-success is-outlined is-small"
          >
            100$
          </span>
          <span
            onClick={() => this.onAutoBid(125)}
            className="button is-success is-outlined is-small"
          >
            125$
          </span>
          <span
            onClick={() => this.onAutoBid(150)}
            className="button is-success is-outlined is-small"
          >
            150$
          </span>
        </div>
      ) : (
        <div className="buttons">
          <span style={{ marginRight: 6 }} className="has-text-grey">{`Smart Bid `}</span>
          <span
            onClick={() => this.onAutoBid(avgBid - 10)}
            className="button is-success is-outlined is-small"
          >
            {`${avgBid - 10}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(avgBid - 5)}
            className="button is-success is-outlined is-small"
          >
            {`${avgBid - 5}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(avgBid)}
            className="button is-success is-outlined is-small"
          >
            {`${avgBid}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(avgBid + 5)}
            className="button is-success is-outlined is-small"
          >
            {`${avgBid + 5}$`}
          </span>
          <span
            onClick={() => this.onAutoBid(avgBid + 10)}
            className="button is-success is-outlined is-small"
          >
            {`${avgBid + 10}$`}
          </span>
        </div>
      );
    return (
      <React.Fragment>
        <a
          onClick={this.openShowBidDialog}
          type="button"
          className="button is-success is-medium is-outlined is-fullwidth"
        >
          <span className="icon">
            <i className="fas fa-hand-paper" />
          </span>
          <span>Place Your Bid</span>
        </a>

        {showBidDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Place Your Bid!</div>
                  <button onClick={this.closeShowBidDialog} className="delete" aria-label="close" />
                </header>
                <section className="modal-card-body">
                  <p>
                    Based on the request details that you've read, please enter the total payment
                    amount you'd like to recieve in exchange for doing this task.
                  </p>
                  <br />
                  <input
                    id="recaptchaField"
                    className="input is-invisible"
                    type="hidden"
                    value={values.recaptchaField || ''}
                  />
                  <ReCAPTCHA
                    style={{ display: 'none' }}
                    onExpired={() => this.recaptchaRef.current.execute()}
                    ref={this.recaptchaRef}
                    size="invisible"
                    badge="bottomright"
                    onChange={(result) => {
                      setFieldValue('recaptchaField', result, true);
                    }}
                    sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
                  />
                  <TextInput
                    // setFocusImmediately={true}
                    label="Your Bid"
                    id="bidAmountField"
                    className="input is-focused"
                    type="number"
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
                  <div className="field">
                    <div className="label">BidOrBoo Rules</div>
                    <div className="help">
                      * After you submit. The bid will be reviewed by the requester
                    </div>
                    <div className="help">
                      * You will be assigned to this task if the requester selects you
                    </div>
                    <div className="help">
                      {`* `}
                      <strong>
                        Canceling after being assigned will negatively impact your rating or if done
                        frequently will put a ban on your account
                      </strong>
                    </div>
                  </div>
                </section>

                <footer className="modal-card-foot">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    onClick={handleSubmit}
                    className="button is-success"
                  >
                    Submit Bid
                  </button>
                  <button onClick={this.closeShowBidDialog} className="button is-outline">
                    Cancel
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
      </React.Fragment>
    );
  }
}

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    bidAmountField: Yup.number()
      .positive('Can only have positive integers')
      .max(9999, 'The maximum amout is 9999')
      .required('amount is required.'),
    recaptchaField: Yup.string()
      .min(1)
      .notRequired(
        'This client failed recaptcha secure check. please refresh the page or try again later.',
      ),
  }),
  mapPropsToValues: (props) => {
    return {
      recaptchaField: '',
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'BidOnJobForm',
});

export default EnhancedForms(PostYourBid);
