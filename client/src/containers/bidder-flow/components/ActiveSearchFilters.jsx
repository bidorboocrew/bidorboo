import React from 'react';

export default class ActiveSearchFilters extends React.Component {
  render() {
    const { toggleSideNav } = this.props;

    return (
      <div>
        <a onClick={toggleSideNav} className="button is-outline">
          <span className="icon">
            <i className="fas fa-search" />
          </span>
          <span>Search</span>
        </a>
      </div>
    );
  }
}
