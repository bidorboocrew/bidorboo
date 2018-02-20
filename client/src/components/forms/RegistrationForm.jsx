import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Field, reduxForm } from 'redux-form';
import './styles/formstyles.css';

class RegistrationForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="firstName">First Name</label>
          <Field
            className="bdb-input"
            id="firstName"
            name="firstName"
            component="input"
            type="text"
          />
        </div>
        <div className="input-field">
          <label htmlFor="lastName">Last Name</label>
          <Field
            className="bdb-input"
            name="lastName"
            component="input"
            type="text"
          />
        </div>
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <Field
            className="bdb-input"
            name="email"
            component="input"
            type="email"
          />
        </div>
        <div className="buttonsSection">
          <button
            className="formbutton medium"
            type="submit"
          >
            Signup
          </button>
        </div>
      </form>
    );
  }
}

RegistrationForm = reduxForm({
  // a unique name for the form
  form: 'registration'
})(RegistrationForm);

export default RegistrationForm;
