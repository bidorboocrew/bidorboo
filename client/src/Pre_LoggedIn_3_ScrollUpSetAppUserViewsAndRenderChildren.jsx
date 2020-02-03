import React from 'react';

class Pre_LoggedIn_3_ScrollUpSetAppUserViewsAndRenderChildren extends React.PureComponent {
  componentDidMount() {
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
