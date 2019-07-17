import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

import Dropzone from 'react-dropzone';
import moment from 'moment';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { TextInput } from './FormsHelpers';

import { phoneNumber } from './FormsValidators';
import * as ROUTES from '../../constants/frontend-route-consts';
import { Spinner } from '../../components/Spinner';

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    phone_number: Yup.string()
      .ensure()
      .trim()
      .test('phone_number', 'invalid format. an example would be 9053334444', (inputText) => {
        return phoneNumber(inputText);
      }),
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
      phone_number: phone.phoneNumber,
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
      last_name,
      address_street,
      address_city,
      address_province,
      address_postalcode,
      phone_number,
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

    const {
      token: tokenizedBankAccount,
      error: tokenizedBankAccountError,
    } = await window.BidorBoo.stripe.createToken('bank_account', {
      country: 'CA',
      currency: 'cad',
      account_holder_type: 'individual',
      routing_number: `${transit_number}-${institution_number}`,
      account_number,
      account_holder_name: account_holder_full_name,
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
          phone: phone_number,
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
    onCancel,
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
        <div style={{ minHeight: 'unset', height: 'unset' }} className="card  limitLargeMaxWidth">
          <div style={{ minHeight: 'unset', height: 'unset' }} className="card-content">
            <HeaderTitle title="Setup My Payout Banking Details" />
            <div className="card-content">
              <label className="label">BASIC INFO</label>
              <div className="field is-grouped">
                <input
                  id="account_holder_type"
                  className="input is-invisible"
                  type="hidden"
                  value={'individual'}
                />
                <div style={{ marginRight: 10 }}>
                  <TextInput
                    labelClassName=" "
                    id="first_name"
                    type="text"
                    label="First Name"
                    error={touched.first_name && errors.first_name}
                    value={values.first_name || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div style={{ marginRight: 10 }}>
                  <TextInput
                    labelClassName=" "
                    id="last_name"
                    type="text"
                    label="Last Name"
                    error={touched.last_name && errors.last_name}
                    value={values.last_name || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <TextInput
                id="phone_number"
                type="text"
                labelClassName=" "
                label="Phone Number"
                error={touched.phone_number && errors.phone_number}
                value={values.phone_number || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <label className="label">Date of birth</label>
              <div className="field is-grouped">
                <div style={{ marginRight: 10 }} className="field">
                  <div className="control">
                    <div
                      className={`select ${touched.dob_day && errors.dob_day ? 'is-danger' : ''}`}
                    >
                      <select
                        error={touched.dob_day && errors.dob_day}
                        value={values.dob_day || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id="dob_day"
                      >
                        <option>Day</option>
                        {(() => {
                          const dayOptions = [];
                          for (let i = 1; i <= 31; i++) {
                            dayOptions.push(
                              <option key={`day-${i}`} value={i}>
                                {i}
                              </option>,
                            );
                          }
                          return dayOptions;
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ marginRight: 10 }} className="field">
                  <div className="control">
                    <div
                      className={`select ${
                        touched.dob_month && errors.dob_month ? 'is-danger' : ''
                      }`}
                    >
                      <select
                        error={touched.dob_month && errors.dob_month}
                        value={values.dob_month || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id="dob_month"
                      >
                        <option>Month</option>
                        {(() => {
                          return (
                            <React.Fragment>
                              <option value={1}>Jan</option>
                              <option value={2}>Feb</option>
                              <option value={3}>Mar</option>
                              <option value={4}>Apr</option>
                              <option value={5}>May</option>
                              <option value={6}>Jun</option>
                              <option value={7}>Jul</option>
                              <option value={8}>Aug</option>
                              <option value={9}>Sep</option>
                              <option value={10}>Oct</option>
                              <option value={11}>Nov</option>
                              <option value={12}>Dec</option>
                            </React.Fragment>
                          );
                        })()}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ marginRight: 10 }} className="field">
                  <div className="control">
                    <div
                      className={`select ${touched.dob_year && errors.dob_year ? 'is-danger' : ''}`}
                    >
                      <select
                        error={touched.dob_year && errors.dob_year}
                        value={values.dob_year || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id="dob_year"
                      >
                        <option>Year</option>
                        {(() => {
                          const yearOptions = [];
                          const maxIs15YearsAgo = moment().subtract(15, 'year');
                          const minIs60YearsAgo = moment().subtract(70, 'year');

                          for (let i = maxIs15YearsAgo.year(); i >= minIs60YearsAgo.year(); i--) {
                            yearOptions.push(
                              <option key={`year-${i}`} value={i}>
                                {i}
                              </option>,
                            );
                          }
                          return yearOptions;
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <label className="label">PAYOUT BANK DETAILS</label>
              <div className="field">
                <TextInput
                  labelClassName=" "
                  id="account_holder_full_name"
                  type="text"
                  label="Full Name"
                  error={touched.account_holder_full_name && errors.account_holder_full_name}
                  value={values.account_holder_full_name || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div style={{ marginTop: '-0.75rem' }} className="help">
                  * The full name associated with this bank account as it appears on the bank
                  statement
                </div>
              </div>
              <div className="field">
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
                <div style={{ marginTop: '-0.75rem' }} className="help">
                  * examples : Royal Bank of Canada (RBC), Toronto-Dominion Bank (TD),Bank of
                  Montreal (BMO) , Bank of Nova Scotia (Scotiabank),Canadian Imperial Bank of
                  Commerce (CIBC) ..,etc
                </div>
              </div>
              <div className="field is-grouped">
                <div style={{ marginRight: 10 }}>
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

                <div style={{ marginRight: 10 }}>
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
                <div style={{ marginRight: 10 }}>
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
              <div className="field" />
              <label className="label">ADDRESS DETAILS</label>
              <div className="field is-grouped">
                <div style={{ marginRight: 10 }}>
                  <TextInput
                    labelClassName=" "
                    id="address_street"
                    type="text"
                    label="Street Address"
                    error={touched.address_street && errors.address_street}
                    value={values.address_street || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div style={{ marginRight: 10 }}>
                  <TextInput
                    labelClassName=" "
                    id="address_city"
                    type="text"
                    label="City"
                    error={touched.address_city && errors.address_city}
                    value={values.address_city || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div className="field is-grouped">
                <div style={{ marginRight: 10 }}>
                  <TextInput
                    labelClassName=" "
                    id="address_postalcode"
                    type="text"
                    label="Postal Code"
                    error={touched.address_postalcode && errors.address_postalcode}
                    value={values.address_postalcode || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div style={{ marginRight: 10 }} className="field">
                  <label>Select Province</label>
                  <div className="control">
                    <div
                      className={`select ${
                        touched.address_province && errors.address_province ? 'is-danger' : ''
                      }`}
                    >
                      <select
                        error={touched.address_province && errors.address_province}
                        value={values.address_province || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id="address_province"
                      >
                        <option>Province</option>
                        {(() => {
                          return [
                            'AB',
                            'BC',
                            'MB',
                            'NB',
                            'NL',
                            'NS',
                            'NT',
                            'NU',
                            'ON',
                            'PE',
                            'QC',
                            'SK',
                            'YT',
                          ].map((province) => (
                            <option key={`province-${province}`} value={province}>
                              {province}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <input id="idFrontImg" className="input is-invisible" type="hidden" />
              <label className="label">GOVERMENT ISSUED ID</label>
              <Dropzone
                className="file is-boxed idVerification"
                onDrop={(files) => {
                  setFieldValue('idFrontImg', files[0], true);
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
                className="file is-boxed idVerification"
                onDrop={(files) => {
                  setFieldValue('idBackImg', files[0], true);
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
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input style={{ marginRight: 4 }} type="checkbox" />
                    {`  I have read and agree to`}
                    <a target="_blank" rel="noopener noreferrer" href={`${ROUTES.CLIENT.TOS}`}>
                      <strong>{` BidOrBoo Service Agreement `}</strong>
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
                    className={`button is-success is-medium  ${isSubmitting ? 'is-loading' : ''}`}
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
              <div className="help">
                * To speed up verification and avoid delays in payout please
                <strong> enter all your details accurately</strong>
              </div>
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
      {title}
    </h2>
  );
};
