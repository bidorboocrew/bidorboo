import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as A from '../../app-state/actionTypes';

import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput, TextAreaInput, PhoneNumberInput } from './FormsHelpers';
import { alphanumericField, phoneNumber } from './FormsValidators';

const MAX_PARAGRAPH_LENGTH = 255;
const MAX_NAME_LENGTH = 25;
const MIN_NAME_LENGTH = 3;

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    displayName: Yup.string()
      .ensure()
      .trim()
      .min(MIN_NAME_LENGTH, `must be at least ${MIN_NAME_LENGTH} characters long.`)
      .max(MAX_NAME_LENGTH, `can not be more than ${MAX_NAME_LENGTH} characters long`)
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
      .test(
        'phoneNumber',
        'Must be a canadian number and follow This format : (613) 333-4444',
        (inputText) => {
          return phoneNumber(inputText);
        },
      ),
    personalParagraph: Yup.string()
      .ensure()
      .trim()
      .max(MAX_PARAGRAPH_LENGTH, `can not be more than ${MAX_PARAGRAPH_LENGTH} characters long`),
  }),
  mapPropsToValues: ({ userDetails }) => {
    const { displayName, personalParagraph, phone, email } = userDetails;

    return {
      displayName: displayName,
      phoneNumber: phone.phoneNumber,
      email: email.emailAddress,
      personalParagraph: personalParagraph,
    };
  },

  handleSubmit: async (values, { setSubmitting, props }) => {
    const { idFrontImg, idBackImg } = values;
    let frontSideResp;
    let backSideResp;
    setSubmitting(true);
    JSON.stringify({ create: true });
    if (idFrontImg) {
      const fileFront = idFrontImg;
      let fileData = new FormData();
      fileData.append('file', fileFront, fileFront.name);
      fileData.append('purpose', 'customer_signature');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.REACT_APP_STRIPE_KEY}`,
        },
      };

      try {
        frontSideResp = await axios.post(`https://files.stripe.com/v1/files`, fileData, config);
      } catch (e) {
        props.dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Error processing id img' + e,
            },
          },
        });
        setSubmitting(false);
        return;
      }
    }

    if (idBackImg) {
      const fileBack = idBackImg;

      let fileData = new FormData();
      fileData.append('file', fileBack, fileBack.name);
      fileData.append('purpose', 'customer_signature');
      // fileData.append('file_link_data', JSON.stringify({ create: true }));

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.REACT_APP_STRIPE_KEY}`,
        },
      };
      try {
        backSideResp = await axios.post(`https://files.stripe.com/v1/files`, fileData, config);
      } catch (e) {
        props.dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Error processing id img' + e,
            },
          },
        });
        setSubmitting(false);
        return;
      }
    }

    let picId = {};

    if (frontSideResp && frontSideResp.data && frontSideResp.data.id) {
      picId.front = frontSideResp.data.id;
    }
    if (backSideResp && backSideResp.data && backSideResp.data.id) {
      picId.back = backSideResp.data.id;
    }
    if (picId.front && picId.back) {
      props.onSubmit({
        displayName: values.displayName,
        email: { emailAddress: values.email },
        phone: { phoneNumber: values.phoneNumber },
        personalParagraph: values.personalParagraph,
        picId,
      });
    } else {
      props.onSubmit({
        displayName: values.displayName,
        email: { emailAddress: values.email },
        phone: { phoneNumber: values.phoneNumber },
        personalParagraph: values.personalParagraph,
      });
    }
    setSubmitting(false);
  },
  displayName: 'ProfileForm',
});

const ProfileForm = (props) => {
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
    setFieldValue,
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
        id="email"
        type="text"
        label="Email"
        placeholder="Enter your email..."
        error={touched.email && errors.email}
        value={values.email || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
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
      <TextAreaInput
        id="personalParagraph"
        type="text"
        label="About Me"
        placeholder="Describe your best attributes and skills here, Promote yourself... "
        error={touched.personalParagraph && errors.personalParagraph}
        value={values.personalParagraph}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <br />
      <br />

      <div className="field is-grouped">
        <div className="control">
          <button
            className="button"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              onCancel(e);
            }}
          >
            Cancel
          </button>
        </div>
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
      </div>
    </form>
  );
};

export default connect(null, null)(EnhancedForms(ProfileForm));
