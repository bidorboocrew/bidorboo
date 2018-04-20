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
    debugger;
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'NewJobForm'
});

const NewJobForm = props => {
  const {
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
  return (
      <form onSubmit={handleSubmit}>
        <input
          id="addressField"
          className="input is-invisible"
          type="hidden"
          value={values.addressField || ''}
        />
        <input
          id="latLngField"
          className="input is-invisible"
          type="hidden"
          value={values.latLngField || ''}
        />
        <GeoAddressInput
          id="geoInputField"
          type="text"
          helpText={'You must select an address from the drop down menu'}
          label="Job Address"
          placeholder="specify your job address"
          error={touched.addressField && errors.addressField}
          onError={e => {
            errors.addressField = 'google api error ' + e;
            debugger
          }}
          onChangeEvent={e => {
            setFieldValue('addressField', e, true);
            console.log('value changed ' + e);
          }}
          onBlurEvent={e => {
            if (e && e.target) {
              e.target.id = 'addressField';
              handleBlur(e);
            }
          }}
          handleSelect={address => {
            setFieldValue('addressField', address, true);
            geocodeByAddress(address)
              .then(results => getLatLng(results[0]))
              .then(latLng => {
                debugger;
                setFieldValue('latLngField', latLng, false);
                 console.log('Success', latLng);
                })
              .catch(error => console.error('Error', error));
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
              setFieldValue('dateField', val, true);
            } else {
              e.target.id = 'dateField';
              handleChange(e);
            }
          }}
          onBlurEvent={e => {
            if (e && e.target) {
              e.target.id = 'dateField';
              handleBlur(e);
            }
          }}
        />

        <input
          id="hoursField"
          className="input is-invisible"
          type="hidden"
          value={values.hoursField}
        />
         <input
          id="minutesField"
          className="input is-invisible"
          type="hidden"
          value={values.minutesField || moment().toDate()}
        />
         <input
          id="periodField"
          className="input is-invisible"
          type="hidden"
          value={values.periodField}
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
          id="durationField"
          type="text"
          helpText="for example : 1 hour , 1 week ...etc"
          label="Job Duration"
          error={touched.durationField && errors.durationField}
          value={values.durationField}
          onChange={handleChange}
          onBlur={handleBlur}
          iconLeft="far fa-clock"
        />

        <TextAreaInput
          id="jobDetails"
          type="text"
          label="Detailed Description"
          placeholder="Sample: Hey I am handy with tools and can do everything... "
          error={touched.jobDetails && errors.jobDetails}
          value={values.jobDetails}
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
            type="submit"
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
