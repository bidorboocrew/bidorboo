/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { withFormik } from 'formik';
// import Yup from 'yup';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  GeoAddressInput,
  TextAreaInput,
  TextInput,
  DateInput,
  TimeInput
} from './FormsHelpers';
import moment from 'moment';
const EnhancedForms = withFormik({
  handleSubmit: (values, { setSubmitting, props }) => {
    // https://stackoverflow.com/questions/32540667/moment-js-utc-to-local-time
    // var x = moment.utc(values.dateField).format('YYYY-MM-DD HH:mm:ss');
    // var y = moment.utc("2018-04-19T19:29:45.000Z").local().format('YYYY-MM-DD HH:mm:ss');;
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'NewJobForm'
});

const NewJobForm = props => {
  const {
    jobTitleField,
    fromTemplateIdField,
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    onCancel,
    isValid,
    isSubmitting,
    setFieldValue
  } = props;
  values.fromTemplateIdField = fromTemplateIdField;
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="jobTitleField"
        className="input"
        type="text"
        helpText="customize your job title"
        error={touched.durationOfJobField && errors.durationOfJobField}
        value={values.durationOfJobField}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.jobTitleField || jobTitleField}
      />
      <input
        id="fromTemplateIdField"
        className="input is-invisible"
        type="hidden"
        value={values.fromTemplateIdField || fromTemplateIdField}
      />
      <input
        id="addressTextField"
        className="input is-invisible"
        type="hidden"
        value={values.addressTextField || ''}
      />
      <input
        id="locationField"
        className="input is-invisible"
        type="hidden"
        value={values.locationField || ''}
      />
      <GeoAddressInput
        id="geoInputField"
        type="text"
        helpText={'You must select an address from the drop down menu'}
        label="Job Address"
        placeholder="specify your job address"
        error={touched.addressTextField && errors.addressTextField}
        onError={e => {
          errors.addressTextField = 'google api error ' + e;
        }}
        onChangeEvent={e => {
          setFieldValue('addressTextField', e, true);
          console.log('value changed ' + e);
        }}
        onBlurEvent={e => {
          if (e && e.target) {
            e.target.id = 'addressTextField';
            handleBlur(e);
          }
        }}
        handleSelect={address => {
          setFieldValue('addressTextField', address, true);
          geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
              setFieldValue('locationField', latLng, false);
              console.log('Success', latLng);
            })
            .catch(error => {
              errors.addressTextField = 'error getting lat lng ' + error;
              console.error('Error', error);
            });
        }}
      />

      <input
        id="dateField"
        className="input is-invisible"
        type="hidden"
        value={values.dateField || moment().toDate()}
      />
      <DateInput
        id="DateInputField"
        type="text"
        helpText="click to change date"
        label="Job Start Date"
        placeholder="specify starting date"
        onChangeEvent={e => {
          if (e && e instanceof moment) {
            let val = e.toDate();
            setFieldValue('dateField', val, false);
          } else {
            e.preventDefault();
          }
        }}
      />

      <input
        id="hoursField"
        className="input is-invisible"
        type="hidden"
        value={values.hoursField || 1}
      />
      <input
        id="minutesField"
        className="input is-invisible"
        type="hidden"
        value={values.minutesField || 0}
      />
      <input
        id="periodField"
        className="input is-invisible"
        type="hidden"
        value={values.periodField || 'AM'}
      />
      <TimeInput
        hoursFieldId="hoursField"
        minutesFieldId="minutesField"
        periodFieldId="periodField"
        type="text"
        label="Starting time Details"
        placeholder="select Starting time"
        error={touched.startTime && errors.startTime}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="durationOfJobField"
        type="text"
        helpText="for example : 1 hour , 1 week ...etc"
        label="Job Duration"
        error={touched.durationOfJobField && errors.durationOfJobField}
        value={values.durationOfJobField}
        onChange={handleChange}
        onBlur={handleBlur}
        iconLeft="far fa-clock"
      />

      <TextAreaInput
        id="detailedDescriptionField"
        type="text"
        label="Detailed Description"
        placeholder="Sample: Hey I am handy with tools and can do everything... "
        error={
          touched.detailedDescriptionField && errors.detailedDescriptionField
        }
        value={values.detailedDescriptionField}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="field">
        <button
          style={{ marginRight: 6 }}
          className="button is-primary is-medium"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Submit
        </button>
        <button
          className="button is-outlined is-medium"
          disabled={isSubmitting}
          onClick={e => {
            e.preventDefault();
            onCancel(e);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
NewJobForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
export default EnhancedForms(NewJobForm);
