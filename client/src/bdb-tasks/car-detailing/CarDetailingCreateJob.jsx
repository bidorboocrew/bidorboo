import React from 'react';
import PropTypes from 'prop-types';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import TASKS_DEFINITIONS from '../tasksDefinitions';
import haversineOffset from 'haversine-offset';

import CarDetailingJobForm from './CarDetailingJobForm';

import { StepsForRequest } from '../../containers/commonComponents';

export default class CarDetailingCreateJob extends React.Component {
  goBack = (e) => {
    e.preventDefault();
    switchRoute(ROUTES.CLIENT.PROPOSER.root);
  };

  postJob = (values) => {
    const { addJob } = this.props;
    // process the values to be sent to the server
    const {
      locationField,
      detailedDescriptionField,
      dateField,
      effortField,
      addressTextField,
      fromTemplateIdField,
      recaptchaField,
    } = values;

    // do some validation before submitting
    if (!locationField || !locationField.lat || !locationField.lng) {
      alert('sorry you must specify the location for this request');
      return;
    }
    if (!addressTextField) {
      alert('sorry you must specify the location for this request');
      return;
    }
    if (!detailedDescriptionField) {
      alert('sorry you must add more details about this request');
      return;
    }
    if (!dateField) {
      alert('sorry you must specify a date for when do you want this request to be done');
      return;
    }
    if (!fromTemplateIdField) {
      alert('sorry something went wrong , we could not detect the Job ID . please try again later');
      return;
    }
    if (!recaptchaField) {
      alert(
        'sorry. RECAPTCHA failed to establish that you are a safe user. please reload the page or log back in again later.',
      );
      return;
    }
    //map form fields to the mongodb schema expected fields
    // for more ddetails look at jobModel.js

    //  offset the location for security
    // https://www.npmjs.com/package/haversine-offset
    let lng = 0;
    let lat = 0;
    try {
      lng = parseFloat(locationField.lng);
      lat = parseFloat(locationField.lat);
      let preOffset = { latitude: lat, longitude: lng };
      let offset = {
        x: Math.floor(Math.random() * Math.floor(1000)),
        y: Math.floor(Math.random() * Math.floor(1000)),
      };

      let postOffset = haversineOffset(preOffset, offset);

      if (postOffset.lat > 0) {
        lat = Math.min(postOffset.lat, 90).toFixed(5);
      } else if (postOffset.lat < 0) {
        lat = Math.max(postOffset.lat, -90).toFixed(5);
      }
      if (postOffset.lng > 0) {
        lng = Math.min(postOffset.lng, 180).toFixed(5);
      } else if (postOffset.lng < 0) {
        lng = Math.max(postOffset.lng, -180).toFixed(5);
      }
    } catch (e) {
      console.log('failed to create location');
    }

    const mapFieldsToSchema = {
      detailedDescription: detailedDescriptionField,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      startingDateAndTime: dateField,
      addressText: addressTextField,
      fromTemplateId: fromTemplateIdField,
      extras: {
        effort: effortField,
      },
    };
    addJob(mapFieldsToSchema, recaptchaField);
  };

  render() {
    const { isLoggedIn, showLoginDialog, currentUserDetails } = this.props;
    const { ID, TITLE, SUGGESTION_TEXT } = TASKS_DEFINITIONS[`bdbjob-car-detailing`];

    return (
      <div
        style={{ maxWidth: 'unset', border: 'none', boxShadow: 'none' }}
        className="card limitLargeMaxWidth"
      >
        <section style={{ padding: '0.5rem' }} className="hero is-small is-white">
          <br />
          <StepsForRequest isSmall step={1} />
          <br />
        </section>

        <div className="card-content">
          <CarDetailingJobForm
            isLoggedIn={isLoggedIn}
            showLoginDialog={showLoginDialog}
            currentUserDetails={currentUserDetails}
            fromTemplateIdField={ID}
            jobTitleField={TITLE}
            suggestedDetailsText={SUGGESTION_TEXT}
            onGoBack={this.goBack}
            onSubmit={this.postJob}
          />
        </div>
      </div>
    );
  }
}

CarDetailingCreateJob.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  showLoginDialog: PropTypes.func.isRequired,
  currentUserDetails: PropTypes.object,
};
