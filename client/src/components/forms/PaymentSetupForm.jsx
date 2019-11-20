import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

import Dropzone from 'react-dropzone';
import moment from 'moment';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { TextInput } from './FormsHelpers';

import * as ROUTES from '../../constants/frontend-route-consts';
import { Spinner } from '../../components/Spinner';
import { onLogout } from './../../app-state/actions/authActions';
const MAX_FILE_SIZE_IN_MB = 1000000 * 10; //10MB
const NO_SELECTION = 'NO_SELECTION';
const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    // phone_number: Yup.string()
    //   .ensure()
    //   .trim()
    //   .test('phone_number', 'invalid format. an example would be 9053334444', (inputText) => {
    //     return phoneNumber(inputText);
    //   }),
    bank_name: Yup.string()
      .ensure()
      .trim()
      .required('*Bank Name is required'),
    transit_number: Yup.string()
      .ensure()
      .trim()
      .required('*Transit Number is required'),
    institution_number: Yup.string()
      .ensure()
      .trim()
      .required('*Institution number is required'),
    account_number: Yup.string()
      .ensure()
      .trim()
      .required('*Account Number is required'),
    dob_day: Yup.number().required('*Day of Birth is required'),
    dob_month: Yup.number().required('*Month Of Birth  is required'),
    dob_year: Yup.number().required('*Year Of Birth is required'),
    first_name: Yup.string()
      .ensure()
      .trim()
      .required('*First Name is required'),
    last_name: Yup.string()
      .ensure()
      .trim()
      .required('*Last Name is required'),
    address_street: Yup.string()
      .ensure()
      .trim()
      .required('*Address Street is required'),
    address_city: Yup.string()
      .ensure()
      .trim()
      .required('*Address City is required'),
    address_province: Yup.string()
      .ensure()
      .trim()
      .required('*Address Province is required'),
    address_postalcode: Yup.string()
      .ensure()
      .trim()
      .required('*Postal Code is required'),
  }),
  mapPropsToValues: ({ userDetails }) => {
    const { phone, email } = userDetails;

    return {
      // phone_number: phone.phoneNumber,
      email: email.emailAddress,
    };
  },
  handleSubmit: async (values, { setSubmitting, props }) => {
    const {
      idFrontImg,
      idBackImg,
      dob_day,
      dob_month,
      dob_year,
      first_name,
      initial_name,
      last_name,
      address_street,
      address_city,
      address_province,
      address_postalcode,
      // phone_number,
      account_holder_full_name,
      account_number,
      institution_number,
      transit_number,
    } = values;
    //xxx working example
    // const {
    //   token: tokenizedBankAccount,
    //   error: tokenizedBankAccountError,
    // } = await window.BidorBoo.stripe.createToken('bank_account', {
    //   country: 'CA',
    //   currency: 'cad',
    //   routing_number: '11000-000',
    //   account_number: '000123456789',
    //   account_holder_name: `${props.userDetails.displayName}`,
    //   account_holder_type: 'individual',
    // });
    // if (tokenizedBankAccountError) {
    //   alert(tokenizedBankAccountError);
    //   setSubmitting(false);
    //   return;
    // }

    const { token: tokenizedBankAccount, error: tokenizedBankAccountError } = await window
      .Stripe(`${process.env.REACT_APP_STRIPE_KEY}`)
      .createToken('bank_account', {
        country: 'CA',
        currency: 'cad',
        account_holder_type: 'individual',
        routing_number: `${transit_number}-${institution_number}`,
        account_number,
        account_holder_name: first_name + ' ' + initial_name + ' ' + last_name,
      });
    if (tokenizedBankAccountError) {
      alert(JSON.stringify(tokenizedBankAccountError));
      setSubmitting(false);
      return;
    }
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
          Authorization: `Bearer ${process.env.REACT_APP_STRIPE_KEY}`,
        },
      };

      try {
        frontSideResp = await axios.post(`https://files.stripe.com/v1/files`, fileData, config);
      } catch (e) {
        alert('Error processing id img' + JSON.stringify(e));
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
          Authorization: `Bearer ${process.env.REACT_APP_STRIPE_KEY}`,
        },
      };
      try {
        backSideResp = await axios.post(`https://files.stripe.com/v1/files`, fileData, config);
      } catch (e) {
        alert('Error processing id img' + JSON.stringify(e));
        setSubmitting(false);
      }
    }

    try {
      const connectedAccountDetails = {
        external_account: tokenizedBankAccount.id,
        tos_acceptance: {
          date: Math.round(new Date().getTime() / 1000),
          ip: tokenizedBankAccount.client_ip,
        },
        // business_type: 'individual',
        individual: {
          first_name,
          last_name,
          // phone: phone_number,
          verification: {
            document: {
              front: frontSideResp.data.id,
              back: backSideResp.data.id,
            },
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
      await axios.put(`${ROUTES.API.PAYMENT.PUT.setupPaymentDetails}`, {
        data: {
          connectedAccountDetails,
          last4BankAcc: tokenizedBankAccount.bank_account.last4,
        },
      });
      // xxxx update without reload
      window.location.reload();
    } catch (e) {
      let msg = 'failed To Create Account please email us at bidorboocrew@bidorboo.com';
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.errorMsg &&
        e.response.data.errorMsg.message
      ) {
        msg = e.response.data.errorMsg.message;
      }
      alert(msg);
      setSubmitting(false);
      console.error(e);
    }
    setSubmitting(false);
  },
  displayName: 'PaymentSetupForm',
});

