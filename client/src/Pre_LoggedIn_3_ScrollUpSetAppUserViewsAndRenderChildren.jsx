import React from 'react';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';
import { getBugsnagClient } from './index';

class Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb(
      'componentDidCatch Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren',
      {
        debugInfo: info,
      },
    );
    getBugsnagClient().notify(error);
  }

  componentDidMount() {
    const { userDetails } = this.props;
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

    if (
      window.localStorage.getItem('bob_lastKnownRoute') &&
      window.location.pathname.indexOf(window.localStorage.getItem('bob_lastKnownRoute')) === -1
    ) {
      const redirectToLastKnownLocation = window.localStorage.getItem('bob_lastKnownRoute');
      window.localStorage.removeItem('bob_lastKnownRoute');
      return switchRoute(redirectToLastKnownLocation);
    }

    const { setServerAppRequesterView, setServerAppTaskerView } = this.props;
    const currentUrlPathname = window.location.pathname;

    if (currentUrlPathname.indexOf('bdb-request') > -1) {
      setServerAppRequesterView();
    } else if (currentUrlPathname.indexOf('bdb-bidder') > -1) {
      setServerAppTaskerView();
    }

    getBugsnagClient().metaData = {
      userInfo: {
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
        _id,
      },
    };

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }

  render() {
    return this.props.children;
  }
}

export default Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren;
