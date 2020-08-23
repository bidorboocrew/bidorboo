import React from 'react';
import { getBugsnagClient } from './index';

class Pre_LoggedOut_2_ScrollUpSetAppViewAndRenderChildren extends React.PureComponent {
  componentDidCatch(error, info) {
    getBugsnagClient().leaveBreadcrumb(
      'componentDidCatch Pre_LoggedOut_3_ScrollUpSetAppViewAndRenderChildren',
      { debugInfo: info },
    );
    getBugsnagClient().notify(error);
  }

  componentDidMount() {
    const { setAppViewUIToRequester, setAppViewUIToTasker } = this.props;

    const currentUrlPathname = window.location.pathname;

    if (currentUrlPathname.indexOf('bdb-request') > -1) {
      setAppViewUIToRequester();
    } else if (currentUrlPathname.indexOf('bdb-bidder') > -1) {
      setAppViewUIToTasker();
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }

  render() {
    return this.props.children;
  }
}

export default Pre_LoggedOut_2_ScrollUpSetAppViewAndRenderChildren;
