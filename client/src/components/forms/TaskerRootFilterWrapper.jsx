import React from 'react';
import TaskerRootLocationFilter from './TaskerRootLocationFilter';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

export default class TaskerRootFilterWrapper extends React.Component {
  render() {
    const { show, toggleSideNav } = this.props;
    return (
      <>
        {show && <div onClick={toggleSideNav} id="bdb-background" />}

        <div
          id="bdb-searchTasks"
          className={`${show ? 'slide-in-left' : 'slide-in-left-reversed'}`}
        >
          <TaskerRootLocationFilter {...this.props} />
        </div>
      </>
    );
  }
}
