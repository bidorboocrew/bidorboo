import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { TextInput } from '../components/forms/FormsHelpers';

import { phoneNumber } from '../components/forms/FormsValidators';
import * as ROUTES from '../constants/frontend-route-consts';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    phone_number: Yup.string()
      .ensure()
      .trim()
      .test('phone_number', 'invalid format. an example would be 9053334444', (inputText) => {
        return phoneNumber(inputText);
      }),
  }),
  mapPropsToValues: ({ userDetails }) => {
    const { displayName, phone, email } = userDetails;

    return {
      first_name: displayName,
      phone_number: phone.phoneNumber,
      email: email.emailAddress,
    };
  },
  handleSubmit: async (values, { setSubmitting, props }) => {
    const {
      token: tokenizedBankAccount,
      error: tokenizedBankAccountError,
    } = await window.BidorBoo.stripe.createToken('bank_account', {
      country: 'US',
      currency: 'usd',
      routing_number: '110000000',
      account_number: '000123456789',
      account_holder_name: 'Jenny Rosen',
      account_holder_type: 'individual',
    });
    if (tokenizedBankAccountError) {
      alert(tokenizedBankAccountError);
      setSubmitting(false);
      return;
    }

    const {
      token: tokenizePii,
      error: tokenizePiiError,
    } = await window.BidorBoo.stripe.createToken('pii', { personal_id_number: '000000000' });

    if (tokenizePiiError) {
      alert(tokenizePiiError);
      setSubmitting(false);
      return;
    }

    const {
      idFrontImg,
      idBackImg,
      dob_day,
      dob_month,
      dob_year,
      first_name,
      last_name,
      address_street,
      address_city,
      address_province,
      address_postalcode,
      phone_number,
    } = values;

    let frontSideResp;
    let backSideResp;

    if (idFrontImg) {
      const file = idFrontImg;
      let fileData = new FormData();
      fileData.append('file', file, file.name);
      fileData.append('purpose', 'identity_document');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer pk_test_PMfMPvRIAobaK1YXvpth2mEj',
        },
      };

      try {
        frontSideResp = await axios.post(`https://files.stripe.com/v1/files`, fileData, config);
      } catch (e) {
        alert('Error processing id img' + e);
        setSubmitting(false);
      }
    }

    if (idBackImg) {
      const { idBackImg } = values;

      const file = idBackImg;

      let fileData = new FormData();
      fileData.append('file', file, file.name);
      fileData.append('purpose', 'identity_document');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer pk_test_PMfMPvRIAobaK1YXvpth2mEj',
        },
      };
      try {
        backSideResp = await axios.post(`https://files.stripe.com/v1/files`, fileData, config);
      } catch (e) {
        alert('Error processing id img' + e);
        setSubmitting(false);
      }
    }
    setSubmitting(false);

    try {
      const connectedAccountDetails = {
        external_account: tokenizedBankAccount.id,
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: tokenizedBankAccount.client_ip,
        },
        legal_entity: {
          first_name,
          last_name,
          phone_number,
          personal_id_number: tokenizePii.id,
          type: 'individual',
          verification: {
            document: frontSideResp.data.id,
            document_back: backSideResp.data.id,
          },
          address: {
            city: address_city,
            line1: address_street,
            postal_code: address_postalcode,
            state: address_province,
          },
          dob: {
            day: dob_day,
            month: dob_month,
            year: dob_year,
          },
        },
      };
      const accountSetup = await axios.put(`${ROUTES.API.PAYMENT.PUT.setupPaymentDetails}`, {
        data: {
          connectedAccountDetails,
        },
      });
    } catch (e) {
      let msg =
        e.response.data && e.response.data.errorMsg
          ? 'msg ' + e.response.data.errorMsg.message + ' param: ' + e.response.data.errorMsg.param
          : 'failed To Create Account please email us at bidorboocrew@gmail.com';
      alert(msg);
      alert(JSON.stringify(e.errorMsg || e));
      setSubmitting(false);
      console.error(e);
    }

    // props.onSubmit(values);

    // stripe.createToken('bank_account', bankAccountData);
  },
  displayName: 'PaymentSetupForm',
});

