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
import moment from 'moment';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

import { DisplayLabelValue } from '../../containers/commonComponents';
import RequesterRequestDetailsPreview from './RequesterRequestDetailsPreview';
import { TASKS_DEFINITIONS } from './tasksDefinitions';
import {
  getCurrentAddress,
  toggleConfirmationDialog,
  autoSetGeoLocation,
  selectTimeButton,
  autoDetectLocationIfPermitted,
  insertTemplateText,
  updateDateInputFieldValue,
  setupGoogleAndGeoCoder,
  shouldShowAutodetectControl,
  RenderDateAndTimeField,
  RenderLocationField,
  RenderDetailedDescriptionField,
  RenderFormActionButtons,
  renderEffortField,
  selectEffortLevel,
} from '../commonJobFormComponents';
// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class HouseCleaningJobForm extends React.Component {
  constructor(props) {
    super(props);

    this.recaptchaRef = React.createRef();

    this.state = {
      forceSetAddressValue: '',
      selectedTimeButtonId: 'evening',
      showConfirmationDialog: false,
      selectedEffortButtonId: TASKS_DEFINITIONS[`bdbjob-house-cleaning`].extras.effort.small,
    };

    setupGoogleAndGeoCoder.bind(this)();

    this.getCurrentAddress = getCurrentAddress.bind(this);
    this.autoSetGeoLocation = autoSetGeoLocation.bind(this);
    // this.autoDetectLocationIfPermitted = autoDetectLocationIfPermitted.bind(this);
    this.toggleConfirmationDialog = toggleConfirmationDialog.bind(this);
    this.selectTimeButton = selectTimeButton.bind(this);
    this.insertTemplateText = insertTemplateText.bind(this);
    this.updateDateInputFieldValue = updateDateInputFieldValue.bind(this);
    this.shouldShowAutodetectControl = shouldShowAutodetectControl.bind(this);
    this.RenderDateAndTimeField = RenderDateAndTimeField.bind(this);
    this.RenderLocationField = RenderLocationField.bind(this);
    this.RenderDetailedDescriptionField = RenderDetailedDescriptionField.bind(this);
    this.RenderFormActionButtons = RenderFormActionButtons.bind(this);
    this.selectEffortLevel = selectEffortLevel.bind(this);
    this.renderEffortField = renderEffortField.bind(this);
  }

  componentDidMount() {
    // this.autoDetectLocationIfPermitted();
    if (this.recaptchaRef && this.recaptchaRef.current && this.recaptchaRef.current.execute) {
      this.recaptchaRef.current.execute();
    }
  }

  render() {
    const { values, handleSubmit, isSubmitting, setFieldValue, currentUserDetails } = this.props;

    const { ID, TASK_EXPECTATIONS, extras, TITLE } = TASKS_DEFINITIONS[`bdbjob-house-cleaning`];
    const { showConfirmationDialog } = this.state;

    const newTaskDetails = {
      fromTemplateId: TASKS_DEFINITIONS[`bdbjob-house-cleaning`].ID,
      startingDateAndTime: values.dateField,
      _ownerRef: currentUserDetails,
      addressText: values.addressTextField,
      detailedDescription: values.detailedDescriptionField,
      extras: { effort: values.effortField },
    };
    return (
      <React.Fragment>
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
                  <RequesterRequestDetailsPreview job={newTaskDetails} />

                  <div className="field" style={{ padding: '0.5rem', marginTop: 12 }}>
                    <label className="label">BidOrBoo Safety rules</label>
                    <div className="help">
                      * Once you post you will not be able to edit the job details.
                    </div>
                    <div className="help">
                      * For your privacy Taskers will not see the exact address.
                    </div>
                    <div className="help">
                      * Once you have chosen a Tasker you will get in touch to finalize the details.
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
              <i className="fas fa-home" />
            </span>
            <span style={{ marginLeft: 6 }}>{TITLE} Request</span>
          </div>

          <input
            id="recaptchaField"
            className="input is-invisible"
            type="hidden"
            value={values.recaptchaField || ''}
          />
          <ReCAPTCHA
            style={{ display: 'none' }}
            ref={this.recaptchaRef}
            size="invisible"
            badge="bottomright"
            onExpired={() => this.recaptchaRef.current.execute()}
            onChange={(result) => {
              setFieldValue('recaptchaField', result, true);
            }}
            sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
          />
          <input id="fromTemplateIdField" className="input is-invisible" type="hidden" value={ID} />

          <DisplayLabelValue labelText="Sercvice Commitment" labelValue={TASK_EXPECTATIONS} />
          <br />
          {this.RenderLocationField()}
          <br />
          {this.renderEffortField(extras.effort)}
          <br />
          {this.RenderDetailedDescriptionField()}
          <br />
          {this.RenderDateAndTimeField()}
          <br />
          {this.RenderFormActionButtons()}
        </form>
      </React.Fragment>
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
        this.props.setFieldValue('locationField', pos, true);

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
    recaptchaField: Yup.string()
      .ensure()
      .trim()
      .required('passing recaptcha is required.'),
    fromTemplateIdField: Yup.string()
      .ensure()
      .trim()
      .required('*Template Id missing, This field is required'),
    dateField: Yup.string().required('*Date Field is required'),
    detailedDescriptionField: Yup.string()
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
      effortField: TASKS_DEFINITIONS[`bdbjob-house-cleaning`].extras.effort.small,
      fromTemplateIdField: props.fromTemplateIdField,
      dateField: moment()
        .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
        .toISOString(),
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    // https://stackoverflow.com/questions/32540667/moment-js-utc-to-local-time
    // var x = moment.utc(values.dateField).format('YYYY-MM-DD HH:mm:ss');
    // var y = moment.utc("2018-04-19T19:29:45.000Z").local().format('YYYY-MM-DD HH:mm:ss');;
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'HouseCleaningJobForm',
});

export default EnhancedForms(HouseCleaningJobForm);

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);
