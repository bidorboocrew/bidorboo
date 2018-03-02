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
            <div className="sectionTitle active">
              <span>BidOrBoo</span>
            </div>
            <div className="socialmediaLogin">
              <div className="row">
                <a
                  rel="noopener noreferrer"
                  href={ROUTES.BACKENDROUTES.AUTH.GOOGLE}
                  className="bdb bdb-google col-xs-12"
                >
                  <span>
                    <img
                      className="icon"
                      src={require('../assets/images/google.png')}
                    />
                  </span>
                  <span className="text">login using Google</span>
                </a>
                <a
                  rel="noopener noreferrer"
                  href={ROUTES.BACKENDROUTES.AUTH.FACEBOOK}
                  className="bdb bdb-facebook col-xs-12"
                >
                  <span>
                    <img
                      className="icon"
                      src={require('../assets/images/facebook.png')}
                    />
                  </span>
                  <span className="text">login using Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginOrRegisterModal;
