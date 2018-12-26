import React from 'react';

export default class ActiveSearchFilters extends React.Component {
  render() {
    const { toggleSideNav } = this.props;

    return (
      <div style={{ margin: 10 }} className="container has-text-info has-text-centered">
        <span>
          Filters Applied. if you can't find what you are looking for try to clear all filters
        </span>
        <a onClick={toggleSideNav} className="button is-outlined is-small">
          Show Filters
        </a>
      </div>
    );
  }
}
