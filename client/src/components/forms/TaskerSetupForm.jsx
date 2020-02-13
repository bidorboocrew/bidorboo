import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as A from '../../app-state/actionTypes';

import Dropzone from 'react-dropzone';
import { withFormik } from 'formik';
import { getBugsnagClient } from '../../index';
import * as ROUTES from '../../constants/frontend-route-consts';

const MAX_FILE_SIZE_IN_MB = 1000000 * 10; //10MB

const EnhancedForms = withFormik({
  handleSubmit: async (values, { setSubmitting, props }) => {
    const { dispatch } = props;
    const { idFrontImg, idBackImg } = values;

    if (!idFrontImg || !idBackImg) {
      setSubmitting(false);
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: 'you must upload both front and back side of a government issued ID',
          },
        },
      });

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
        getBugsnagClient().leaveBreadcrumb('URGENT_Error processing id img');
        getBugsnagClient().notify(e);

        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Error processing id img' + JSON.stringify(e),
            },
          },
        });
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
        getBugsnagClient().leaveBreadcrumb('URGENT_Error processing id img');
        getBugsnagClient().notify(e);
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Error processing id img' + JSON.stringify(e),
            },
          },
        });
        setSubmitting(false);
      }
    }

    try {
      const connectedAccountDetails = {
        individual: {
          verification: {
            document: {
              front: frontSideResp.data.id,
              back: backSideResp.data.id,
            },
          },
        },
      };
      await axios.put(`${ROUTES.API.PAYMENT.PUT.setupPaymentDetails}`, {
        data: {
          connectedAccountDetails,
        },
      });
    } catch (e) {
      props && props.closeModal && props.closeModal();

      getBugsnagClient().leaveBreadcrumb('URGENT_failed  to create account');
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
      dispatch({
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
    props && props.closeModal && props.closeModal();
  },
  displayName: 'PaymentSetupForm',
});

const PaymentSetupForm = (props) => {
  const {
    values,
    touched,
    errors,
    handleSubmit,
    isValid,
    setFieldValue,
    isSubmitting,
    dispatch,
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
      <form onSubmit={handleSubmit}>
        <div
          style={{ minHeight: 'unset', height: 'unset' }}
          className="card cardWithButton nofixedwidth"
        >
          <div style={{ minHeight: 'unset', height: 'unset' }} className="card-content">
            <div>Adding an ID will get users to trust you which will help you win more bids</div>
            <br></br>
            {errorsList}
            <div style={{ borderBottom: '1px solid #353535' }} className="subtitle">
              ID Verification
            </div>
            <label className="label">Provide a valid non expired government issued ID</label>
            <input id="idFrontImg" className="input is-invisible" type="hidden" />

            <Dropzone
              className="file is-boxed idVerification"
              onDrop={(files) => {
                setFieldValue('idFrontImg', files[0], true);
              }}
              accept={'image/*'}
              onDropRejected={() => {
                dispatch({
                  type: A.UI_ACTIONS.SHOW_TOAST_MSG,
                  payload: {
                    toastDetails: {
                      type: 'error',
                      msg: 'this file is not accepted must be an img file less than 5MB',
                    },
                  },
                });
              }}
              maxSize={MAX_FILE_SIZE_IN_MB}
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
              maxSize={MAX_FILE_SIZE_IN_MB}
              className="file is-boxed idVerification"
              onDrop={(files) => {
                setFieldValue('idBackImg', files[0], true);
              }}
              accept={'image/*'}
              onDropRejected={() => {
                dispatch({
                  type: A.UI_ACTIONS.SHOW_TOAST_MSG,
                  payload: {
                    toastDetails: {
                      type: 'error',
                      msg: 'this file is not accepted must be an img file less than 5MB',
                    },
                  },
                });
              }}
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
            <div className="help">{`* Must be .JPEG or .PNG les than 10MB`}</div>
            <div className="help">
              * All Your files are encrypted and secured via
              <a href="https://stripe.com/ca" target="_blank">
                {` Stripe `}
              </a>
            </div>
            <button
              style={{ marginRight: 6 }}
              className={`button is-success firstButtonInCard is-medium  ${
                isSubmitting ? 'is-loading' : ''
              }`}
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              Submit
            </button>
            {/* <div className="help">
                * Provide your info as it appears on your legal document such as your: Passport,
                government-issued ID, or driver's license
              </div> */}
            {errorsList}
          </div>
        </div>
        <br></br>
        <br></br>
      </form>
    </React.Fragment>
  );
};

export default connect(null, null)(EnhancedForms(PaymentSetupForm));
