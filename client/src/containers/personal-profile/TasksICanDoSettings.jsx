import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTasksICanDo } from '../../app-state/actions/userModelActions';
import TASKS_DEFINITIONS from '../../bdb-tasks/tasksDefinitions';
class TasksICanDoSettings extends React.Component {
  componentDidMount() {
    const { userDetails } = this.props;
    if (userDetails && userDetails._id && userDetails.tasksICanDo) {
      const { tasksICanDo } = userDetails;
      let tasksICanDoSettings = {};
      Object.keys(TASKS_DEFINITIONS).forEach((key) => {
        tasksICanDoSettings[key] = tasksICanDo.indexOf(key) > -1;
      });

      this.setState({ tasksICanDoSettings });
    }
  }
  toggleSetting = (taskTypeId) => {
    this.setState({
      tasksICanDoSettings: {
        ...tasksICanDoSettings,
        [taskTypeId]: !tasksICanDoSettings[taskTypeId],
      },
    });
  };

  submit = () => {
    // call server to update this setting
    const { updateTasksICanDo } = this.props;

    const { tasksICanDoTypeIds } = this.state;
    debugger;
    updateTasksICanDo({
      ...tasksICanDoTypeIds,
    });
    this.setState({ areThereChanges: false });
  };

  render() {
    const listOfTasks = Object.keys(TASKS_DEFINITIONS).map((key) => {
      return (
        <div className="group">
          <input
            key={`key-${key}`}
            id="key"
            type="checkbox"
            name="pushNotification"
            className="switch is-rounded is-success"
            onChange={() => this.toggleSetting(key)}
            checked={this.state.tasksICanDoTypeIds[key] || false}
          />
          <label className="has-text-dark" htmlFor="pushNotification">
            Enable Push Notifications
          </label>
        </div>
      );
    });
    return (
      <div className="card cardWithButton nofixedwidth">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon">
              <i className="fas fa-bell" />
            </span>
            <span>Services I can provide</span>
          </p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="group">
              <label className="label">Why it is important?</label>
              <ul>
                <li>We will show custom results when you search for tasks</li>
              </ul>
            </div>
            {listOfTasks}
            <button
              className="button firstButtonInCard is-success"
              onClick={this.submit}
              disabled={!this.state.areThereChanges}
            >
              Update Settings
            </button>
          </div>
        </div>
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
