import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GeoAddressInput, TextAreaInput, DateInput } from './FormsHelpers';
import moment from 'moment';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    addressField: Yup.string()
      .ensure()
      .trim()
      .required('Please select an address from the drop down list'),
    DateField: Yup.date().min(moment(), 'Date selected can not be in the past'),
    jobDetails: Yup.string().max(
      255,
      'Maximum length allowed is 255 charachters'
    )
  }),
  validate: (values, props) => {
    //additional validation
    const errors = {};

    return errors;
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    debugger;
    // props.onSubmit(values);
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
    title,
    imageUrl,
    setFieldValue
  } = props;
  return (
    <React.Fragment>
      <h1 className="bdb-section-title title has-text-centered">{title}</h1>
      <div className="card-image">
        <figure className="image is-3by1">
          <img src={imageUrl} alt={title} />
        </figure>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          id="addressField"
          className="input is-invisible"
          type="hidden"
          value={values.addressField || ''}
        />
        <GeoAddressInput
          id="geoInputField"
          type="text"
          helpText={'You must select an address from the drop down menu'}
          label="Job Address"
          placeholder="specify your job address"
          error={touched.addressField && errors.addressField}
          onError={e => {
            errors.addressField = e;
            console.log('google api error ' + e);
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
              .then(latLng => console.log('Success', latLng))
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
          helpText="You must select an address from the drop down menu"
          label="Starting Date"
          placeholder="specify starting time"
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

        <TextAreaInput
          id="jobDetails"
          type="text"
          label="Job Details"
          placeholder="Sample: Hey I am handy with tools and can do everything... "
          error={touched.jobDetails && errors.jobDetails}
          value={values.jobDetails}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div className="field">
          <button
            style={{ marginRight: 6 }}
            className="button is-primary"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Submit
          </button>
          <button
            className="button is-outlined"
            type="submit"
            disabled={isSubmitting}
            onClick={e => {
              e.preventDefault();
              onCancel();
            }}
          >
            go back
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default EnhancedForms(NewJobForm);
