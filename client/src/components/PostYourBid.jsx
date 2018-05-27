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
      <div>
        <header className="card-header"
        >
          <p className="card-header-title">Bid Now</p>
        </header>
        <div
          style={{ borderLeft: `4px solid rebeccapurple` }}
          className="card-content"
        >
          <TextInput
            id="bidAmountField"
            className="input is-focused shadow-drop-center"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            label="Enter Your Bid Amount"
            placeholder="enter bid amount E.g 50"
            helpText="Bid amounts are in CAD. E.g 50"
            error={touched.bidAmountField && errors.bidAmountField}
            value={values.bidAmountField || ''}
          />
        </div>
        <footer className="card-footer">
          <a
            onClick={handleSubmit}
            style={{ borderRadius: 0 }}
            className="card-footer-item button is-primary is-large"
          >
            <i style={{ marginRight: 4 }} className="fas fa-hand-paper" />
            Bid Now
          </a>
          <a
            onClick={onCancel}
            style={{ borderRadius: 0 }}
            className="card-footer-item button is-danger is-large"
          >
            <i style={{ marginRight: 4 }} className="fas fa-thumbs-down" />
            Booo
          </a>
        </footer>
      </div>
    );
  }
}

const EnhancedForms = withFormik({
  initialValues: {
    hasReviewedDetails: false // we should have a checkbox to make user review etails
  },
  mapPropsToValues: props => {
    return {
      hasReviewedDetails: false
    };
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    debugger;
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'BidOnJobForm'
});

export default EnhancedForms(PostYourBid);
