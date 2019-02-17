import React from 'react';
import ReactStars from 'react-stars';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import { updateProfileDetails, updateProfileImage } from '../../app-state/actions/userModelActions';
import * as C from '../../constants/enumConstants';
import ProfileForm from '../../components/forms/ProfileForm';
import axios from 'axios';
import FileUploaderComponent from '../../components/FileUploaderComponent';
import * as ROUTES from '../../constants/frontend-route-consts';
import { getCurrentUser } from '../../app-state/actions/authActions';

class NotificationSettings extends React.Component {
  render() {
    return <section className="section"> under construction </section>;
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_updateProfileDetails: bindActionCreators(updateProfileDetails, dispatch),
    a_updateProfileImage: bindActionCreators(updateProfileImage, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);
