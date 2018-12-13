import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { urlB64ToUint8Array } from './utils';

var swRegistration = null;

class WebPush extends Component {
  constructor(props) {
    super(props);

    this.onRegisterServiceWorker = this.onRegisterServiceWorker.bind(this);
    this.onSubscribeUser = this.onSubscribeUser.bind(this);
    this.unsubscribeUser = this.unsubscribeUser.bind(this);
  }

  componentWillMount() {
    if (swRegistration == null) {
      this.onRegisterServiceWorker();
    }
  }

  onSubscribeUser() {
    if (swRegistration == null) {
      return;
    }

    var onUpdateSubscriptionOnServer = this.props.onUpdateSubscriptionOnServer;
    var onSubscribeFailed = this.props.onSubscribeFailed;
    var applicationServerPublicKey = this.props.applicationServerPublicKey;

    swRegistration.pushManager.getSubscription().then((subscription) => {
      if (subscription !== null) {
        onUpdateSubscriptionOnServer(subscription);
      } else {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
          })
          .then((subscription) => {
            console.log('User is subscribed.');
            if (onUpdateSubscriptionOnServer) {
              onUpdateSubscriptionOnServer(subscription);
            }
          })
          .catch((err) => {
            console.log('Failed to subscribe the user: ', err);
            if (onSubscribeFailed) {
              onSubscribeFailed(err);
            }
          });
      }
    });
  }
  unsubscribeUser() {
    swRegistration.pushManager
      .getSubscription()
      .then((subscription) => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch((error) => {
        console.log('Error unsubscribing', error);
      })
      .then(() => {
        this.props.onUpdateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
      });
  }

  onRegisterServiceWorker() {
    navigator.serviceWorker
      .register('sw.js', {
        scope: '/',
      })
      .then((swReg) => {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        this.onSubscribeUser();
       // this.unsubscribeUser();
      });
  }

  render() {
    return <div />;
  }
}

WebPush.propTypes = {
  applicationServerPublicKey: PropTypes.string.isRequired,
  onUpdateSubscriptionOnServer: PropTypes.func,
  onSubscribeFailed: PropTypes.func,
};

export default WebPush;
