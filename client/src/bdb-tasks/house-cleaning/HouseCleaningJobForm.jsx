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
import TextareaAutosize from 'react-autosize-textarea';
import * as Yup from 'yup';

import {
  StartDateAndTime,
  UserImageAndRating,
  DisplayLabelValue,
  HowItWorksRequest,
} from '../../containers/commonComponents';
import HouseCleaningRequestDetails from './HouseCleaningRequestDetails';
import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';
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
} from '../commonJobComponents';
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
    };

    setupGoogleAndGeoCoder.bind(this)();

    this.getCurrentAddress = getCurrentAddress.bind(this);
    this.autoSetGeoLocation = autoSetGeoLocation.bind(this);
    this.autoDetectLocationIfPermitted = autoDetectLocationIfPermitted.bind(this);
    this.toggleConfirmationDialog = toggleConfirmationDialog.bind(this);
    this.selectTimeButton = selectTimeButton.bind(this);
    this.insertTemplateText = insertTemplateText.bind(this);
    this.updateDateInputFieldValue = updateDateInputFieldValue.bind(this);
    this.shouldShowAutodetectControl = shouldShowAutodetectControl.bind(this);
    this.RenderDateAndTimeField = RenderDateAndTimeField.bind(this);
    this.RenderLocationField = RenderLocationField.bind(this);
    this.RenderDetailedDescriptionField = RenderDetailedDescriptionField.bind(this);
    this.RenderFormActionButtons = RenderFormActionButtons.bind(this);
  }

  componentDidMount() {
    this.autoDetectLocationIfPermitted();

    this.recaptchaRef.current.execute();
  }

  render() {
    const { values, handleSubmit, isSubmitting, setFieldValue, currentUserDetails } = this.props;

    const { ID, requesterExpectations } = HOUSE_CLEANING_DEF;
    const { showConfirmationDialog } = this.state;

    const newTaskDetails = {
      fromTemplateId: HOUSE_CLEANING_DEF.ID,
      startingDateAndTime: values.dateField,
      _ownerRef: currentUserDetails,
      addressText: values.addressTextField,
      detailedDescription: values.detailedDescriptionField,
    };
    return (
      <React.Fragment>
        {showConfirmationDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title">Confirm Request Details</p>
                  <button class="delete" aria-label="close" />
                </header>

                <section className="modal-card-body">
                  <HouseCleaningRequestDetails job={newTaskDetails} />
                  <div className="field">
                    <label className="label">BidOrBoo Safety rules</label>
                    <HelpText helpText={`*Once you post you will not be able to edit the job.`} />
                    <HelpText helpText={`*Taskers will not be able to view the EXACT location.`} />
                    <HelpText
                      helpText={`*Once you have chosen a Tasker you will get in touch to finalize the details.`}
                    />
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
          <input
            id="recaptchaField"
            className="input is-invisible"
            type="hidden"
            value={values.recaptcha || ''}
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
          <br />
          <HowItWorksRequest
            labelText="About this task:"
            labelValue={requesterExpectations}
            step={1}
          />
          <br />
          {this.RenderLocationField()}
          <br />
          {this.RenderDateAndTimeField()}
          <br />
          {this.RenderDetailedDescriptionField()}
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
      timeField: 5,
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
  },
  displayName: 'HouseCleaningJobForm',
});

export default EnhancedForms(HouseCleaningJobForm);

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);
