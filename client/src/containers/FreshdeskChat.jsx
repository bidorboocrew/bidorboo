import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// https://developers.freshchat.com/web-sdk/#customisation-wgt

const getCookieByName = (name) => {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
};
class FreshdeskChat extends React.Component {
  componentDidMount() {
    if (window.fcWidget && !window.fcWidget.isInitialized()) {
      window.fcWidget.init({
        token: `${process.env.REACT_APP_FRESHDESK_CHAT_KEY}`,
        host: 'https://wchat.freshchat.com',
        config: {
          disableEvents: getCookieByName('BidOrBooCookieConsent') === 'true' ? false : true,
          headerProperty: {
            //If you have multiple sites you can use the appName and appLogo to overwrite the values.
            appName: 'BidOrBoo',
            appLogo:
              'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1562257900/android-chrome-512x512.png',
            backgroundColor: '#015ae8',
            foregroundColor: 'white',
            hideChatButton: false,
          },
          content: {
            headers: {
              chat: 'Support Crew',
              chat_help: 'How can we help you?',
              faq: 'Help Articles',
              faq_help: 'Answers to common questions',
              push_notification: 'Allow push notifications to get instant replies',
            },
          },
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { isLoggedIn: currentLoggedInState, userDetails } = this.props;

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
          disableEvents: getCookieByName('BidOrBooCookieConsent') === 'true' ? false : true,
          headerProperty: {
            //If you have multiple sites you can use the appName and appLogo to overwrite the values.
            appName: 'BidOrBoo',
            appLogo:
              'https://res.cloudinary.com/hr6bwgs1p/image/upload/v1562257900/android-chrome-512x512.png',
            backgroundColor: '#015ae8',
            foregroundColor: 'white',
            hideChatButton: false,
          },
          content: {
            headers: {
              chat: 'Support Crew',
              chat_help: 'Reach out to us if you have any questions',
              push_notification: 'Allow push notifications to get instant replies',
            },
          },
        },
      });
    }
    if (!prevProps.isLoggedIn && currentLoggedInState === true) {
      const {
        appView,
        oneSignalUserId,
        isGmailUser,
        isFbUser,
        canBid,
        clearCriminalHistory,
        canPost,
        displayName,
        email,
        phone,
        membershipStatus,
        userId,
        _id,
        notifications,
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
        pushNotificationEnabled: notifications && notifications.push,
        emailNotificationEnabled: notifications && notifications.email,
        textNotificationEnabled: notifications && notifications.text,
        newTaskNotificationEnabled: notifications && notifications.newPostedTasks,
        appView,
        isGmailUser,
        oneSignalUserId,
        isFbUser,
        clearCriminalHistory,
        canBid,
        canPost,
        displayName,
        email: email && email.emailAddress ? email && email.emailAddress : '--',
        isEmailVerified: email && email.isVerified,
        phone: phone && phone.phoneNumber ? phone.phoneNumber : '--',
        isPhoneVerified: phone && phone.isVerified,
        rating: rating && rating.globalRating ? rating.globalRating : '--',
        membershipStatus,
        userId,
        currentPage: window.location.href,
        _id,
      });
    }
  }

  togglChat = (e) => {
    e.preventDefault();
    if (window.fcWidget && window.fcWidget.isInitialized()) {
      const { isLoggedIn, userDetails } = this.props;

      if (isLoggedIn) {
        const {
          appView,
          oneSignalUserId,
          isGmailUser,
          isFbUser,
          canBid,
          clearCriminalHistory,
          canPost,
          displayName,
          email,
          phone,
          membershipStatus,
          userId,
          _id,
          notifications,
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
          pushNotificationEnabled: notifications && notifications.push,
          emailNotificationEnabled: notifications && notifications.email,
          textNotificationEnabled: notifications && notifications.text,
          newTaskNotificationEnabled: notifications && notifications.newPostedTasks,
          appView,
          isGmailUser,
          oneSignalUserId,
          isFbUser,
          clearCriminalHistory,
          canBid,
          canPost,
          displayName,
          email: email && email.emailAddress ? email && email.emailAddress : '--',
          isEmailVerified: email && email.isVerified,
          phone: phone && phone.phoneNumber ? phone.phoneNumber : '--',
          isPhoneVerified: phone && phone.isVerified,
          rating: rating && rating.globalRating ? rating.globalRating : '--',
          membershipStatus,
          userId,
          currentPage: window.location.href,
          _id,
        });
      }
      if (!window.fcWidget.isOpen()) {
        window.fcWidget.open();
      } else {
        window.fcWidget.close();
      }
    }
  };

  render() {
    const { isFooter } = this.props;
    return (
      <button
        id="bob-ChatSupport"
        className={`${isFooter ? 'isFooter' : ''}`}
        onClick={this.togglChat}
        className="button is-danger"
      >
        <span className="icon">
          <i className="far fa-comment-dots" />
        </span>
        <span>Chat</span>
      </button>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { userDetails } = userReducer;
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userDetails,
  };
};

export default withRouter(connect(mapStateToProps, null)(FreshdeskChat));
