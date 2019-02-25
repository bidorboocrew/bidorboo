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
import NotificationSettings from './NotificationSettings';

export default class MyProfile extends React.Component {
  render() {
    return (
      <section className="section">
        <a onClick={() => axios.put('/api/fakepush')} className="button is-success is-large">
          Click to Push
        </a>
      </section>
    );
  }
}
