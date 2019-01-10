import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { alphanumericField, phoneNumber } from './FormsValidators';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    password: Yup.string()
      .ensure()
      .trim()
      .min(3, 'your password must be at least 6 chars')
      .max(35, 'your password can not be longer than 35 chars')
      .required('password is required.'),
    passwordVerification: Yup.string()
      .ensure()
      .trim()
      .min(3, 'your password must be at least 6 chars')
      .max(35, 'your password can not be longer than 35 chars')
      .required('password is required.'),
    email: Yup.string()
      .ensure()
      .trim()
      .email('please enter a valid email address')
      .required('email is required.'),
  }),

  validate: (values) => {
    let errors = {};
    if (
      values.passwordVerification &&
      values.password &&
      !(values.passwordVerification === values.password)
    ) {
      errors.passwordVerification = 'Passwords does not match';
      errors.password = 'Passwords does not match';
    }
    return errors;
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    debugger;
    props.onSubmit({
      email: values.email,
      password: values.password,
    });
    setSubmitting(false);
  },
  displayName: 'NewUserRegistrationForm',
});

const NewUserRegistrationForm = (props) => {
  const {
    values,
    touched,
    errors,
    // dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    // handleReset,
    // onCancel,
    isValid,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
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
        id="password"
        type="password"
        label="Password"
        error={touched.password && errors.password}
        value={values.password || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="passwordVerification"
        type="password"
        label="Verify Your password"
        error={touched.passwordVerification && errors.passwordVerification}
        value={values.passwordVerification || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button
        style={{ marginRight: 6 }}
        className="button is-success is-fullwidth"
        type="submit"
        disabled={isSubmitting || !isValid}
      >
        Register
      </button>
    </form>
  );
};

export default EnhancedForms(NewUserRegistrationForm);
