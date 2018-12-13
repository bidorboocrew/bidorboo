import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import * as ROUTES from '../constants/frontend-route-consts';

export const LoginOrRegisterModal = (props) => {
  const { isActive, handleCancel } = props;
  const openModalClass = classNames('modal', { 'is-active': isActive });

  const googleAuthPath = `${ROUTES.API.AUTH.GOOGLE}/?originPath=${window.location.pathname || '/'}`;
  const facebookAuthPath = `${ROUTES.API.AUTH.FACEBOOK}/?originPath=${window.location.pathname ||
    '/'}`;

  return isActive ? (
    <div className={openModalClass}>
      <div onClick={handleCancel} className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Join BidOrBoo</p>
          <button onClick={handleCancel} className="delete" aria-label="close" />
        </header>
        <section className="modal-card-body">
          <div style={{ textAlign: 'cetner' }}>
            <a
              rel="noopener noreferrer"
              className="button is-danger  is-large is-fullwidth"
              href={googleAuthPath}
              // onClick={(e) => {
              //   e.preventDefault();
              //   const apipath=  ROUTES.API.AUTH.GOOGLE;

              //   axios.get(apipath);
              // }}
              style={{ marginTop: 8 }}
            >
              <span>
                <i className="fab fa-google" />
              </span>
              <span style={{ marginLeft: 4 }} className="text">
                login using Google
              </span>
            </a>
            <a
              rel="noopener noreferrer"
              href={facebookAuthPath}
              className="button is-link is-large is-fullwidth"
              style={{ marginTop: 16 }}
            >
              <span>
                <i className="fab fa-facebook-square" />
              </span>
              <span style={{ marginLeft: 4 }} className="text">
                login using Facebook
              </span>
            </a>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button onClick={handleCancel} className="button">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  ) : null;
};
