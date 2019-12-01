import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    displayName: Yup.string()
      .ensure()
      .trim()
      .min(3, 'your name must be at least 3 chars')
      .max(35, 'your password can not be longer than 35 chars')
      .required('name is required.'),
    password: Yup.string()
      .ensure()
      .trim()
      .min(6, 'your password must be at least 6 chars')
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
  mapPropsToValues: (props) => {
    return {
      originPath: props.originPath,
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit({
      email: values.email,
      password: values.password,
      originPath: values.originPath,
      displayName: values.displayName,
    });
    setSubmitting(false);
  },
  displayName: 'NewUserRegistrationForm',
});

class NewUserRegistrationForm extends React.Component {
  render() {
    const {
      values,
      touched,
      errors,
      // dirty,
      handleChange,
      handleBlur,
      handleSubmit,
      // handleReset,
      setFieldValue,
      isValid,
      isSubmitting,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <TextInput
          id="displayName"
          type="text"
          label="Name"
          placeholder="Enter your display name..."
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
          id="password"
          type="password"
          label="Password"
          placeholder="Enter the same password..."
          error={touched.password && errors.password}
          value={values.password || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="passwordVerification"
          type="password"
          label="Verify password"
          placeholder="Enter the same password..."
          error={touched.passwordVerification && errors.passwordVerification}
          value={values.passwordVerification || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button
          style={{ borderRadius: 0 }}
          className="button is-success"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Join BidOrBoo
        </button>
        <br></br>
        <br></br>
      </form>
    );
  }
}

export default EnhancedForms(NewUserRegistrationForm);
