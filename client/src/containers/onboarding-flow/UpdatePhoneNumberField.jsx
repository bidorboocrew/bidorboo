import React from 'react';

import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../components/forms/FormsHelpers';
import { phoneNumber } from '../../components/forms/FormsValidators';

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
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;

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

      <button style={{ borderRadius: 0 }} className="button is-success" type="submit">
        {`Save Phone Number`}
      </button>
    </form>
  );
};

export default EnhancedForms(UpdatePhoneNumberField);
