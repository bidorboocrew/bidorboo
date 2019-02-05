import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import ReCAPTCHA from 'react-google-recaptcha';

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
    recaptchaField: Yup.string()
      .ensure()
      .trim()
      .required('passing recaptcha is required.'),
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
      recaptchaField: values.recaptchaField,
    });
    setSubmitting(false);
  },
  displayName: 'LocalLoginForm',
});

class LocalLoginForm extends React.Component {
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
        <input
          id="recaptchaField"
          className="input is-invisible"
          type="hidden"
          value={values.recaptcha || ''}
        />
        <div className="field">
          <ReCAPTCHA
            style={{ display: 'none' }}
            ref={this.recaptchaRef}
            onExpired={() => {
              this.recaptchaRef.current.execute();
            }}
            size="invisible"
            badge="inline"
            onChange={(result) => {
              setFieldValue('recaptchaField', result, true);
            }}
            sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
          />
        </div>
        <div className="has-text-centered">
          <button
            style={{ marginRight: '2rem', width: 120 }}
            className="button is-success is-inline-flex"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Login Now
          </button>
          <button
            className="button is-text is-outline is-inline-flex"
            onClick={() => alert('Not implemented yet')}
            disabled={isSubmitting}
          >
            Reset credentials
          </button>
        </div>
      </form>
    );
  }
}

export default EnhancedForms(LocalLoginForm);
