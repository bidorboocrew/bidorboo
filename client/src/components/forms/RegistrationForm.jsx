import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import Recaptcha from 'react-google-invisible-recaptcha';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    // displayName: Yup.string()
    //   .ensure()
    //   .trim()
    //   .min(3, 'your name must be at least 3 chars')
    //   .max(35, 'your password can not be longer than 35 chars')
    //   .required('name is required.'),
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
    recaptchaField: Yup.string()
      .ensure()
      .trim()
      .required('require pass recaptcha.'),
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
  mapPropsToValues: () => {
    return {
      recaptchaField: process.env.NODE_ENV === 'production' ? '' : 'development_test',
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    let displayName = `New User(${Math.floor(Math.random() * Math.floor(100))})`;
    if (values && values.email && values.email.indexOf('@') > -1) {
      displayName = values.email.split('@')[0];
    }
    props.onSubmit({
      email: values.email,
      password: values.password,
      originPath: values.originPath,
      recaptchaField: values.recaptchaField,
      displayName: displayName,
    });
    setSubmitting(false);
  },
  displayName: 'NewUserRegistrationForm',
});

class NewUserRegistrationForm extends React.Component {
  onResolved = () => {
    this.props.setFieldValue('recaptchaField', this.recaptcha.getResponse());
  };
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.recaptcha.execute();
    } else {
      this.props.setFieldValue('recaptchaField', 'test', true);
    }
  }
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
      recaptchaField,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        {/* <TextInput
          id="displayName"
          type="text"
          label="Name"
          placeholder="Enter your display name..."
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        /> */}
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
          className="button is-success"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Join BidOrBoo
        </button>
        <br></br> <br></br>
        <input
          id="recaptchaField"
          className="input is-invisible"
          type="hidden"
          value={values.recaptchaField || recaptchaField}
        />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Recaptcha
              ref={(ref) => (this.recaptcha = ref)}
              sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
              onResolved={this.onResolved}
              onExpired={() => this.recaptcha.reset()}
              badge={'inline'}
            />
            {/* https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-v3-badge-what-is-allowed */}
            <div className="help">
              {`This site is protected by reCAPTCHA and the Google `}
              <a href="https://policies.google.com/privacy">Privacy Policy</a> and
              <a href="https://policies.google.com/terms">Terms of Service</a> apply.
            </div>
          </>
        )}
      </form>
    );
  }
}

export default EnhancedForms(NewUserRegistrationForm);
