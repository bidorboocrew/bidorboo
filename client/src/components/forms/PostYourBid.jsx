import React from 'react';
import ReactDOM from 'react-dom';

import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { enforceNumericField } from './FormsValidators';
import ActionSheet from '../ActionSheet';

class PostYourBid extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showBidDialog: false,
    };
  }

  closeShowBidDialog = () => {
    this.setState({ showBidDialog: false });
  };

  openShowBidDialog = () => {
    this.setState({ showBidDialog: true });
  };

  onAutoBid = (val) => {
    const { setFieldValue } = this.props;
    setFieldValue('bidAmountField', val, true);
  };

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
      resetForm,
      setFieldValue,
      avgBid,
    } = this.props;

    const actionsSheetRoot = document.querySelector('#bidorboo-root-action-sheet');

    const autoBidOptions =
      avgBid < 10 ? (
        <div className="buttons">
          <span style={{ marginRight: 6 }} className="has-text-grey">{`Auto Bid: `}</span>
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
          <span style={{ marginRight: 6 }} className="has-text-grey">{`Auto Bid: `}</span>
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
    return actionsSheetRoot ? (
      <React.Fragment>
        {!this.state.showBidDialog &&
          ReactDOM.createPortal(
            <ActionSheet>
              <a
                style={{ borderRadius: 0, width: '10rem' }}
                onClick={this.openShowBidDialog}
                type="button"
                className="button is-medium is-success "
              >
                <span className="icon">
                  <i className="fas fa-hand-paper" />
                </span>
                <span>Bid</span>
              </a>
              <a
                style={{ borderRadius: 0, marginLeft: '2.25rem', width: '10rem' }}
                className="button is-medium is-outlined "
                type="submit"
                onClick={onCancel}
              >
                <span className="icon">
                  <i className="far fa-arrow-alt-circle-left" />
                </span>
                <span>Go Back</span>
              </a>
            </ActionSheet>,
            actionsSheetRoot,
          )}
        {this.state.showBidDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Bid Now</p>
                  <button
                    onClick={(e) => {
                      resetForm();
                      this.closeShowBidDialog();
                    }}
                    className="delete"
                    aria-label="close"
                  />
                </header>
                <section className="modal-card-body">
                  <TextInput
                    setFocusImmediately={true}
                    label="Enter Bid Amount"
                    id="bidAmountField"
                    className="input is-focused"
                    type="number"
                    onBlur={handleBlur}
                    helpText="Bid Amount are in CAD. E.g 50"
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
                  <button
                    onClick={(e) => {
                      setFieldValue('bidAmountField', '', false);
                      resetForm();
                      this.closeShowBidDialog();
                    }}
                    className="button is-outline"
                  >
                    Cancel
                  </button>
                </footer>
              </div>
            </div>,
            actionsSheetRoot,
          )}
      </React.Fragment>
    ) : null;
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
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'BidOnJobForm',
});

export default EnhancedForms(PostYourBid);