const PaymentSetupForm = (props) => {
  const {
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    onCancel,
    isValid,
    setFieldValue,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="field is-grouped">
        <input
          id="account_holder_type"
          className="input is-invisible"
          type="hidden"
          value={'individual'}
        />

        <TextInput
          id="first_name"
          type="text"
          label="First Name"
          placeholder="first name"
          error={touched.first_name && errors.first_name}
          value={values.first_name || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextInput
          id="last_name"
          type="text"
          label="Last Name"
          placeholder="Last name"
          error={touched.last_name && errors.last_name}
          value={values.last_name || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div style={{ marginTop: -20 }} className="help">
        * Provide your name as it appears on your legal document such as your: Passport,
        government-issued ID, or driver's license
      </div>
      <br />
      <div className="field is-grouped">
        <TextInput
          id="dob_day"
          type="text"
          label="Birth Day"
          error={touched.dob_day && errors.dob_day}
          value={values.dob_day || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextInput
          id="dob_month"
          type="text"
          label="month"
          error={touched.dob_month && errors.dob_month}
          value={values.dob_month || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="dob_year"
          type="text"
          label="Year"
          error={touched.dob_year && errors.dob_year}
          value={values.dob_year || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div style={{ marginTop: -20 }} className="help">
        * Provide your name as it appears on your legal document such as your: Passport,
        government-issued ID, or driver's license
      </div>

      <br />
      <div className="field is-grouped">
        <TextInput
          id="address_street"
          type="text"
          label="Street Address"
          placeholder="Street Address"
          error={touched.address_street && errors.address_street}
          value={values.address_street || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="address_city"
          type="text"
          label="City"
          placeholder="City you reside in"
          error={touched.address_city && errors.address_city}
          value={values.address_city || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div className="field is-grouped">
        <TextInput
          id="address_postalcode"
          type="text"
          label="Postal Code"
          placeholder=""
          error={touched.address_postalcode && errors.address_postalcode}
          value={values.address_postalcode || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="address_province"
          type="text"
          label="Province"
          placeholder="Province"
          error={touched.address_province && errors.address_province}
          value={values.address_province || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div style={{ marginTop: -20 }} className="help">
        * Provide your address as it shows on your legal document such as Passport,
        government-issued ID, or driver's license
      </div>
      <br />
      <div className="field  is-grouped">
        <TextInput
          id="bank_name"
          type="text"
          label="Bank Name"
          placeholder="Bank Name"
          error={touched.bank_name && errors.bank_name}
          value={values.bank_name || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="field is-grouped">
        <TextInput
          id="transit_number"
          type="text"
          label="Transit Number"
          placeholder="Transit number"
          error={touched.transit_number && errors.transit_number}
          value={values.transit_number || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="institution_number"
          type="text"
          label="Institution Number"
          placeholder="Institution Number"
          error={touched.institution_number && errors.institution_number}
          value={values.institution_number || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextInput
          id="account_number"
          type="text"
          label="Account Number"
          placeholder="bank account number"
          error={touched.account_number && errors.account_number}
          value={values.account_number || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div className="field is-grouped">
        <TextInput
          id="personal_id_number"
          type="text"
          label="Social Insurance Number"
          placeholder="SIN number"
          error={touched.personal_id_number && errors.personal_id_number}
          value={values.personal_id_number || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          helpText={
            <React.Fragment>
              * This is required by law in accordance with
              <a href="https://stripe.com/ca" target="_blank">
                {` Stripe payment gateway.`}
              </a>
              This will be encrypted and secured.
              <br />
              {` BidOrBoo will NOT store or share this info.`}
            </React.Fragment>
          }
        />
      </div>
      <div className="field is-grouped">
        <TextInput
          id="phone_number"
          type="text"
          label="Phone Number"
          error={touched.phone_number && errors.phone_number}
          value={values.phone_number || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <input id="idFrontImg" className="input is-invisible" type="hidden" />
      <label className="label">Upload ID scan or image:</label>
      <Dropzone
        className="file is-boxed"
        onDrop={(files) => {
          setFieldValue('idFrontImg', files[0], false);
        }}
        accept={['image/png', 'image/jpeg']}
      >
        <label className="file-label">
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload" />
            </span>
            <span className="file-label">ID Image (front side)</span>
          </span>
          <span style={{ maxWidth: 'none' }} className="file-name has-text-centered">
            {(values.idFrontImg && values.idFrontImg.name) || 'upload now'}
          </span>
        </label>
      </Dropzone>
      <br />
      <input id="idBackImg" className="input is-invisible" type="hidden" />
      <Dropzone
        className="file is-boxed"
        onDrop={(files) => {
          setFieldValue('idBackImg', files[0], false);
        }}
        accept={['image/png', 'image/jpeg']}
      >
        <label className="file-label">
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload" />
            </span>
            <span className="file-label">ID Image (back side)</span>
          </span>
          <span style={{ maxWidth: 'none' }} className="file-name has-text-centered">
            {(values.idBackImg && values.idBackImg.name) || 'upload now'}
          </span>
        </label>
      </Dropzone>
      <div className="help">
        {`* Accepted IDs: Passport, government-issued ID, or driver's license. `}
      </div>
      <div className="help">{`* Must be .JPEG or .PNG les than 5MB`}</div>

      <br />
      <label className="label">Agreement and Terms</label>
      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input type="checkbox" />
            {` I have read and agree to`}
            <a target="_blank" rel="noopener noreferrer" href="bidorbooserviceAgreement">
              <strong> {` BidOrBoo Service Agreement `}</strong>
            </a>
            and the
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://stripe.com/connect-account/legal"
            >
              <strong>{` Stripe Connected Account Agreement`}</strong>
            </a>
            .
          </label>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            style={{ marginRight: 6 }}
            className="button is-success is-medium"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Submit
          </button>
        </div>

        <div className="control">
          <button
            className="button is-outlined is-medium"
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

export default EnhancedForms(PaymentSetupForm);
