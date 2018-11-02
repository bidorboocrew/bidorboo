import React from 'react';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { enforceNumericField } from './FormsValidators';

class PostYourBid extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
    } = this.props;

    return (
      <div className="card is-clipped">
        <header className="card-header">
          <p className="card-header-title">
            <i style={{ marginRight: 4 }} className="fas fa-hand-paper" />
            Bid Now
          </p>
        </header>

        <div className="card-content">
          <TextInput
            id="bidAmountField"
            className="input is-focused shadow-drop-center"
            style={{ fontSize: '1.5rem' }}
            type="text"
            onBlur={handleBlur}
            label="Enter Your Bid Amount"
            placeholder="enter bid amount E.g 50"
            helpText="Bid amounts are in CAD. E.g 50"
            error={touched.bidAmountField && errors.bidAmountField}
            value={values.bidAmountField || ''}
            onChange={(e) => {
              //run normalizer to get rid of alpha chars
              const normalizedVal = enforceNumericField(e.target.value);
              e.target.value = normalizedVal;
              handleChange(e);
            }}
          />
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <a
              onClick={handleSubmit}
              className="button is-primary is-large is-fullwidth"
              disabled={isSubmitting || !isValid}
            >
              <i style={{ marginRight: 4 }} className="fas fa-hand-paper" />
              Bid Now
            </a>
          </div>
          <div className="card-footer-item">
            <a onClick={onCancel} className="button is-danger is-outlined is-large is-fullwidth">
              <i style={{ marginRight: 4 }} className="fas fa-thumbs-down" />
              Booo
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    bidAmountField: Yup.number()
      .positive('Can only have positive integers')
      .max(1000000, 'The maximum amout is 100000')
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
