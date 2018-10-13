import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput, TextAreaInput } from './FormsHelpers';
import { enforceNumericField, alphanumericField, phoneNumber } from './FormsValidators';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    displayName: Yup.string()
      .ensure()
      .trim()
      .min(3, 'your name is longer than that. Must be at least 3 chars')
      .max(25, 'your name is longer 25. Must be at most 25 chars')
      .test('alphanumericField', 'Name can only contain alphabits and numbers', (inputText) => {
        return alphanumericField(inputText);
      })
      .required('First name is required.'),
    email: Yup.string()
      .ensure()
      .trim()
      .email('please enter a valid email address')
      .required('email is required.'),
    phoneNumber: Yup.number()
      .positive('Phone number can only be of format 161312345678')
      .test('phoneNumber', 'Phone number should match 123-123-1234', (inputText) => {
        return phoneNumber(inputText);
      }),
    personalParagraph: Yup.string().max(255, 'Maximum length allowed is 255 charachters'),
  }),
  mapPropsToValues: ({ userDetails }) => {
    const { displayName, personalParagraph, phoneNumber, email } = userDetails;

    return {
      displayName: displayName,
      phoneNumber: phoneNumber,
      email: email,
      personalParagraph: personalParagraph,
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
  },
  displayName: 'ProfileForm',
});

const ProfileForm = (props) => {
  const {
    values,
    touched,
    errors,
    // dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    // handleReset,
    onCancel,
    isValid,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="displayName"
        type="text"
        label="User Name"
        placeholder="Enter your name..."
        error={touched.displayName && errors.displayName}
        value={values.displayName || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="email"
        type="text"
        label="Email"
        placeholder="Enter your email..."
        error={touched.email && errors.email}
        value={values.email || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="phoneNumber"
        type="text"
        label="Phone Number"
        placeholder="Enter Your Phone Number"
        helpText="example : 61312345678"
        error={touched.phoneNumber && errors.phoneNumber}
        value={values.phoneNumber}
        onChange={(e) => {
          //run normalizer to get rid of alpha chars
          const normalizedVal = enforceNumericField(e.target.value);
          e.target.value = normalizedVal;
          handleChange(e);
        }}
        onBlur={handleBlur}
      />
      <TextAreaInput
        id="personalParagraph"
        type="text"
        label="About Me"
        placeholder="Sample: Hey I am handy with tools and can do everything... "
        error={touched.personalParagraph && errors.personalParagraph}
        value={values.personalParagraph}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="field">
        <button
          style={{ marginRight: 6 }}
          className="button is-primary is-medium"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Submit
        </button>
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
    </form>
  );
};

export default EnhancedForms(ProfileForm);
