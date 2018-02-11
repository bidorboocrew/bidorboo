import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'react-responsive-modal';
import LoginForm from './forms/LoginForm';
import RegistrationForm from './forms/RegistrationForm';

import 'react-responsive-modal/lib/react-responsive-modal.css';
import './styles/loginOrRegisterModal.css';

class LoginOrRegisterModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    source: PropTypes.string
  };

  static defaultProps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    source: 'login'
  };

  submitLoginForm(formValues){

  }
  submitRegisterForm = (formValues)=>{

  }

  render() {
    const { open, onClose, source } = this.props;
    const classNames_loginTitle = classnames('sectionTitle',[{'Active': source === 'login'}]);
    const classNames_RegisterTitle = classnames('sectionTitle',[{'Active': source === 'register'}]);

    return (
      <div id="modal-dialog">
        <Modal open={open} onClose={onClose} little>
          <div className="form">
            <div className="leftSide">
              <div className={classNames_loginTitle}>
                <span>Login</span>{' '}
                <span className="subtext">(existing user)</span>
              </div>
              <LoginForm onSubmit={this.submitLoginForm} />
            </div>
            <div className="verticalDivider hide-on-small-and-down" />
            <div className="rightSide">
              <div className={classNames_RegisterTitle}>
                <span>Register?</span>{' '}
                <span className="subtext">(It's free)</span>
              </div>
              <RegistrationForm onSubmit={this.submitRegisterForm} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginOrRegisterModal;
