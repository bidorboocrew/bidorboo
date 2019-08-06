import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNotificationSettings } from '../../app-state/actions/userModelActions';
import * as ROUTES from '../../constants/frontend-route-consts';

class NotificationSettings extends React.Component {
  constructor(props) {
    super(props);
    const {
      isEmailNotificationsEnabled,
      isTextNotificationsEnabled,
      isPushNotificationsEnabled,
      isNotifyMeAboutNewTasksEnabled,
    } = this.props;

    this.state = {
      areThereChanges: false,
      enablePushNotifications: isPushNotificationsEnabled,
      enableEmailNotification: isEmailNotificationsEnabled,
      enableTxtNotifications: isTextNotificationsEnabled,
      enableNotifyMeAboutNewTasksEnabled: isNotifyMeAboutNewTasksEnabled,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      isEmailNotificationsEnabled,
      isTextNotificationsEnabled,
      isPushNotificationsEnabled,
    } = this.props;

    if (
      isEmailNotificationsEnabled !== prevProps.isEmailNotificationsEnabled ||
      isTextNotificationsEnabled !== prevProps.isTextNotificationsEnabled ||
      isPushNotificationsEnabled !== prevProps.isPushNotificationsEnabled
    ) {
      this.setState({
        enablePushNotifications: isPushNotificationsEnabled,
        enableEmailNotification: isEmailNotificationsEnabled,
        enableTxtNotifications: isTextNotificationsEnabled,
      });
    }
  }
  toggleEnablePushNotifications = () => {
    this.setState({
      areThereChanges: true,
      enablePushNotifications: !this.state.enablePushNotifications,
    });
  };

  toggleEnableEmailNotification = () => {
    this.setState({
      areThereChanges: true,
      enableEmailNotification: !this.state.enableEmailNotification,
    });
  };

  toggleEnableTxtNotifications = () => {
    this.setState({
      areThereChanges: true,
      enableTxtNotifications: !this.state.enableTxtNotifications,
    });
  };
  toggleEnableNotifyMeAboutNewTasksEnabled = () => {
    this.setState({
      areThereChanges: true,
      enableNotifyMeAboutNewTasksEnabled: !this.state.enableNotifyMeAboutNewTasksEnabled,
    });
  };
  submit = () => {
    // call server to update this setting
    const { updateNotificationSettings } = this.props;

    const {
      enableEmailNotification,
      enableTxtNotifications,
      enablePushNotifications,
      enableNotifyMeAboutNewTasksEnabled,
    } = this.state;

    updateNotificationSettings({
      push: !!enablePushNotifications,
      email: !!enableEmailNotification,
      text: !!enableTxtNotifications,
      newPostedTasks: !!enableNotifyMeAboutNewTasksEnabled,
    });
    this.setState({ areThereChanges: false });
  };

  render() {
    return (
      <div className="card cardWithButton nofixedwidth">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon">
              <i className="fas fa-bell" />
            </span>
            <span>Notification Settings</span>
          </p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="group saidTest">
              <label className="label">You will be notified about key events</label>
              <ul>
                <li>Requests or Tasks key updates</li>
                <li>Cancellation happened at any point</li>
                <li>Payments and recietes</li>
              </ul>
            </div>
            <div className="group saidTest">
              <input
                id="pushNotification"
                type="checkbox"
                name="pushNotification"
                className="switch is-rounded is-success"
                onChange={this.toggleEnablePushNotifications}
                checked={this.state.enablePushNotifications}
              />
              <label className="has-text-dark" htmlFor="pushNotification">
                Enable Push Notifications
              </label>
            </div>
            <div className="group saidTest">
              <input
                id="emailNotification"
                type="checkbox"
                name="emailNotification"
                className="switch is-rounded is-success"
                onChange={this.toggleEnableEmailNotification}
                checked={this.state.enableEmailNotification}
              />
              <label className="has-text-dark" htmlFor="emailNotification">
                Enable Email Notifications
              </label>
            </div>
            <div className="group">
              <input
                id="txtNotification"
                type="checkbox"
                name="txtNotification"
                className="switch is-rounded is-success"
                onChange={this.toggleEnableTxtNotifications}
                checked={this.state.enableTxtNotifications}
              />
              <label className="has-text-dark" htmlFor="txtNotification">
                Enable Text Msg Notifications
              </label>
            </div>
            <div className="group saidTest">
              <input
                id="notifyMeAboutNewTasksEnabled"
                type="checkbox"
                name="notifyMeAboutNewTasksEnabled"
                className="switch is-rounded is-success"
                onChange={this.toggleEnableNotifyMeAboutNewTasksEnabled}
                checked={this.state.enableNotifyMeAboutNewTasksEnabled}
              />
              <label className="has-text-dark" htmlFor="notifyMeAboutNewTasksEnabled">
                New Posted Tasks
              </label>
              <div className="help">
                * Get custom notifications about newly posted tasks based on your
                search criteria under the
                <a rel="noopener noreferrer" href={ROUTES.CLIENT.BIDDER.root}>
                  Bid Page
                </a>
              </div>
            </div>
            <a
              className="button firstButtonInCard is-success"
              onClick={this.submit}
              disabled={!this.state.areThereChanges}
            >
              Update Settings
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { userDetails } = userReducer;
  const { notifications } = userDetails;

  return {
    userDetails: userDetails,
    isEmailNotificationsEnabled: notifications.email,
    isTextNotificationsEnabled: notifications.text,
    isPushNotificationsEnabled: notifications.push,
    isNotifyMeAboutNewTasksEnabled: notifications.newPostedTasks,
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateNotificationSettings: bindActionCreators(updateNotificationSettings, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);
