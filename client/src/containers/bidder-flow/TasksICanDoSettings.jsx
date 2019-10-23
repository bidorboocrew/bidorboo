import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTasksICanDo } from '../../app-state/actions/userModelActions';
import TASKS_DEFINITIONS from '../../bdb-tasks/tasksDefinitions';
import * as ROUTES from '../../constants/frontend-route-consts';

class TasksICanDoSettings extends React.Component {
  constructor(props) {
    super(props);
    let taskTypesIds = {};
    Object.keys(TASKS_DEFINITIONS).forEach((key) => {
      taskTypesIds[key] = false;
    });
    this.state = { taskTypesIds, areThereChanges: false };
  }
  componentDidMount() {
    const { userDetails } = this.props;
    if (userDetails && userDetails._id && userDetails.tasksICanDo) {
      const { tasksICanDo } = userDetails;
      let taskTypesIds = {};
      Object.keys(TASKS_DEFINITIONS).forEach((key) => {
        taskTypesIds[key] = tasksICanDo.indexOf(key) > -1;
      });

      this.setState({ taskTypesIds, areThereChanges: false });
    }
  }

  submit = () => {
    // call server to update this setting
    const { updateTasksICanDo } = this.props;

    const { taskTypesIds } = this.state;
    const subscribetoTaskIds = Object.keys(taskTypesIds).filter((key) => {
      return !!taskTypesIds[key];
    });
    updateTasksICanDo(subscribetoTaskIds);
  };

  render() {
    const { taskTypesIds } = this.state;

    const listOfTasks = Object.keys(TASKS_DEFINITIONS).map((key) => {
      return (
        <span
          style={{ cursor: 'pointer' }}
          key={`key-${key}`}
          onClick={() =>
            this.setState(
              () => ({
                areThereChanges: true,
                taskTypesIds: {
                  ...taskTypesIds,
                  [key]: !taskTypesIds[key],
                },
              }),
              () => {
                const { updateTasksICanDo } = this.props;

                const { taskTypesIds } = this.state;
                const subscribetoTaskIds = Object.keys(taskTypesIds).filter((key) => {
                  return !!taskTypesIds[key];
                });
                updateTasksICanDo(subscribetoTaskIds);
              },
            )
          }
          className={`tag is-rounded ${taskTypesIds[key] ? 'is-success' : ''}`}
        >
          {TASKS_DEFINITIONS[key].TITLE}
        </span>
      );
    });
    return (
      <div className="has-text-left">
        <div className="group">
          <label className="label">Filter by the services that you can provide</label>
        </div>
        <div className="tags are-medium">{listOfTasks}</div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { userDetails } = userReducer;

  return {
    userDetails: userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateTasksICanDo: bindActionCreators(updateTasksICanDo, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TasksICanDoSettings);
