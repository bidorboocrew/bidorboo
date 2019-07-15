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
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import moment from 'moment';
import * as Yup from 'yup';
import { TextAreaInput, GeoAddressInput, DateInput } from '../components/forms/FormsHelpers';
// import { StepsForRequest } from '../containers/commonComponents';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { DisplayLabelValue } from '../containers/commonComponents';
import RequesterRequestDetailsPreview from './AllPossibleTasksStatesCards/RequesterRequestDetailsPreview';
import TASKS_DEFINITIONS from './tasksDefinitions';
import taskImage from '../assets/images/cleaning.png';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class GenericRequestForm extends React.Component {
  constructor(props) {
    super(props);

    this.requestTemplateId = props.requestTemplateId;

    this.state = {
      forceSetAddressValue: '',
      selectedTimeButtonId: 'evening',
      showConfirmationDialog: false,
    };

    this.google = window.google;
    if (this.google) {
      this.geocoder = new this.google.maps.Geocoder();
    }
    // extras
    this.extrasFunc = TASKS_DEFINITIONS[this.requestTemplateId].extras.bind(this);
    this.extrasValidations = TASKS_DEFINITIONS[this.requestTemplateId].extrasValidation.bind(this);
  }
  shouldShowAutodetectControl = () => {
    return navigator.geolocation ? (
      <div
        onClick={this.getCurrentAddress}
        style={{
          top: -10,
          left: 70,
          fontSize: 10,
          zIndex: 11,
          cursor: 'pointer',
          position: 'absolute',
        }}
        className="has-text-weight-bold has-text-link"
      >
        {`(AUTO DETECT)`}
      </div>
    ) : null;
  };
  updateDateInputFieldValue = (val) => {
    const { setFieldValue } = this.props;
    const { selectedTimeButtonId } = this.state;

    let selectedTimeValue = this.getTimeAdjustment(selectedTimeButtonId);

    const adjustedTimeVal = moment(val)
      .set({ hour: selectedTimeValue, minute: 0, second: 0, millisecond: 0 })
      .toISOString();

    setFieldValue('startingDateAndTime', adjustedTimeVal, false);
  };

  getTimeAdjustment = (selectedTimeButtonId) => {
    let selectedTimeValue = 17;

    switch (selectedTimeButtonId) {
      case 'morning': {
        selectedTimeValue = 8;
        break;
      }
      case 'afternoon': {
        selectedTimeValue = 12;
        break;
      }
      case 'evening': {
        selectedTimeValue = 17;
        break;
      }
      case 'anytime': {
        selectedTimeValue = 10;
        break;
      }
      default: {
        selectedTimeValue = 17;
        break;
      }
    }

    return selectedTimeValue;
  };

  selectTimeButton = (selectionId) => {
    const { setFieldValue, values } = this.props;

    let selectedTimeValue = this.getTimeAdjustment(selectionId);

    this.setState({ selectedTimeButtonId: selectionId }, () => {
      setFieldValue('startingDateAndTime', selectedTimeValue, false);
      const newAdjustedTimeVal = moment(values.startingDateAndTime)
        .set({ hour: selectedTimeValue, minute: 0, second: 0, millisecond: 0 })
        .toISOString();

      setFieldValue('startingDateAndTime', newAdjustedTimeVal, false);
    });
  };

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

  onSubmit = () => {
    const { addJob, values } = this.props;
    // process the values to be sent to the server
    const {
      location,
      detailedDescription,
      startingDateAndTime,
      addressText,
      templateId,
      ...extras // everything else
    } = values;

    // do some validation before submitting
    if (!location || !location.lat || !location.lng) {
      alert('sorry you must specify the location for this request');
      return;
    }
    if (!addressText) {
      alert('sorry you must specify the location for this request');
      return;
    }
    if (!detailedDescription) {
      alert('sorry you must add more details about this request');
      return;
    }
    if (!startingDateAndTime) {
      alert(
        'sorry you must specify a starting Date And Time for when do you want this request to be done',
      );
      return;
    }
    if (!templateId) {
      alert('sorry something went wrong , we could not detect the Job ID . please try again later');
      return;
    }

    // validate any extra fields based on the task
    if (this.extrasValidations) {
      if (!this.extrasValidations()) {
        return;
      }
    }

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

    const mappedFieldsToJobSchema = {
      detailedDescription: detailedDescription,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      startingDateAndTime,
      addressText,
      templateId,
      extras: {
        ...extras,
      },
    };
    addJob(mappedFieldsToJobSchema);
  };
  autoSetGeoLocation = (addressText) => {
    this.setState(() => ({ forceSetAddressValue: addressText }));
    // update the form field with the current position coordinates
    this.props.setFieldValue('addressText', addressText, false);
  };
  toggleConfirmationDialog = () => {
    const { isLoggedIn, showLoginDialog } = this.props;
    if (!isLoggedIn) {
      showLoginDialog(true);
      return;
    }
    this.setState({
      showConfirmationDialog: !this.state.showConfirmationDialog,
    });
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
      isValid,
    } = this.props;

    const { ID, TASK_EXPECTATIONS, TITLE, ICON, SUGGESTION_TEXT, DESCRIPTION } = TASKS_DEFINITIONS[
      this.requestTemplateId
    ];
    const { showConfirmationDialog, selectedTimeButtonId } = this.state;

    const {
      location,
      detailedDescription,
      startingDateAndTime,
      addressText,
      templateId,
      ...extras // everything else
    } = values;

    const newTaskDetails = {
      _ownerRef: currentUserDetails,
      location,
      detailedDescription,
      startingDateAndTime,
      addressText,
      templateId,
      extras,
    };

    const extrasFields = this.extrasFunc();
    const taskSpecificExtraFormFields = [];
    Object.keys(extrasFields).forEach((key) => {
      taskSpecificExtraFormFields.push(
        extrasFields[key].renderFormOptions({ values, setFieldValue }),
      );
    });

    return (
      <div className="card limitLargeMaxWidth">
        <div className="card-content">
          {showConfirmationDialog &&
            ReactDOM.createPortal(
              <div className="modal is-active">
                <div onClick={this.toggleConfirmationDialog} className="modal-background" />
                <div className="modal-card">
                  <header className="modal-card-head">
                    <div className="modal-card-title">Request Preview</div>
                    <button
                      onClick={this.toggleConfirmationDialog}
                      className="delete"
                      aria-label="close"
                    />
                  </header>

                  <section className="modal-card-body">
                    <RequesterRequestDetailsPreview job={newTaskDetails} />
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      style={{ width: 120 }}
                      onClick={this.toggleConfirmationDialog}
                      className="button is-outline"
                    >
                      <span className="icon">
                        <i className="far fa-arrow-alt-circle-left" />
                      </span>
                      <span>Go Back</span>
                    </button>
                    <button
                      style={{ width: 120 }}
                      type="submit"
                      disabled={isSubmitting}
                      onClick={this.onSubmit}
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
            <article class="media">
              <figure class="media-left">
                <p class="image is-128x128">
                  <img src={taskImage} alt="BidOrBoo" style={{ borderRadius: '100%' }} />
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <h1 style={{ fontWeight: 100 }} className="title">
                    {TITLE}
                  </h1>
                  <p style={{ color: '#6c6c6c' }}>{DESCRIPTION}</p>
                </div>
              </div>
            </article>
            {/* <div style={{ marginBottom: 16 }} className="title">
              <span className="icon">
                <i className={ICON} />
              </span>
              <span style={{ marginLeft: 6 }}>{TITLE} Request</span>
            </div> */}
            <input
              id="recaptcha"
              className="input is-invisible"
              type="hidden"
              value={values.recaptcha || ''}
            />

            <input id="templateId" className="input is-invisible" type="hidden" value={ID} />
            {/* <DisplayLabelValue labelText="Our Service Commitment" labelValue={TASK_EXPECTATIONS} /> */}
            <div style={{ marginBottom: 10 }} className="group">
              <textarea
                readOnly
                style={{
                  resize: 'none',
                  fontSize: 16,
                  padding: 10,
                  height: 'unset',
                }}
                className="input readOnly"
                type="text"
                value={TASK_EXPECTATIONS}
              />
              <label className="withPlaceholder hasSelectedValue">our Commitment</label>
            </div>
            <React.Fragment>
              <input
                id="addressText"
                className="input is-invisible"
                type="hidden"
                value={values.addressText || ''}
              />
              <input
                id="location"
                className="input is-invisible"
                type="hidden"
                value={values.location || ''}
              />

              <GeoAddressInput
                id="geoInputField"
                type="text"
                helpText={'You must select an address from the drop down menu'}
                label="Location"
                placeholder="start typing an address"
                autoDetectComponent={this.shouldShowAutodetectControl}
                error={touched.addressText && errors.addressText}
                value={values.addressText || ''}
                onError={(e) => {
                  errors.addressText = 'google api error ' + e;
                }}
                onChangeEvent={(e) => {
                  setFieldValue('addressText', e, true);
                }}
                onBlurEvent={(e) => {
                  if (e && e.target) {
                    e.target.id = 'addressText';
                    handleBlur(e);
                  }
                }}
                handleSelect={(address) => {
                  setFieldValue('addressText', address, false);
                  geocodeByAddress(address)
                    .then((results) => getLatLng(results[0]))
                    .then((latLng) => {
                      setFieldValue('location', latLng, false);
                      console.log('Success', latLng);
                    })
                    .catch((error) => {
                      errors.addressText = 'error getting lat lng ' + error;
                      console.error('Error', error);
                    });
                }}
              />
            </React.Fragment>

            <React.Fragment>
              <input
                id="startingDateAndTime"
                className="input is-invisible"
                type="hidden"
                value={values.startingDateAndTime}
              />
              <input
                id="timeField"
                className="input is-invisible"
                type="hidden"
                value={this.state.selectedTime}
              />
              <DateInput
                id="DateInputField"
                type="text"
                label="Date"
                onChangeEvent={this.updateDateInputFieldValue}
              />
              <div className="group">
                <div className="select">
                  <select
                    value={selectedTimeButtonId}
                    onChange={(event) => this.selectTimeButton(event.target.value)}
                  >
                    <option value="morning">Morning (8AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-5PM)</option>
                    <option value="evening">Evening (5PM-12AM)</option>
                    <option value="evening">Anytime (8AM-12AM)</option>
                  </select>
                </div>
                <span className="highlight" />
                <span className="bar" />
                <label className="withPlaceholder hasSelectedValue">{'Time Of Day'}</label>
              </div>
            </React.Fragment>

            {/* {extras} */}
            {taskSpecificExtraFormFields}

            <TextAreaInput
              id="detailedDescription"
              type="text"
              helpText={
                '* Extra details that would help the tasker finish this task to your expectations.'
              }
              label="Additional Instructions"
              startWithTemplateButton={
                <div
                  onClick={this.insertTemplateText}
                  style={{
                    top: -10,
                    left: 170,
                    fontSize: 10,
                    zIndex: 11,
                    cursor: 'pointer',
                    position: 'absolute',
                  }}
                  className="has-text-weight-bold has-text-link"
                >
                  {`(ANSWER FAQS)`}
                </div>
              }
              placeholder={SUGGESTION_TEXT}
              error={touched.detailedDescription && errors.detailedDescription}
              value={values.detailedDescription || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <React.Fragment>
              <div className="field">
                <button
                  style={{ width: 120 }}
                  type="button"
                  className="button is-outlined is-medium"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    this.onGoBack(e);
                  }}
                >
                  <span className="icon">
                    <i className="far fa-arrow-alt-circle-left" />
                  </span>
                  <span>Back</span>
                </button>
                <button
                  style={{ width: 120, marginLeft: '1rem' }}
                  className={`button is-success is-medium  ${isSubmitting ? 'is-loading' : ''}`}
                  disabled={isSubmitting || !isValid}
                  onClick={(e) => {
                    e.preventDefault();
                    this.toggleConfirmationDialog();
                  }}
                >
                  <span>Preview</span>
                </button>
              </div>
            </React.Fragment>
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
        alert('Sorry! Bid or Boo is only available in Canada');
      } else {
        this.autoSetGeoLocation(address);
      }
    }
  };
  getCurrentAddress = () => {
    debugger;
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
    startingDateAndTime: Yup.string().required('*Date Field is required'),
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
      templateId: props.requestTemplateId,
      startingDateAndTime: moment()
        .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
        .toISOString(),
      ...TASKS_DEFINITIONS[props.requestTemplateId].defaultExtrasValues,
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    // https://stackoverflow.com/questions/32540667/moment-js-utc-to-local-time
    // var x = moment.utc(values.date).format('YYYY-MM-DD HH:mm:ss');
    // var y = moment.utc("2018-04-19T19:29:45.000Z").local().format('YYYY-MM-DD HH:mm:ss');;
    // props.onSubmit(values);
    // setSubmitting(false);
  },
  displayName: 'GenericRequestForm',
});

export default EnhancedForms(GenericRequestForm);

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);
