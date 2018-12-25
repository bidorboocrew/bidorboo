import React from 'react';

export default class ActiveSearchFilters extends React.Component {
  render() {
    const { filters } = this.props;
    if (!filters || !filters.length > 0) {
      return null;
    }

    return (
      <div>
        <div>Filters Applies</div>
      </div>
    );
  }
}
