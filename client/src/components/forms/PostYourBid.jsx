import React from 'react';
import ReactDOM from 'react-dom';

import autoBind from 'react-autobind';

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
    } = this.props;

    const actionsSheetRoot = document.querySelector('#bidorboo-root-action-sheet');

    return actionsSheetRoot ? (
      <React.Fragment>
        {!this.state.showBidDialog &&
          ReactDOM.createPortal(
            <ActionSheet>
              <a
                style={{ borderRadius: 0, width: '10rem' }}
                onClick={this.openShowBidDialog}
                type="button"
                className="button  is-medium is-primary "
              >
                <span className="icon">
                  <i className="fas fa-hand-paper" />
                </span>
                <span>Bid</span>
              </a>
              <a
                style={{ borderRadius: 0, marginLeft: '2.25rem', width: '10rem' }}
                className="button is-medium  is-danger is-outlined "
                type="submit"
                onClick={onCancel}
              >
                <span className="icon">
                  <i className="fas fa-thumbs-down" />
                </span>
                <span>Boo</span>
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
                  <p className="modal-card-title">Enter Your Bid</p>
                  <button
                    onClick={(e) => {
                      setFieldValue('bidAmountField', '', false);
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
                    className="input is-focused shadow-drop-center"
                    type="text"
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
                </section>
                <footer className="modal-card-foot">
                  <button
                    disabled={isSubmitting || !isValid}
                    onClick={handleSubmit}
                    className="button is-primary"
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
                    go Back
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
      .max(10000, 'The maximum amout is 100000')
      .required('amount is required.'),
  }),
  initialValues: {
    hasReviewedDetails: false, // we should have a checkbox to make user review etails
  },
  mapPropsToValues: (props) => {
    return {
      hasReviewedDetails: false,
    };
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'BidOnJobForm',
});

export default EnhancedForms(PostYourBid);
