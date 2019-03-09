import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput, TextAreaInput } from './FormsHelpers';
import { alphanumericField, phoneNumber } from './FormsValidators';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    displayName: Yup.string()
      .ensure()
      .trim()
      .min(3, 'your name is longer than that. Must be at least 3 chars')
      .max(25, 'your name is longer 25. Must be at most 25 chars')
      .test('alphanumericField', 'Name can only contain alphabits and numbers', (inputText) => {
        return alphanumericField(inputText);
      })
      .required('First name is required.'),
    email: Yup.string()
      .ensure()
      .trim()
      .email('please enter a valid email address')
      .required('email is required.'),
    phoneNumber: Yup.string()
      .ensure()
      .trim()
      .test('phoneNumber', 'invalid format. an example would be 9053334444', (inputText) => {
        return phoneNumber(inputText);
      }),
    personalParagraph: Yup.string().max(255, 'Maximum length allowed is 255 charachters'),
  }),
  mapPropsToValues: ({ userDetails }) => {
    const { autoDetectlocation, displayName, personalParagraph, phone, email } = userDetails;

    return {
      displayName: displayName,
      phoneNumber: phone.phoneNumber,
      email: email.emailAddress,
      personalParagraph: personalParagraph,
      autoDetectlocation,
    };
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit({
      displayName: values.displayName,
      email: { emailAddress: values.email },
      phone: { phoneNumber: values.phoneNumber },
      personalParagraph: values.personalParagraph,
      autoDetectlocation: values.autoDetectlocation,
    });
  },
  displayName: 'ProfileForm',
});

const ProfileForm = (props) => {
  const {
    values,
    touched,
    errors,
    // dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    onCancel,
    isValid,
    isSubmitting,
  } = props;

  const toggleIsAutoDetectEnabled = (val) => {
    if (val && navigator && navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 10000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      const errorHandling = (err) => {
        console.error('BidOrBoo Could Not Auto Detect Address ' + err);
      };
      const successfulRetrieval = () => {};

      //get the current location
      navigator.geolocation.getCurrentPosition(
        successfulRetrieval,
        errorHandling,
        getCurrentPositionOptions,
      );
    }
  };

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
      <div className="field">
        <div className="control">
          <label className="label">Auto Detect Location</label>
          <label className="checkbox">
            <input
              id="autoDetectlocation"
              onChange={(e) => {
                handleChange(e);
                toggleIsAutoDetectEnabled(e.target.checked);
              }}
              type="checkbox"
              name="autoDetectlocation"
              checked={values.autoDetectlocation}
            />

            <span>{` Enable Auto detect`} </span>
            <span className="has-text-grey has-text-weight-normal">
              <span className="icon">
                <i className="fas fa-globe-americas" />
              </span>
            </span>
          </label>
        </div>
      </div>
      <TextInput
        id="email"
        type="text"
        label="Email"
        placeholder="Enter your email..."
        error={touched.email && errors.email}
        value={values.email || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <TextInput
        id="phoneNumber"
        type="text"
        label="Phone Number"
        placeholder="Enter Your Phone Number"
        helpText="Must Follow This format : 9053334444"
        error={touched.phoneNumber && errors.phoneNumber}
        value={values.phoneNumber}
        onChange={handleChange}
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

      <div className="field is-grouped">
        <div className="control">
          <button
            style={{ marginRight: 6 }}
            className="button is-success"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Submit
          </button>
        </div>

        <div className="control">
          <button
            className="button is-outlined"
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              onCancel(e);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EnhancedForms(ProfileForm);
