import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import * as ROUTES from '../constants/route_const';

import 'react-responsive-modal/lib/react-responsive-modal.css';
import './styles/loginOrRegisterModal.css';

class LoginOrRegisterModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    const { open, onClose } = this.props;

    return (
      <div id="modal-dialog">
        <Modal open={open} onClose={onClose} little>
          <div className="form">
            {/* <div className="sectionTitle active">
              <span>Signin</span>
            </div> */}
            <div className="socialmediaLogin">
              <a
                rel="noopener"
                href={ROUTES.BACKENDROUTES.AUTH.GOOGLE}
                className="fa fa-google"
              >
                <span> login with google </span>
              </a>
              <a
                rel="noopener"
                href={ROUTES.BACKENDROUTES.AUTH.FACEBOOK}
                className="fa fa-facebook"
              >
                <span> login with facebook</span>
              </a>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginOrRegisterModal;
