import React from 'react';
import { Field, reduxForm } from 'redux-form';
import LoginForm from './forms/LoginForm';
import RegistrationForm from './forms/RegistrationForm';

import './styles/login.css';

class BidderContainer extends React.Component {
  submitLoginForm = vals => {
    debugger;
  };
  submitNewRegistrationForm = vals => {
    debugger;
  };

  render() {
    return (
      <div id="bdb-login-content" className="loginWrapper">
        <div className="form">
          <div className="leftSide">
            <div className="sectionTitle">Login</div>
            <LoginForm onSubmit={this.submitLoginForm} />
          </div>
          <div className="verticalDivider" />
          <div className="rightSide">
            <div className="sectionTitle">Register</div>
            <RegistrationForm onSubmit={this.RegisterForm} />
          </div>
        </div>
      </div>
    );
  }
}

export default BidderContainer;
