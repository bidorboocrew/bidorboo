import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Field, reduxForm } from 'redux-form';
import './styles/formstyles.css';

class LoginForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };


  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <Field
            id="email"
            className="bdb-input"
            name="email"
            component="input"
            type="email"
            onFocus={() => this.setState({ activeField: 'email' })}
          />
        </div>
        <div className="input-field">
          <label htmlFor="lastName">password</label>
          <Field
            id="password"
            className="bdb-input"
            name="password"
            component="input"
            type="text"
            onFocus={() => this.setState({ activeField: 'password' })}
          />
        </div>
        <div className="buttonsSection">
          <button  className="formbutton medium" type="submit">
            Login
          </button>
        </div>
        <div className="socialmediaLogin">
          <div>
            <a href="/auth/google" className="fa fa-google">
              <span> login with google </span>
            </a>
          </div>
          <div>
            <a href="/auth/facebook" className="fa fa-facebook">
              <span> login with facebook</span>
            </a>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'login'
})(LoginForm);
