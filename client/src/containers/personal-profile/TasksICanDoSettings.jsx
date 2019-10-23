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
    this.setState({ areThereChanges: false });
  };

  render() {
    const { taskTypesIds } = this.state;

    const listOfTasks = Object.keys(TASKS_DEFINITIONS).map((key) => {
      return (
        <div key={`key-${key}`} className="group">
          <input
            id={key}
            name={key}
            type="checkbox"
            className="switch is-rounded is-success"
            onChange={() =>
              this.setState({
                areThereChanges: true,
                taskTypesIds: {
                  ...this.state.taskTypesIds,
                  [key]: !this.state.taskTypesIds[key],
                },
              })
            }
            checked={taskTypesIds[key]}
          />
          <label className="has-text-dark" htmlFor={key}>
            {TASKS_DEFINITIONS[key].TITLE}
          </label>
        </div>
      );
    });
    return (
      <div className="card cardWithButton nofixedwidth">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon">
              <i className="fas fa-toolbox" />
            </span>
            <span>Want to be a tasker?</span>
          </p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="group">
              <label className="label">What services can you provide?</label>
            </div>
            {listOfTasks}
            <div className="help">
              {`* We will display custom results based on your selection when you visit `}
              <a rel="noopener noreferrer" href={ROUTES.CLIENT.BIDDER.root}>
                {` Jobs search page`}
              </a>
            </div>
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
