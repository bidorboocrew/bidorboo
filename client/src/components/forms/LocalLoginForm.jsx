import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from './FormsHelpers';
import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

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

class LocalLoginForm extends React.Component {
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
        <br></br>
      </form>
    );
  }
}

export default EnhancedForms(LocalLoginForm);
