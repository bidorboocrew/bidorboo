import { withRouter } from 'react-router-dom';
import React from 'react';

class ScrollToTopOnRouteChagne extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}
export default withRouter(ScrollToTopOnRouteChagne);
