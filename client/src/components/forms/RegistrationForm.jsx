import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import ReCAPTCHA from 'react-google-recaptcha';

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
    recaptchaField: Yup.string()
      .ensure()
      .trim()
      .required('passing recaptcha is required.'),
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
      recaptchaField: values.recaptchaField,
    });
    setSubmitting(false);
  },
  displayName: 'NewUserRegistrationForm',
});

class NewUserRegistrationForm extends React.Component {
  constructor(props) {
    super(props);

    this.recaptchaRef = React.createRef();
  }
  componentDidMount() {
    this.recaptchaRef.current.execute();
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
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <input
          id="originPath"
          className="input is-invisible"
          type="hidden"
          value={values.originPath || '/'}
        />
        <TextInput
          id="displayName"
          type="text"
          label="Name"
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

        <input
          id="recaptchaField"
          className="input is-invisible"
          type="hidden"
          value={values.recaptcha || ''}
        />

        <div className="has-text-centered">
          <button
            className="button is-success is-medium is-fullwidth"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Join BidOrBoo
          </button>
        </div>
        <div style={{ marginTop: 10 }}>
          <ReCAPTCHA
            ref={this.recaptchaRef}
            onExpired={() => this.recaptchaRef.current.execute()}
            size="invisible"
            badge="inline"
            onChange={(result) => {
              setFieldValue('recaptchaField', result, true);
            }}
            sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
          />
        </div>
        {errors.recaptchaField && (
          <p className="help is-danger">
            {errors.recaptchaField}
            <a
              className="is-text is-small"
              onClick={() => {
                this.recaptchaRef.current.reset();
              }}
            />
            recaptcha couldn't validate your request, click to try again
          </p>
        )}
      </form>
    );
  }
}

export default EnhancedForms(NewUserRegistrationForm);
