import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class BidderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      willUnmount: false
    };
  }

  componentWillUnmount() {
    this.setState({ willUnmount: true });
  }
  render() {
    let rootClasses = classnames('animated contentWrapper', {
      bounceOutRight: this.state.willUnmount,
      bounceInLeft: !this.state.willUnmount,
    });
    return (
      <div id="bob-proposer-content" className={rootClasses}>
        <div className="__content"> BIDDER CONTAINER</div>
      </div>
    );
  }
}

export default BidderContainer;
