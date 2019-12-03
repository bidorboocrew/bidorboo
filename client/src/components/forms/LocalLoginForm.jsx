import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';
import Recaptcha from 'react-google-invisible-recaptcha';

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
      recaptchaField: values.recaptchaField,
    });
    setSubmitting(false);
  },
  recaptchaField: Yup.string()
    .ensure()
    .trim()
    .required('require pass recaptcha.'),
  displayName: 'LocalLoginForm',
});

class LocalLoginForm extends React.Component {
  onResolved = () => {
    this.props.setFieldValue('recaptchaField', this.recaptcha.getResponse());
  };
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.recaptcha.execute();
    } else {
      this.props.setFieldValue('recaptchaField', 'test');
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
      isValid,
      isSubmitting,
      handleCancel,
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
        <div className="has-text-left">
          <button
            style={{ borderRadius: 0 }}
            className="button is-success"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Login
          </button>
        </div>
        <div className="has-text-left">
          <button
            style={{ boxShadow: 'none', padding: 0, marginTop: 14 }}
            className="button is-text is-small"
            onClick={() => {
              switchRoute(ROUTES.CLIENT.RESETPASSWORD);
            }}
            disabled={isSubmitting}
          >
            reset your credentials ?
          </button>
        </div>
        <br></br>

        <input id="recaptchaField" className="input is-invisible" type="hidden" value={''} />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Recaptcha
              ref={(ref) => (this.recaptcha = ref)}
              sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
              onLoaded={() => console.log('loaded')}
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

export default EnhancedForms(LocalLoginForm);
