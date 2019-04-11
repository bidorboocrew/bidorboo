import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../components/forms/FormsHelpers';
import { enforceNumericField } from '../../../components/forms/FormsValidators';
import ReCAPTCHA from 'react-google-recaptcha';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

// https://www.react-spinners.com/
import { GridLoader } from 'react-spinners';
class RequesterAndOpenBid extends React.Component {
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
    this.recaptchaRef.current.execute();
  }
  closeUpdateBidModal = () => {
    const { resetForm, setFieldValue } = this.props;
    setFieldValue('bidAmountField', '', false);
    setFieldValue('confirmReadField', false, false);

    resetForm();

    this.setState({ showUpdateBidDialog: false, confirmRead: false });
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
  toggleConfirmRead = () => {
    const { setFieldValue } = this.props;
    this.setState({ confirmRead: !this.state.confirmRead }, () => {
      setFieldValue('confirmReadField', this.state.confirmRead, true);
    });
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

    const { showUpdateBidDialog, confirmRead } = this.state;

    const bidAmount = bid.bidAmount.value;
    const bidCurrency = bid.bidAmount.currency;

    const autoBidOptions =
      bidAmount > 10 ? (
        <div className="buttons">
          <span style={{ marginRight: 6 }} className="has-text-grey">{`Smart Bid `}</span>
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
      <div className="container is-widescreen">
        <FloatingAddNewBidButton />
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
                <p className="modal-card-title">Update Your Bid</p>
                <button onClick={this.closeUpdateBidModal} className="delete" aria-label="close" />
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
                  label="Update Your Bid Amount"
                  id="bidAmountField"
                  className="input is-focused"
                  type="number"
                  onBlur={handleBlur}
                  helpText="* Enter a new bid amount. Bid Amount is in CAD. E.g 50"
                  error={touched.bidAmountField && errors.bidAmountField}
                  value={values.bidAmountField || ''}
                  onChange={(e) => {
                    //run normalizer to get rid of alpha chars
                    const normalizedVal = enforceNumericField(e.target.value);
                    e.target.value = normalizedVal;
                    handleChange(e);
                  }}
                />
                {autoBidOptions}
                <br />
                <div className="control">
                  <label className="radio">
                    <input
                      id="confirmReadField"
                      error={touched.confirmReadField && errors.confirmReadField}
                      onBlur={handleBlur}
                      checked={confirmRead}
                      value={values.confirmReadField}
                      onChange={this.toggleConfirmRead}
                      type="checkbox"
                      name="success"
                      required
                    />
                    <span className="has-text-weight-semibold">
                      {` I Confirm that I've Read the task description thoroughly and happy with my updated bid.`}
                    </span>
                  </label>
                </div>
              </section>
              <footer className="modal-card-foot">
                <button
                  disabled={isSubmitting || !isValid}
                  onClick={this.submitUpdateBid}
                  className="button is-success"
                >
                  Update My Bid
                </button>
                <button onClick={this.closeUpdateBidModal} className="button is-outline">
                  Cancel
                </button>
              </footer>
            </div>
          </div>
        )}

        <div style={{ height: 'auto' }} className="card disabled">
          <header className="card-header is-clipped">
            <p className="card-header-title"> My Bid Info</p>
          </header>
          <div className="card-content">
            <br />
            <div style={{ marginBottom: 6 }}>
              <div className="is-size-7">My Bid:</div>

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
                  className="button is-outline is-small has-text-info"
                >
                  <span className="icon">
                    <i className="far fa-edit" />
                  </span>
                  <span>Edit</span>
                </a>
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div className="is-size-7">My Bid Status :</div>
              <GridLoader sizeUnit={'px'} size={15} color={'#292929'} loading={true} />

              <div className="is-size-6">Pending</div>
            </div>
            <div className="help">* Requester did not award this job to anyone yet</div>
          </div>
        </div>
      </div>
    );
  }
}

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    confirmReadField: Yup.boolean()
      .required()
      .test('confirmReadField', 'Must Be Checked', (inputValue) => {
        return inputValue;
      }),
    bidAmountField: Yup.number()
      .positive('Can only have positive integers')
      .max(9999, 'The maximum amout is 9999')
      .required('amount is required.'),
  }),

  mapPropsToValues: () => {
    return {
      confirmReadField: false,
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.updateBidAction({ bidId: props.bid._id, bidAmount: values.bidAmountField });
    this.closeUpdateBidModal();
    setSubmitting(false);
  },
  displayName: 'UpdateBidForm',
});

export default EnhancedForms(RequesterAndOpenBid);

const FloatingAddNewBidButton = () => {
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        switchRoute(ROUTES.CLIENT.BIDDER.root);
      }}
      className="button is-link bdbFloatingButtonText"
    >
      <span className="icon">+ </span>
    </a>
  );
};
