import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNotificationSettings } from '../../app-state/actions/userModelActions';

class SubscribeToSearchResultsToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubscribed: false,
    };
  }

  toggleAndSubmit = () => {
    // call server to update this setting

    const {
      updateNotificationSettings,
      enableEmailNotification,
      enableTxtNotifications,
      enablePushNotifications,
    } = this.props;

    this.setState(
      () => ({ isSubscribed: !this.state.isSubscribed }),
      () => {
        updateNotificationSettings({
          push: !!enablePushNotifications,
          email: !!enableEmailNotification,
          text: !!enableTxtNotifications,
          newPostedTasks: this.state.isSubscribed,
        });
      },
    );
  };

  componentDidMount() {
    this.setState({ isSubscribed: this.props.isNotifyMeAboutNewTasksEnabled });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isNotifyMeAboutNewTasksEnabled !== this.props.isNotifyMeAboutNewTasksEnabled) {
      this.setState({ isSubscribed: this.props.isNotifyMeAboutNewTasksEnabled });
    }
  }

  render() {
    const { isSubscribed } = this.state;

    return (
      <div style={{ marginBottom: '0.75rem', textAlign: 'left', marginTop: '0.75rem' }}>
        <input
          id="notifyMeAboutNewTasks"
          type="checkbox"
          name="notifyMeAboutNewTasks"
          className="switch is-rounded is-success"
          onChange={this.toggleAndSubmit}
          checked={isSubscribed}
        />
        <label style={{ fontWeight: 500 }} htmlFor="notifyMeAboutNewTasks">
          Subscribe to search results
        </label>
        <p className="help has-text-light">*Get notified when newly posted requests matches your search criteria</p>
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
)(SubscribeToSearchResultsToggle);
