import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNotificationSettings } from '../../app-state/actions/userModelActions';
import { registerServiceWorker } from '../../registerServiceWorker';
// import { registerPushNotification } from '../../registerPushNotification';
import { getBugsnagClient } from '../../index';

// XXXXX https://developers.google.com/web/fundamentals/codelabs/push-notifications follow this
class MyNotifications extends React.Component {
  constructor(props) {
    super(props);
    const {
      isEmailNotificationsEnabled,
      isTextNotificationsEnabled,
      isPushNotificationsEnabled,
      isNotifyMeAboutNewTasksEnabled,
    } = this.props;

    this.state = {
      enablePushNotifications: isPushNotificationsEnabled,
      enableEmailNotification: isEmailNotificationsEnabled,
      enableTxtNotifications: isTextNotificationsEnabled,
      enableNotifyMeAboutNewTasksEnabled: isNotifyMeAboutNewTasksEnabled,
    };
    // registerServiceWorker()
    //   .then(({ registration }) => {
    //     registerPushNotification(`${process.env.REACT_APP_VAPID_KEY}`, registration)
    //       .then(() => console.log('push Notifications enabled'))
    //       .catch((e) => console.log('push Notifications not enabled ' + e));
    //   })
    //   .catch(() => console.info('ServiceWorker was not added'));
  }

  async componentDidMount() {
    const { userDetails } = this.props;
    try {
      if (window.OneSignal) {
        window.OneSignal.showSlidedownPrompt({ force: true });
        window.OneSignal.registerForPushNotifications();
        const oneSignalUserId = await window.OneSignal.getUserId();
        if (userDetails.oneSignalUserId !== oneSignalUserId) {
          if (oneSignalUserId) {
            await axios.post('/api/push/register', {
              data: {
                oneSignalUserId,
              },
            });
          }
        }
      }
    } catch (e) {
      getBugsnagClient().leaveBreadcrumb('error updating onesignal user id');
      getBugsnagClient().notify(e);
    }
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
  toggleEnablePushNotifications = async () => {
    this.setState(
      () => ({
        enablePushNotifications: !this.state.enablePushNotifications,
      }),
      () => this.submit(),
    );
  };

  toggleEnableEmailNotification = () => {
    this.setState(
      () => ({
        enableEmailNotification: !this.state.enableEmailNotification,
      }),
      () => this.submit(),
    );
  };

  toggleEnableTxtNotifications = () => {
    this.setState(
      () => ({
        enableTxtNotifications: !this.state.enableTxtNotifications,
      }),
      () => this.submit(),
    );
  };
  toggleEnableNotifyMeAboutNewTasksEnabled = () => {
    this.setState(
      () => ({
        enableNotifyMeAboutNewTasksEnabled: !this.state.enableNotifyMeAboutNewTasksEnabled,
      }),
      () => this.submit(),
    );
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
  };

  render() {
    return (
      <>
        <section className="hero is-white">
          <div className="hero-body has-text-centered">
            <div className="container">
              <h1 style={{ marginBottom: 0 }} className="title">
                Notification Settings
              </h1>
            </div>
          </div>
        </section>
        <div className="columns is-centered is-mobile">
          <div className="column limitLargeMaxWidth slide-in-right">
            <div className="card cardWithButton nofixedwidth">
              <div className="card-content">
                <div className="content">
                  <div className="group">
                    <label style={{ fontSize: '1rem' }} className="label has-text-dark">
                      You will be notified about key events like:
                    </label>
                    <ul style={{ marginLeft: '1.5rem' }}>
                      <li>Request status changes</li>
                      <li>Payment receipts and payouts</li>
                      <li>Reminders about upcoming bookings</li>
                    </ul>
                  </div>

                  <br></br>
                  <div className="group">
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
                  <div className="group">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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
    dispatch,
    updateNotificationSettings: bindActionCreators(updateNotificationSettings, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyNotifications);
