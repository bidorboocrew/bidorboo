import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Field, reduxForm } from 'redux-form';
import * as ROUTES from '../../route_const';
import { renderFormField } from './formHelpers';

import './styles/formstyles.css';

class RegistrationForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  render() {
    const { error, handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <Field
            id="registrationEmail"
            className="bdb-input"
            name="email"
            component={renderFormField}
            type="email"
            label="Email"
            onFocus={() => this.setState({ activeField: 'email' })}
          />
        </div>
        <div className="input-field">
          <Field
            id="registrationPassword"
            className="bdb-input"
            name="password"
            component={renderFormField}
            type="password"
            label="Password"
            onFocus={() => this.setState({ activeField: 'password' })}
          />
        </div>
        <div className="input-field">
          <Field
            id="registrationVerifyPassword"
            className="bdb-input"
            name="verifyPassword"
            component={renderFormField}
            type="password"
            label="Verify Password"
            onFocus={() => this.setState({ activeField: 'password' })}
          />
        </div>
        <div className="buttonsSection">
          <button
            disabled={submitting}
            className="formbutton medium"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 8) {
    errors.password = 'password must be at least 8 charachters long';
  }

  if (!values.verifyPassword) {
    errors.verifyPassword = 'Required';
  } else if (values.verifyPassword.length < 8) {
    errors.verifyPassword =
      'original password must be at least 8 charachters long';
  }

  if (!errors.password && !errors.verifyPassword) {
    if (values.password !== values.verifyPassword) {
      errors.password = 'passwords do not match';
      errors.verifyPassword = 'passwords do not match';
    }
  }

  return errors;
};

RegistrationForm = reduxForm({
  // a unique name for the form
  form: 'RegistrationForm',
  validate
})(RegistrationForm);

export default RegistrationForm;
