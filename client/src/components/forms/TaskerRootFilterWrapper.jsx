import React from 'react';
import TaskerRootLocationFilter from './TaskerRootLocationFilter';

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
