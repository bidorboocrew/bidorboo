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
  const { values, touched, errors, handleBlur, handleSubmit, setFieldValue } = props;

  return (
    <form onSubmit={handleSubmit}>
      <PhoneNumberInput
        style={{ borderBottom: '2px solid #26ca70', maxWidth: 400 }}
        id="phoneNumber"
        defaultCountry="CA"
        country="CA"
        label="Enter Your Phone Number"
        placeholder="Enter phone number starting with area code"
        error={touched.phoneNumber && errors.phoneNumber}
        value={values.phoneNumber || ''}
        onChange={(val) => setFieldValue('phoneNumber', val, true)}
        onBlur={handleBlur}
        helpText={() => {
          return (
            <>
              <p className="help">
                Must be a canadian number and follow This format : (613) 333-4444
              </p>
              <p className="help">Taskers will contact you on this number</p>
            </>
          );
        }}
      />
      <button
        className="button is-success"
        type="submit"
        disabled={!values || !values.phoneNumber || values.phoneNumber.length < 12}
      >
        Save This Number
      </button>
      <p className="help"></p>
    </form>
  );
};

export default EnhancedForms(UpdatePhoneNumberField);
