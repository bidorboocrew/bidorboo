import React from 'react';
import { connect } from 'react-redux';
import * as A from '../../app-state/actionTypes';

import axios from 'axios';
import ReactDOM from 'react-dom';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { getBugsnagClient } from '../../index';
import { TextInput } from './FormsHelpers';

import * as ROUTES from '../../constants/frontend-route-consts';
import { Spinner } from '../../components/Spinner';
const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    full_name: Yup.string()
      .ensure()
      .trim()
      .required('*Your FULL Name as it appears on bank statement is required'),
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
  }),
  handleSubmit: async (values, { setSubmitting, props }) => {
    const { full_name, account_number, institution_number, transit_number } = values;

    const { token: tokenizedBankAccount, error: tokenizedBankAccountError } = await window
      .Stripe(
        `${
          process.env.NODE_ENV === 'production'
            ? process.env.REACT_APP_STRIPE_KEY
            : process.env.REACT_APP_STRIPE_KEY_TEST
        }`,
      )
      .createToken('bank_account', {
        country: 'CA',
        currency: 'cad',
        account_holder_type: 'individual',
        routing_number: `${transit_number}-${institution_number}`,
        account_number,
        account_holder_name: full_name,
      });
    if (tokenizedBankAccountError) {
      let issue = 'issue encountered, please use chat button in the footer if you need help';
      switch (tokenizedBankAccountError.code) {
        case 'account_number_invalid':
          issue = 'The bank account number provided is invalid (e.g., missing digits)';
          break;
        case 'bank_account_unusable':
          issue =
            'The bank account provided cannot be used for payouts. A different bank account must be used.';
          break;
        case 'routing_number_invalid':
          issue =
            'The bank routing number provided is invalid. Make sure to check institution # and transit #';

          break;
        default:
          break;
      }

      props.dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: issue,
          },
        },
      });
      setSubmitting(false);
      return;
    }

    try {
      const connectedAccountDetails = {
        external_account: tokenizedBankAccount.id,
        tos_acceptance: {
          date: Math.round(new Date().getTime() / 1000),
          ip: tokenizedBankAccount.client_ip,
        },
      };
      await axios.put(`${ROUTES.API.PAYMENT.PUT.setupPaymentDetails}`, {
        data: {
          connectedAccountDetails,
          last4BankAcc: tokenizedBankAccount.bank_account.last4,
        },
      });
      window.location.reload();
    } catch (e) {
      getBugsnagClient().leaveBreadcrumb('URGENT_failed To Create Account please');
      getBugsnagClient().notify(e);
      let msg = 'failed To Create Account please email us at bidorboo@bidorboo.ca';
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.errorMsg &&
        e.response.data.errorMsg.message
      ) {
        msg = e.response.data.errorMsg.message;
      }

      props.dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg,
          },
        },
      });
      setSubmitting(false);
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
                isLoading
                size={'large'}
                isDark={false}
              />
            </div>
          </div>,
          document.querySelector('body'),
        )}
      <form onSubmit={handleSubmit}>
        <div
          style={{ minHeight: 'unset', height: 'unset' }}
          className="card cardWithButton nofixedwidth"
        >
          <div style={{ minHeight: 'unset', height: 'unset' }} className="card-content">
            <HeaderTitle title="Add Payout Bank" />

            <div>Where do you want us to send your money?</div>
            <div className="help">
              * Your data is kept private, encrypted and secured via
              <a href="https://stripe.com/ca" target="_blank">
                {` Stripe `}
              </a>
            </div>
            {errorsList}
            <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              <div style={{ maxWidth: 280 }}>
                <TextInput
                  id="full_name"
                  type="text"
                  helpText="*Type your name as it appears on your bank statement"
                  label="Your Full Name"
                  error={touched.full_name && errors.full_name}
                  value={values.full_name || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div style={{ maxWidth: 280 }}>
                <TextInput
                  id="bank_name"
                  type="text"
                  label="Bank Name"
                  error={touched.bank_name && errors.bank_name}
                  value={values.bank_name || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ maxWidth: 280 }}>
                <TextInput
                  id="transit_number"
                  type="text"
                  label="Transit Number"
                  error={touched.transit_number && errors.transit_number}
                  value={values.transit_number || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ maxWidth: 280 }}>
                <TextInput
                  id="institution_number"
                  type="text"
                  label="Institution Number"
                  error={touched.institution_number && errors.institution_number}
                  value={values.institution_number || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div style={{ maxWidth: 280 }}>
                <TextInput
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

              {errorsList}
            </div>
          </div>
        </div>
      </form>
      <br />
      <br />
    </React.Fragment>
  );
};

export default connect(null, null)(EnhancedForms(PaymentSetupForm));

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
    </h2>
  );
};
