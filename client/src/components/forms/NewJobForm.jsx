import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';
// import Geosuggest from 'react-geosuggest';
// import { createGeoInput, DefaultGeoInput } from 'react-geoinput';
// import CustomGeoInput from './CustomGeoInput';
// const GeoInput = createGeoInput(CustomGeoInput);

import {
  TextInput,
  TextAreaInput,
  enforceNumericField,
  // requiredField,
  alphanumericField,
  // moreThan3LessThan25Chars,
  // renderFormTextField,
  // renderAddressFormField,
  // moreThan0lessThan250Chars
  // AddressField,
} from './FormsHelpers';
const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    displayName: Yup.string()
      .ensure()
      .trim()
      .min(3, 'your name is longer than that. Must be at least 3 chars')
      .max(25, 'your name is longer 25. Must be at most 25 chars')
      .test(
        'alphanumericField',
        'Name can only contain alphabits and numbers',
        v => {
          return alphanumericField(v);
        }
      )
      .required('First name is required.'),
    phoneNumber: Yup.number().positive(
      'your phone number can only be of format 61312345678'
    ),
    jobDetails: Yup.string().max(
      255,
      'Maximum length allowed is 255 charachters'
    )
  }),
  // validate: (values, props) => {
  //   //additional validation
  //   const errors = {};
  //   if(values){
  //     const {displayName,phoneNumber,personalParagraph} = values;
  //     if(phoneNumber){

  //     }
  //   }

  //   return errors;
  // },
  // mapPropsToValues: ({ job }) => {
  //   const { displayName, personalParagraph, phoneNumber } = userDetails;

  //   return {
  //     displayName: displayName,
  //     phoneNumber: phoneNumber,
  //     personalParagraph: personalParagraph
  //   };
  // },
  handleSubmit: (values, { setSubmitting, props }) => {
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
    // dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    // handleReset,
    onCancel,
    isValid,
    isSubmitting,
    title,
    imageUrl
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
    {(window.google && window.google.maps) ? (<div> GEO LOCAtion input</div>): (   <TextInput
          id="Manual Address"
          type="text"
          label="Enter Address"
          placeholder="Enter your Address..."
          error={touched.displayName && errors.displayName}
          value={values.displayName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />) }

        <TextInput
          id="phoneNumber"
          type="text"
          label="Phone Number"
          placeholder="Enter Your Phone Number"
          helpText="example : 61312345678"
          error={touched.phoneNumber && errors.phoneNumber}
          value={values.phoneNumber}
          onChange={e => {
            //run normalizer to get rid of alpha chars
            const normalizedVal = enforceNumericField(e.target.value);
            e.target.value = normalizedVal;
            handleChange(e);
          }}
          onBlur={handleBlur}
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
            style={{marginRight: 6}}
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
