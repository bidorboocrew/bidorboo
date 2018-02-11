import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Field, reduxForm } from 'redux-form';
import '../styles/formstyles.css';

class RegistrationForm extends React.Component {
  static PropTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { activeField: '' };
  }

  render() {
    const { onSubmit } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <div calssName="input-field">
          <label htmlFor="firstName">First Name</label>
          <Field
            className="bdb-input"
            id="firstName"
            name="firstName"
            component="input"
            type="text"
          />
        </div>
        <div calssName="input-field">
          <label htmlFor="lastName">Last Name</label>
          <Field
            className="bdb-input"
            name="lastName"
            component="input"
            type="text"
          />
        </div>
        <div calssName="input-field">
          <label htmlFor="email">Email</label>
          <Field
            className="bdb-input"
            name="email"
            component="input"
            type="email"
          />
        </div>
        <div className="buttonsSection">
          <a className="formbutton medium" type="submit">
            Submit
          </a>
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
