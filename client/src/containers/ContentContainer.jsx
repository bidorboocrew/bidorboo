import React from 'react';
import PropTypes from 'prop-types';
import './styles/content.css';


class ContentContainer extends React.Component {
  render() {

    return (
      <div id="bob-root-content" className="contentWrapper">
        <div className="__introImage"> saeed </div>
        <div className="row">
          <div className="col s12 m4 l3"> dsdsd</div>
          <div className="col s12 m8 l9">dsds</div>
        </div>
      </div>
    );
  }
}

export default ContentContainer;
