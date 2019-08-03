import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput, TextAreaInput } from '../../components/forms/FormsHelpers';
import { alphanumericField, phoneNumber } from '../../components/forms/FormsValidators';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    phoneNumber: Yup.string()
      .ensure()
      .trim()
      .test('phoneNumber', 'invalid format. an example would be 9053334444', (inputText) => {
        return phoneNumber(inputText);
      }),
  }),
  mapPropsToValues: ({ userDetails }) => {
    const { phone } = userDetails;

    return {
      phoneNumber: phone.phoneNumber,
    };
  },
  handleSubmit: async (values, { setSubmitting, props }) => {
    setSubmitting(true);
    props.onSubmit({
      phone: { phoneNumber: values.phoneNumber },
    });
    props.showPhoneVerificationStep();
    setSubmitting(false);
  },
  displayName: 'UpdatePhoneNumberField',
});

const UpdatePhoneNumberField = (props) => {
  const {
    values,
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    onCancel,
    isValid,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="phoneNumber"
        type="tel"
        style={{ borderRadius: 0 }}
        label="Enter Your Phone Number"
        placeholder="Enter your phone number"
        helpText="Must Follow This format : 6133334444"
        error={touched.phoneNumber && errors.phoneNumber}
        value={values.phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button className="button is-success" type="submit">
        {`Save`}
      </button>
    </form>
  );
};

export default EnhancedForms(UpdatePhoneNumberField);
