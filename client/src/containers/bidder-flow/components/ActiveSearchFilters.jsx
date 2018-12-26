import React from 'react';

export default class ActiveSearchFilters extends React.Component {
  render() {
    const { clearFilters } = this.props;

    return (
      <div style={{ margin: 10 }} className="container has-text-info has-text-centered">
        <span>Filters Applied. if you can't find what you are looking for try to </span>
        <a onClick={clearFilters} className="button is-outlined is-small">
          Clear All Filters
        </a>
      </div>
    );
  }
}
