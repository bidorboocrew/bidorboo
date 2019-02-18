import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';

import { getCurrentUser } from '../../app-state/actions/authActions';
import { Spinner } from '../../components/Spinner';

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
      isEmailNotificationsEnabled != prevProps.isEmailNotificationsEnabled ||
      isTextNotificationsEnabled != prevProps.isTextNotificationsEnabled ||
      isPushNotificationsEnabled != prevProps.isPushNotificationsEnabled
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
    const { a_updateNotificationSettings } = this.props;

    const { enableEmailNotification, enableTxtNotifications, enablePushNotifications } = this.state;
    a_updateNotificationSettings({
      push: !!enablePushNotifications,
      email: !!enableEmailNotification,
      text: !!enableTxtNotifications,
    });
  };

  render() {
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) {
      return (
        <section className="section">
          <Spinner isLoading size={'large'} />
        </section>
      );
    }

    return (
      <section className="section">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">Notification Settings</p>
          </header>
          <div className="card-content">
            <div className="content">
              <p>
                Notifications will be sent to inform you about :
                <br />
                * Requests or Tasks that are happening today
                <br />* Your Bids that were awarded.
              </p>

              <div className="field">
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
              <div className="field">
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
              <div className="field">
                <input
                  id="txtNotification"
                  type="checkbox"
                  name="txtNotification"
                  className="switch is-rounded is-success"
                  onChange={this.toggleEnableTxtNotifications}
                  checked={this.state.enableTxtNotifications}
                />
                <label htmlFor="txtNotification">Enable Text Messages Notifications</label>
                <p className="help">* Will only work if you provided your phone number</p>
              </div>
              <br />
              <a
                className="button is-success"
                onClick={this.submit}
                disabled={!this.state.areThereChanges}
              >
                Save Changes
              </a>
            </div>
          </div>
        </div>
      </section>
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
    a_updateNotificationSettings: bindActionCreators(updateNotificationSettings, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);