const PaymentSetupForm = (props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    setFieldValue,
    isSubmitting,
  } = props;

  let errorsList = null;
  if (errors && Object.keys(errors).length > 0) {
    errorsList = Object.keys(errors).map((errorKey, index) => {
      return (
        touched[`${errorKey}`] && (
          <p key={index} className="help has-text-danger is-danger">
            {errors[`${errorKey}`]}
          </p>
        )
      );
    });
  }
  let provinceSelect = '';
  let isTouched = touched && touched.address_province;
  if (isTouched) {
    provinceSelect = values.address_province === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
  }

  return (
    <React.Fragment>
      {isSubmitting &&
        ReactDOM.createPortal(
          <div
            style={{
              background: '#363636',
              zIndex: 99,
              padding: 50,
              position: 'fixed',
              height: '100vh',
              top: '4rem',
              right: 0,
              width: '100%',
            }}
          >
            <div className="container is-widescreen">
              <Spinner
                renderLabel={'Setting up your Payout banking Account'}
                isLoading={true}
                size={'large'}
                isDark={false}
              />
            </div>
          </div>,
          document.querySelector('#bidorboo-root-view'),
        )}
      <form onSubmit={handleSubmit}>
        <div
          style={{ minHeight: 'unset', height: 'unset' }}
          className="card cardWithButton nofixedwidth"
        >
          <div style={{ minHeight: 'unset', height: 'unset' }} className="card-content">
            <HeaderTitle title="Payout bank details" />

            <div>Add your preferred payout bank</div>
            <div className="help">
              * After completing the tasks, payments will be sent to this bank
            </div>
            <div className="help">
              * Your data is kept private, encrypted and secured via
              <a href="https://stripe.com/ca" target="_blank">
                {` Stripe `}
              </a>
            </div>
            <br></br>
            {errorsList}
            <div>
              <div style={{ borderBottom: '1px solid #353535' }} className="subtitle">
                PAYOUT BANK DETAILS
              </div>

              <div style={{ maxWidth: 250 }}>
                <TextInput
                  labelClassName=" "
                  id="bank_name"
                  type="text"
                  label="Bank Name"
                  error={touched.bank_name && errors.bank_name}
                  value={values.bank_name || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ maxWidth: 250 }}>
                <TextInput
                  labelClassName=" "
                  id="transit_number"
                  type="text"
                  label="Transit Number"
                  error={touched.transit_number && errors.transit_number}
                  value={values.transit_number || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ maxWidth: 250 }}>
                <TextInput
                  labelClassName=" "
                  id="institution_number"
                  type="text"
                  label="Institution Number"
                  error={touched.institution_number && errors.institution_number}
                  value={values.institution_number || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div style={{ maxWidth: 250 }}>
                <TextInput
                  labelClassName=" "
                  id="account_number"
                  type="text"
                  label="Account Number"
                  error={touched.account_number && errors.account_number}
                  value={values.account_number || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <a
                style={{ marginTop: '-0.75rem' }}
                href="https://res.cloudinary.com/hr6bwgs1p/image/upload/v1560997452/cheque.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="help link has-text-link"
              >
                * click to view a sample cheque
              </a>

              <br />

              <button
                style={{ marginRight: 6 }}
                className={`button is-success firstButtonInCard is-medium  ${
                  isSubmitting ? 'is-loading' : ''
                }`}
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                Add Payout Bank
              </button>
              {/* <div className="help">
                * Provide your info as it appears on your legal document such as your: Passport,
                government-issued ID, or driver's license
              </div> */}
              {errorsList}
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default EnhancedForms(PaymentSetupForm);

const HeaderTitle = (props) => {
  const { title, specialMarginVal } = props;
  return (
    <h2
      style={{
        marginTop: specialMarginVal || 0,
        marginBottom: 4,
        fontSize: 20,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      {title} <br></br>
      <span className="has-text-grey is-size-6">(do this anytime)</span>
    </h2>
  );
};
