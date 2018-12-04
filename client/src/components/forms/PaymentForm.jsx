import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput, TextAreaInput } from './FormsHelpers';
import { enforceNumericField, alphanumericField, phoneNumber } from './FormsValidators';

const EnhancedForms = withFormik({
  // validationSchema: Yup.object().shape({
  //   displayName: Yup.string()
  //     .ensure()
  //     .trim()
  //     .min(3, 'your name is longer than that. Must be at least 3 chars')
  //     .max(25, 'your name is longer 25. Must be at most 25 chars')
  //     .test('alphanumericField', 'Name can only contain alphabits and numbers', (inputText) => {
  //       return alphanumericField(inputText);
  //     })
  //     .required('First name is required.'),
  //   email: Yup.string()
  //     .ensure()
  //     .trim()
  //     .email('please enter a valid email address')
  //     .required('email is required.'),
  //   phoneNumber: Yup.number()
  //     .positive('Phone number can only be of format 161312345678')
  //     .test('phoneNumber', 'Phone number should match 1231231234', (inputText) => {
  //       return phoneNumber(inputText);
  //     }),
  //   personalParagraph: Yup.string().max(255, 'Maximum length allowed is 255 charachters'),
  // }),
  // mapPropsToValues: ({ userDetails }) => {
  //   const { displayName, personalParagraph, phoneNumber, email } = userDetails;

  //   return {
  //     displayName: displayName,
  //     phoneNumber: phoneNumber,
  //     email: email,
  //     personalParagraph: personalParagraph,
  //   };
  // },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
  },
  displayName: 'PaymentForm',
});

const PaymentForm = (props) => {
  const {
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    onCancel,
    isValid,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="field is-grouped">
        <TextInput
          id="firstName"
          type="text"
          label="First Name"
          placeholder="first name"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextInput
          id="middleInitial"
          type="text"
          label="Middle Initial"
          placeholder="Middle initial"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextInput
          id="lastName"
          type="text"
          label="Last Name"
          placeholder="Last name"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div style={{ marginTop: -20 }} className="help">
        * Provide your name as it appears on your legal document
      </div>
      <br />
      <div className="field is-grouped">
        <TextInput
          id="day"
          type="text"
          label="Day of Birth"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextInput
          id="month"
          type="text"
          label="month"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="year"
          type="text"
          label="Year"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div style={{ marginTop: -20 }} className="help">
        * Provide your address as it shows on your legal document (driver license)
      </div>

      <br />
      <TextInput
        id="phoneNumber"
        type="text"
        label="Phone Number"
        error={touched.displayName && errors.displayName}
        value={values.displayName || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <br />
      <div className="field is-grouped">
        <TextInput
          id="streetAddress"
          type="text"
          label="Street Address"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextInput
          id="postalCode"
          type="text"
          label="Postal Code"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="city"
          type="text"
          label="City"
          placeholder="City you reside in"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="province"
          type="text"
          label="Province"
          placeholder="Province"
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div style={{ marginTop: -20 }} className="help">
        * Provide your address as it shows on your legal document (driver license)
      </div>
      <br />

      <br />
      <TextInput
        id="SIN"
        type="text"
        label="Social Insurance Number"
        placeholder="first name"
        error={touched.displayName && errors.displayName}
        value={values.displayName || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        helpText={
          <React.Fragment>
            This will be encrypted and secured via
            <a href="https://stripe.com/ca" target="_blank">
              {` Stripe payment gateway.`}
            </a>
            {` BidOrBoo will NOT be storing this info.`}
          </React.Fragment>
        }
      />

      <br />

      <br />
      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input style={{ scale: 1.5 }} type="checkbox" />
            {` I have read and agree to`}
            <a target="_blank" href="bidorbooserviceAgreement">
              {` BidOrBoo Service Agreement `}
            </a>
            and the
            <a target="_blank" href="https://stripe.com/connect-account/legal">
              {` Stripe Connected Account Agreement`}
            </a>
            .
          </label>
        </div>
      </div>
      <br />

      <div className="field is-grouped">
        <div className="control">
          <button
            style={{ marginRight: 6 }}
            className="button is-primary is-medium"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Submit
          </button>
        </div>

        <div className="control">
          <button
            className="button is-outlined is-medium"
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              onCancel(e);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EnhancedForms(PaymentForm);
