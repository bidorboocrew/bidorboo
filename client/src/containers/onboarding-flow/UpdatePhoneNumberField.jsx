import React from 'react';

import { withFormik } from 'formik';
import * as Yup from 'yup';
import { PhoneNumberInput } from '../../components/forms/FormsHelpers';
import { phoneNumber } from '../../components/forms/FormsValidators';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    phoneNumber: Yup.string()
      .ensure()
      .trim()
      .test(
        'phoneNumber',
        'invalid format. Must be a canadian number and follow This format : (613) 333-4444',
        (inputText) => {
          return phoneNumber(inputText);
        },
      ),
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
  const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = props;

  return (
    <form onSubmit={handleSubmit}>
      <PhoneNumberInput
        id="phoneNumber"
        defaultCountry="CA"
        country="CA"
        label="Enter Your Phone Number"
        placeholder="Enter phone number starting with area code"
        error={touched.phoneNumber && errors.phoneNumber}
        value={values.phoneNumber || ''}
        onChange={(val) => setFieldValue('phoneNumber', val)}
        onBlur={handleBlur}
        helpText="Must be a canadian number and follow This format : (613) 333-4444"
      />

      <button style={{ borderRadius: 0 }} className="button is-success" type="submit">
        {`Save Phone Number`}
      </button>
    </form>
  );
};

export default EnhancedForms(UpdatePhoneNumberField);
