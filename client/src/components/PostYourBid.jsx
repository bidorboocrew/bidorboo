import React from 'react';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import { TextInput } from './forms/FormsHelpers';
class PostYourBid extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      onCancel
    } = this.props;

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Make a Bid Now</p>
        </header>
        <div className="card-content">

          <TextInput
            id="bidAmountField"
            className="input is-focused shadow-drop-center"
            type="text"
            label="Enter Your Bid Amount"
            placeholder="specify starting date"
            helpText="Bid amounts are in CAD, example 5"
            error={touched.bidAmountField && errors.bidAmountField}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.bidAmount || ''}
          />
        </div>
        <footer className="card-footer">
          <a
            onClick={handleSubmit}
            style={{ borderRadius: 0 }}
            className="card-footer-item button is-primary"
          >
            Bid Now
          </a>
          <a
            onClick={onCancel}
            style={{ borderRadius: 0 }}
            className="card-footer-item button is-danger"
          >
            Booo
          </a>
        </footer>
      </div>
    );
  }
}

const EnhancedForms = withFormik({
  initialValues: {
    hasReviewedDetails: false,
    bidAmount: 10
  },
  mapPropsToValues: props => {
    return {
      hasReviewedDetails: false,
      bidAmount: 10
    };
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'BidOnJobForm'
});

export default EnhancedForms(PostYourBid);
