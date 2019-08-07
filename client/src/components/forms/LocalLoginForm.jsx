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
    if (this.recaptchaRef && this.recaptchaRef.current && this.recaptchaRef.current) {
      this.recaptchaRef.current.execute();
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
    } = this.props;

    return (
      <form className="has-text-left" onSubmit={handleSubmit}>
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
          placeholder="Enter your password..."
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
        <div className="group saidTest">
          <ReCAPTCHA
            style={{ display: 'none' }}
            ref={this.recaptchaRef}
            onExpired={() => {
              if (
                this.recaptchaRef &&
                this.recaptchaRef.current &&
                this.recaptchaRef.current.execute
              ) {
                this.recaptchaRef.current.execute();
              }
            }}
            size="invisible"
            badge="inline"
            onChange={(result) => {
              setFieldValue('recaptchaField', result, true);
            }}
            sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
          />
        </div>
        <div className="has-text-left">
          <button className="button is-success" type="submit" disabled={isSubmitting || !isValid}>
            Login Now !
          </button>
        </div>
        <div className="has-text-left">
          <button
            style={{ boxShadow: 'none', padding: 0, marginTop: 14 }}
            className="button is-text is-small"
            onClick={() => alert('Not implemented yet')}
            disabled={isSubmitting}
          >
            reset your credentials ?
          </button>
        </div>
      </form>
    );
  }
}

export default EnhancedForms(LocalLoginForm);
