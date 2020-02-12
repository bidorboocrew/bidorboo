import React from 'react';
import * as ROUTES from './constants/frontend-route-consts';
import { switchRoute } from './utils';

class Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren extends React.PureComponent {
  componentDidMount() {
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

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }

  render() {
    return this.props.children;
  }
}

export default Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren;
