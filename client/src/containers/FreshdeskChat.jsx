import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import { onLogout } from '../app-state/actions/authActions';
import LoginOrRegisterModal from '../LoginOrRegisterModal';
import { showLoginDialog } from '../app-state/actions/uiActions';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { NotificationsModal } from './index';
import logoImg from '../assets/images/android-chrome-192x192.png';

// https://developers.freshchat.com/web-sdk/#customisation-wgt

class FreshdeskChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isInitialized: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { isLoggedIn: currentLoggedInState } = this.props;

    if (prevProps.isLoggedIn !== currentLoggedInState) {
      if (!currentLoggedInState) {
        if (window.fcWidget && window.fcWidget.isInitialized()) {
          window.fcWidget.destroy();
        }
      }
    }

    if (window.fcWidget && !window.fcWidget.isInitialized()) {
      window.fcWidget.init({
        token: `${process.env.REACT_APP_FRESHDESK_CHAT_KEY}`,
        host: 'https://wchat.freshchat.com',
        config: {
          disableEvents: true,
          headerProperty: {
            //If you have multiple sites you can use the appName and appLogo to overwrite the values.
            appName: 'BidOrBoo',
            appLogo:
              'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1562257900/android-chrome-512x512.png',
            backgroundColor: '#ef2834',
            foregroundColor: '#353535',
            hideChatButton: true,
            fontName: 'Work Sans, sans-serif',
            fontUrl:
              'https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700&display=swap',
          },
          content: {
            headers: {
              chat: 'BidOrBooCrew Support',
              chat_help: 'Reach out to us if you have any questions',
              push_notification: 'Allow push notifications to get instant replies',
            },
          },
        },
      });
      this.setState({ isInitialized: true });
    }
  }

  togglChat = (e) => {
    e.preventDefault();
    if (window.fcWidget && window.fcWidget.isInitialized()) {
      const { isLoggedIn, userDetails } = this.props;

      if (isLoggedIn) {
        const {
          appView,
          canBid,
          canPost,
          displayName,
          email,
          phone,
          membershipStatus,
          userId,
          _id,
          rating,
        } = userDetails;
        // To set unique user id in your system when it is available
        window.fcWidget.setExternalId(userId);
        // To set user name
        window.fcWidget.user.setFirstName(displayName);
        // To set user email
        window.fcWidget.user.setEmail((email && email.emailAddress) || '');
        // To set user properties
        window.fcWidget.user.setProperties({
          appView,
          canBid,
          canPost,
          displayName,
          email: JSON.stringify(email),
          phone: JSON.stringify(phone),
          rating: JSON.stringify(rating),
          membershipStatus,
          userId,
          currentPage: window.location.href,
          _id,
        });
      }
      if (window.fcWidget.isOpen() != true) {
        window.fcWidget.open();
      } else {
        window.fcWidget.close();
      }
    }
  };

  render() {
    const { isInitialized } = this.state;
    return isInitialized ? (
      <button
        id="bob-ChatSupport"
        onClick={this.togglChat}
        className="button is-danger"
      >
        <span className="icon">
          <i className="far fa-comment-dots" />
        </span>
        <span>Chat</span>
      </button>
    ) : null;
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { userDetails } = userReducer;
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userDetails,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(FreshdeskChat),
);
