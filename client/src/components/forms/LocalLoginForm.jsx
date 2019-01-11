import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    loginPassword: Yup.string()
      .ensure()
      .trim()
      .min(6, 'your password must be at least 6 chars')
      .max(35, 'your password can not be longer than 35 chars')
      .required('password is required.'),
    loginEmail: Yup.string()
      .ensure()
      .trim()
      .email('please enter a valid email address')
      .required('email is required.'),
  }),
  mapPropsToValues: (props) => {
    return {
      originPath: props.originPath,
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit({
      email: values.loginEmail,
      password: values.loginPassword,
      originPath: values.originPath,
    });
    setSubmitting(false);
  },
  displayName: 'LocalLoginForm',
});

const LocalLoginForm = (props) => {
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
      <input
        id="originPath"
        className="input is-invisible"
        type="hidden"
        value={values.originPath || '/'}
      />
      <TextInput
        id="loginEmail"
        type="text"
        label="Email"
        placeholder="Enter your email..."
        error={touched.loginEmail && errors.loginEmail}
        value={values.loginEmail || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="loginPassword"
        type="password"
        label="Password"
        error={touched.loginPassword && errors.loginPassword}
        value={values.loginPassword || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="has-text-centered">
        <button
          style={{ marginRight: 6 }}
          className="button is-success is-inline-flex"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Login Now
        </button>
        <button
          style={{ marginRight: 6 }}
          className="button is-outline is-inline-flex"
          type="submit"
          disabled={isSubmitting}
        >
          reset credentials
        </button>
      </div>
    </form>
  );
};

export default EnhancedForms(LocalLoginForm);
