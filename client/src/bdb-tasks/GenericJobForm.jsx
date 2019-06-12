/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { withFormik } from 'formik';
import haversineOffset from 'haversine-offset';

import moment from 'moment';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';
import { TextAreaInput } from '../components/forms/FormsHelpers';
import { StepsForRequest } from '../containers/commonComponents';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { DisplayLabelValue } from '../containers/commonComponents';
import RequesterRequestDetailsPreview from './genericTasks/RequesterRequestDetailsPreview';
import TASKS_DEFINITIONS from './tasksDefinitions';
import {
  getCurrentAddress,
  toggleConfirmationDialog,
  autoSetGeoLocation,
  selectTimeButton,
  updateDateInputFieldValue,
  setupGoogleAndGeoCoder,
  shouldShowAutodetectControl,
  RenderDateAndTimeField,
  RenderLocationField,
  RenderFormActionButtons,
} from './commonJobFormComponents';
// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class GenericJobForm extends React.Component {
  constructor(props) {
    super(props);

    this.requestTemplateId = props.requestTemplateId;

    this.state = {
      forceSetAddressValue: '',
      selectedTimeButtonId: 'evening',
      showConfirmationDialog: false,
    };

    setupGoogleAndGeoCoder.bind(this)();

    this.getCurrentAddress = getCurrentAddress.bind(this);
    this.autoSetGeoLocation = autoSetGeoLocation.bind(this);
    this.toggleConfirmationDialog = toggleConfirmationDialog.bind(this);
    this.selectTimeButton = selectTimeButton.bind(this);
    this.updateDateInputFieldValue = updateDateInputFieldValue.bind(this);
    this.shouldShowAutodetectControl = shouldShowAutodetectControl.bind(this);
    this.RenderDateAndTimeField = RenderDateAndTimeField.bind(this);
    this.RenderLocationField = RenderLocationField.bind(this);
    this.RenderFormActionButtons = RenderFormActionButtons.bind(this);

    // extras
    this.extrasFunc = TASKS_DEFINITIONS[this.requestTemplateId].extras.bind(this);
    this.extrasValidations = TASKS_DEFINITIONS[this.requestTemplateId].extrasValidation.bind(this);
  }

  insertTemplateText = () => {
    const { SUGGESTION_TEXT } = TASKS_DEFINITIONS[this.requestTemplateId];
    const existingText = this.props.values.detailedDescription
      ? `${this.props.values.detailedDescription}\n`
      : '';

    this.props.setFieldValue('detailedDescription', `${existingText}${SUGGESTION_TEXT}`, true);
  };

  onGoBack = (e) => {
    e.preventDefault();
    switchRoute(ROUTES.CLIENT.PROPOSER.root);
  };

  onSubmit = (values) => {
    const { addJob } = this.props;
    // process the values to be sent to the server
    const {
      location,
      detailedDescription,
      date,
      address,
      templateId,

      ...extras // everything else
    } = values;
    debugger;
    // do some validation before submitting
    if (!location || !location.lat || !location.lng) {
      alert('sorry you must specify the location for this request');
      return;
    }
    if (!address) {
      alert('sorry you must specify the location for this request');
      return;
    }
    if (!detailedDescription) {
      alert('sorry you must add more details about this request');
      return;
    }
    if (!date) {
      alert('sorry you must specify a date for when do you want this request to be done');
      return;
    }
    if (!templateId) {
      alert('sorry something went wrong , we could not detect the Job ID . please try again later');
      return;
    }

    // validate any extra fields based on the task
    this.extrasValidations && this.extrasValidations();

    //  offset the location for security
    // https://www.npmjs.com/package/haversine-offset
    let lng = 0;
    let lat = 0;
    try {
      lng = parseFloat(location.lng);
      lat = parseFloat(location.lat);
      let preOffset = { latitude: lat, longitude: lng };
      let offset = {
        x: Math.floor(Math.random() * Math.floor(1000)),
        y: Math.floor(Math.random() * Math.floor(1000)),
      };

      let postOffset = haversineOffset(preOffset, offset);

      if (postOffset.lat > 0) {
        lat = Math.min(postOffset.lat, 90).toFixed(5);
      } else if (postOffset.lat < 0) {
        lat = Math.max(postOffset.lat, -90).toFixed(5);
      }
      if (postOffset.lng > 0) {
        lng = Math.min(postOffset.lng, 180).toFixed(5);
      } else if (postOffset.lng < 0) {
        lng = Math.max(postOffset.lng, -180).toFixed(5);
      }
    } catch (e) {
      console.log('failed to create location');
    }

    const mapFieldsToSchema = {
      detailedDescription: detailedDescription,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      startingDateAndTime: date,
      address,
      templateId,
      extras: {
        ...extras,
      },
    };
    debugger;
    // addJob(mapFieldsToSchema, recaptcha);
  };

  render() {
    const {
      values,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      currentUserDetails,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;

    const { ID, TASK_EXPECTATIONS, TITLE, ICON, SUGGESTION_TEXT } = TASKS_DEFINITIONS[
      this.requestTemplateId
    ];
    const { showConfirmationDialog } = this.state;

    const newTaskDetails = {
      fromTemplateId: TASKS_DEFINITIONS[this.requestTemplateId].ID,
      startingDateAndTime: values.date,
      _ownerRef: currentUserDetails,
      addressText: values.address,
      detailedDescription: values.detailedDescription,
    };

    const extrasFields = this.extrasFunc();
    const taskSpecificExtraFormFields = [];
    Object.keys(extrasFields).forEach((key) => {
      taskSpecificExtraFormFields.push(
        extrasFields[key].renderFormOptions({ values, setFieldValue }),
      );
    });

    return (
      <div
        style={{ maxWidth: 'unset', border: 'none', boxShadow: 'none' }}
        className="card limitLargeMaxWidth"
      >
        <section style={{ padding: '0.5rem' }} className="hero is-small is-white">
          <br />
          <StepsForRequest isSmall step={1} />
          <br />
        </section>

        <div className="card-content">
          {showConfirmationDialog &&
            ReactDOM.createPortal(
              <div className="modal is-active">
                <div onClick={this.toggleConfirmationDialog} className="modal-background" />
                <div className="modal-card">
                  <header className="modal-card-head">
                    <div className="modal-card-title">Confirm Request Details</div>
                    <button className="delete" aria-label="close" />
                  </header>

                  <section className="modal-card-body">
                    <label className="label">Your Request Preview</label>
                    {/* <RequesterRequestDetailsPreview job={newTaskDetails} /> */}

                    <div className="field" style={{ padding: '0.5rem', marginTop: 12 }}>
                      <label className="label">BidOrBoo Safety rules</label>
                      <div className="help">
                        * Once you post you will not be able to edit the job details.
                      </div>
                      <div className="help">
                        * For your privacy Taskers will not see the exact address.
                      </div>
                      <div className="help">
                        * Once you have chosen a Tasker you will get in touch to finalize the
                        details.
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      style={{ width: 120 }}
                      onClick={this.toggleConfirmationDialog}
                      className="button is-outline"
                    >
                      <span className="icon">
                        <i className="far fa-edit" />
                      </span>
                      <span>go Back</span>
                    </button>
                    <button
                      style={{ width: 120 }}
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="button is-success"
                    >
                      <span className="icon">
                        <i className="far fa-paper-plane" />
                      </span>
                      <span>Submit</span>
                    </button>
                  </footer>
                </div>
              </div>,
              document.querySelector('#bidorboo-root-modals'),
            )}

          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ marginBottom: 16 }} className="title">
              <span className="icon">
                <i className={ICON} />
              </span>
              <span style={{ marginLeft: 6 }}>{TITLE} Request</span>
            </div>
            <input
              id="recaptcha"
              className="input is-invisible"
              type="hidden"
              value={values.recaptcha || ''}
            />

            <input id="templateId" className="input is-invisible" type="hidden" value={ID} />
            <DisplayLabelValue labelText="Sercvice Commitment" labelValue={TASK_EXPECTATIONS} />
            <br />
            {this.RenderLocationField()}
            <br />
            {this.RenderDateAndTimeField()}
            <br />
            {/* {extras} */}
            {taskSpecificExtraFormFields}
            <br />

            <TextAreaInput
              id="detailedDescription"
              type="text"
              helpText={
                '* The more details you put the more likely that you will get the task done to your satisfaction.'
              }
              label="Tell the tasker about your expectations or any special Instructions"
              startWithTemplateButton={
                <a
                  style={{ marginBottom: 4 }}
                  className="button is-info is-outlined is-small"
                  onClick={this.insertTemplateText}
                >
                  <span className="icon">
                    <i className="fas fa-pencil-alt" />
                  </span>
                  <span>Common Questions</span>
                </a>
              }
              placeholder={SUGGESTION_TEXT}
              error={touched.detailedDescription && errors.detailedDescription}
              value={values.detailedDescription || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <br />
            {this.RenderFormActionButtons()}
          </form>
        </div>
      </div>
    );
  }

  successfullGeoCoding = (results, status) => {
    // xxx handle the various error (api over limit ...etc)
    if (status !== this.google.maps.GeocoderStatus.OK) {
      alert(status);
    }
    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status === this.google.maps.GeocoderStatus.OK) {
      let address = results[0].formatted_address;
      if (address && !address.toLowerCase().includes('canada')) {
        alert('Sorry! Bid or Boo is only available in Canada.');
      } else {
        this.autoSetGeoLocation(address);
      }
    }
  };
  getCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 10000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      const errorHandling = (err) => {
        console.error('can not auto detect address');
        let msg = '';
        if (err.code === 3) {
          // Timed out
          msg = "<p>Can't get your location (high accuracy attempt). Error = ";
        }
        if (err.code === 1) {
          // Access denied by user
          msg =
            'PERMISSION_DENIED - You have not given BidOrBoo permission to detect your address. Please go to your browser settings and enable auto detect location for BidorBoo.com';
        } else if (err.code === 2) {
          // Position unavailable
          msg = 'POSITION_UNAVAILABLE';
        } else {
          // Unknown error
          msg = ', msg = ' + err.message;
        }
        alert(msg);
      };
      const successfulRetrieval = (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // update the form field with the current position coordinates
        this.props.setFieldValue('location', pos, true);

        if (this.google && this.geocoder) {
          //https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
          this.geocoder.geocode(
            {
              location: { lat: parseFloat(pos.lat), lng: parseFloat(pos.lng) },
            },
            this.successfullGeoCoding,
          );
        }
      };

      //get the current location
      navigator.geolocation.getCurrentPosition(
        successfulRetrieval,
        errorHandling,
        getCurrentPositionOptions,
      );
    } else {
      console.log('no html 5 geo location');
    }
  };
}

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    templateId: Yup.string()
      .ensure()
      .trim()
      .required('*Template Id missing, This field is required'),
    date: Yup.string().required('*Date Field is required'),
    detailedDescription: Yup.string()
      .ensure()
      .trim()
      .min(
        20,
        'your description must be more than 20 chars , please be detailed in descibing the task',
      )
      .required('*Please provide a detailed description '),
  }),
  mapPropsToValues: (props) => {
    return {
      timeField: 17,
      templateId: props.requestTemplateId,
      date: moment()
        .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
        .toISOString(),
      ...TASKS_DEFINITIONS[props.requestTemplateId].defaultExtrasValues,
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    // https://stackoverflow.com/questions/32540667/moment-js-utc-to-local-time
    // var x = moment.utc(values.date).format('YYYY-MM-DD HH:mm:ss');
    // var y = moment.utc("2018-04-19T19:29:45.000Z").local().format('YYYY-MM-DD HH:mm:ss');;
    debugger;
    // props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'GenericJobForm',
});

export default EnhancedForms(GenericJobForm);

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);
