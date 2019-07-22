import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNotificationSettings } from '../../app-state/actions/userModelActions';

class NotificationSettings extends React.Component {
  constructor(props) {
    super(props);
    const {
      isEmailNotificationsEnabled,
      isTextNotificationsEnabled,
      isPushNotificationsEnabled,
    } = this.props;

    this.state = {
      areThereChanges: false,
      enablePushNotifications: isPushNotificationsEnabled,
      enableEmailNotification: isEmailNotificationsEnabled,
      enableTxtNotifications: isTextNotificationsEnabled,
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

  submit = () => {
    // call server to update this setting
    const { updateNotificationSettings } = this.props;

    const { enableEmailNotification, enableTxtNotifications, enablePushNotifications } = this.state;
    updateNotificationSettings({
      push: !!enablePushNotifications,
      email: !!enableEmailNotification,
      text: !!enableTxtNotifications,
    });
    this.setState({ areThereChanges: false });
  };

  render() {
    return (
      <div className="card disabled">
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
              <label htmlFor="pushNotification">Enable Push Notifications</label>
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
              <label htmlFor="emailNotification">Enable Email Notifications</label>
            </div>
            <div className="group saidTest">
              <input
                id="txtNotification"
                type="checkbox"
                name="txtNotification"
                className="switch is-rounded is-success"
                onChange={this.toggleEnableTxtNotifications}
                checked={this.state.enableTxtNotifications}
              />
              <label htmlFor="txtNotification">Enable Text Msg Notifications</label>
            </div>

            <a
              className="button is-success"
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
