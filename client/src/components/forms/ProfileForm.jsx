import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';
import {
  TextInput,
  TextAreaInput,
} from './FormsHelpers';
import {
  enforceNumericField,
  alphanumericField,
} from './FormsValidators';


const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    displayName: Yup.string()
      .ensure()
      .trim()
      .min(3, 'your name is longer than that. Must be at least 3 chars')
      .max(25, 'your name is longer 25. Must be at most 25 chars')
      .test('alphanumericField','Name can only contain alphabits and numbers',(v)=>{return alphanumericField(v)})
      .required('First name is required.'),
    phoneNumber: Yup.number().positive(
      'your phone number can only be of format 61312345678'
    ),
    personalParagraph: Yup.string()
    .max(255,
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
  mapPropsToValues: ({ userDetails }) => {
    const { displayName, personalParagraph, phoneNumber } = userDetails;

    return {
      displayName: displayName,
      phoneNumber: phoneNumber,
      personalParagraph: personalParagraph
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'ProfileForm'
});

const ProfileForm = props => {
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
    isSubmitting
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="displayName"
        type="text"
        label="User Name"
        placeholder="Enter your name..."
        error={touched.displayName && errors.displayName}
        value={values.displayName || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="phoneNumber"
        type="text"
        label="Phone Number"
        placeholder="Enter Your Phone Number"
        helpText="example : 61312345678"
        error={touched.phoneNumber && errors.phoneNumber}
        value={values.phoneNumber}
        onChange={(e)=>{
          //run normalizer to get rid of alpha chars
          const normalizedVal = enforceNumericField(e.target.value);
          e.target.value= normalizedVal;
          handleChange(e);}}
        onBlur={handleBlur}
      />
      <TextAreaInput
        id="personalParagraph"
        type="text"
        label="About Me"
        placeholder="Sample: Hey I am handy with tools and can do everything... "
        error={touched.personalParagraph && errors.personalParagraph}
        value={values.personalParagraph}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="field">
        <button
          className="button is-primary"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Submit
        </button>
      </div>
      <div className="field">
        <button
          className="button is-text"
          type="submit"
          disabled={isSubmitting}
          onClick={e => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EnhancedForms(ProfileForm);
