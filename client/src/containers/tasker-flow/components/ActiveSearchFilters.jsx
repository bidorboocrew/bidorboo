import React from 'react';

export default class ActiveSearchFilters extends React.Component {
  render() {
    const { toggleSideNav } = this.props;

    return (
      <div style={{ margin: 10 }} className="help container has-text-info has-text-centered">
        <span style={{ marginRight: 8 }}>Filters Applied.</span>
        <a onClick={toggleSideNav} className="button is-small">
          Show Filters
        </a>
      </div>
    );
  }
}
