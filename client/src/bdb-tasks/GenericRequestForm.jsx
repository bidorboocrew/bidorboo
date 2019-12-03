/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import axios from 'axios';
import { withFormik } from 'formik';
import haversineOffset from 'haversine-offset';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Recaptcha from 'react-google-invisible-recaptcha';

import moment from 'moment';
import * as Yup from 'yup';
import {
  TextAreaInput,
  GeoAddressInput,
  DateInput,
  TextInput,
} from '../components/forms/FormsHelpers';
// import { StepsForRequest } from '../containers/commonComponents';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import TASKS_DEFINITIONS from './tasksDefinitions';
import UploaderComponent from './UploaderComponent';
// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class GenericRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.requestTemplateId = props.requestTemplateId;

    this.state = {
      forceSetAddressValue: '',
      selectedTimeButtonId: 'noSelection',
    };

    this.google = window.google;
    if (this.google) {
      this.geocoder = new this.google.maps.Geocoder();
    }
    // extras
    this.extrasFunc = TASKS_DEFINITIONS[this.requestTemplateId].extras.bind(this);
    this.extrasValidations =
      TASKS_DEFINITIONS[this.requestTemplateId].extrasValidation &&
      TASKS_DEFINITIONS[this.requestTemplateId].extrasValidation.bind(this);
  }

  onResolved = () => {
    this.props.setFieldValue('recaptchaField', this.recaptcha.getResponse());
  };
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      this.recaptcha.execute();
    } else {
      this.props.setFieldValue('recaptchaField', 'test', true);
    }
  }
  updateTaskThumbnails = (fieldIdAndValue) => {
    this.props.setFieldValue(fieldIdAndValue.fieldId, fieldIdAndValue.fieldValue, false);
  };

  shouldShowAutodetectControl = () => {
    return navigator.geolocation ? (
      <div
        onClick={this.getCurrentAddress}
        style={{
          cursor: 'pointer',
          color: '#ce1bbf',
        }}
        className="help"
      >
        <span className="icon">
          <i className="fas fa-map-marker-alt" />
        </span>
        <span>AUTO DETECT LOCATION</span>
      </div>
    ) : null;
  };

  shouldShowAutodetectControlForDestinationField = () => {
    return navigator.geolocation ? (
      <div
        onClick={this.getDestinationAddress}
        style={{
          cursor: 'pointer',
          color: '#ce1bbf',
        }}
        className="help"
      >
        <span className="icon">
          <i className="fas fa-map-marker-alt" />
        </span>
        <span>AUTO DETECT LOCATION</span>
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
    setFieldValue('startingDateAndTime', adjustedTimeVal, true);
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
    }

    return selectedTimeValue;
  };

  selectTimeButton = (selectionId) => {
    const { setFieldValue, values } = this.props;

    if (selectionId !== 'noSelection') {
      let selectedTimeValue = this.getTimeAdjustment(selectionId);

      this.setState({ selectedTimeButtonId: selectionId }, () => {
        setFieldValue('startingDateAndTime', selectedTimeValue, false);
        const newAdjustedTimeVal = moment(values.startingDateAndTime)
          .set({ hour: selectedTimeValue, minute: 0, second: 0, millisecond: 0 })
          .toISOString();
        setFieldValue('startingDateAndTime', newAdjustedTimeVal, true);
      });
    } else if (selectionId === 'noSelection') {
      this.setState({ selectedTimeButtonId: 'noSelection' });
    }
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

  autoSetGeoLocation = (addressText) => {
    this.setState(
      () => ({ forceSetAddressValue: addressText }),
      () => {
        this.props.setFieldValue('addressText', addressText, true);
      },
    );
    // update the form field with the current position coordinates
  };

  autoSetGeoLocationForDestinationAddress = (addressText) => {
    this.setState(
      () => ({ forceSetAddressValue: addressText }),
      () => {
        this.props.setFieldValue('destinationText', addressText, true);
      },
    );
    // update the form field with the current position coordinates
  };

  render() {
    const {
      values,
      isSubmitting,
      setFieldValue,
      touched,
      errors,
      dirty,
      handleChange,
      handleSubmit,
      handleBlur,
      recaptchaField,
    } = this.props;
    const {
      ID,
      renderSummaryCard,
      enableImageUploadField,
      requiresDestinationField,
    } = TASKS_DEFINITIONS[this.requestTemplateId];

    const extrasFields = this.extrasFunc();
    const taskSpecificExtraFormFields = [];
    Object.keys(extrasFields).forEach((key) => {
      taskSpecificExtraFormFields.push(extrasFields[key].renderFormOptions(this.props));
    });

    let timeOfDayClass = '';
    let istimeOfDayTouched = touched && touched.timeOfDay;
    if (istimeOfDayTouched) {
      timeOfDayClass =
        values.timeOfDay === 'noSelection' || errors.timeOfDay ? 'is-danger' : 'hasSelectedValue';
    }

    const hasAtLeastOneTaskImg = !!values.taskImg1 || !!values.taskImg2 || !!values.taskImg3;

    return (
      <React.Fragment>
        <div style={{ borderTop: '2px solid #26ca70' }} className="card limitLargeMaxWidth">
          <div style={{ position: 'relative' }} className="card-content">
            <form onSubmit={handleSubmit}>
              {renderSummaryCard({ withDetails: false })}

              <input id="templateId" className="input is-invisible" type="hidden" value={ID} />
              <input
                id="taskImg1"
                className="input is-invisible"
                type="hidden"
                value={values.taskImg1 || ''}
              />
              <input
                id="taskImg2"
                className="input is-invisible"
                type="hidden"
                value={values.taskImg1 || ''}
              />
              <br></br>
              <input
                id="taskImg3"
                className="input is-invisible"
                type="hidden"
                value={values.taskImg1 || ''}
              />

              {enableImageUploadField && (
                <div className="group">
                  <label className={`label ${hasAtLeastOneTaskImg ? 'hasSelectedValue' : ''}`}>
                    Upload images <span className="has-text-grey-lighter">(Optional)</span>
                  </label>

                  <ImageUploaderButton
                    updateTaskThumbnails={this.updateTaskThumbnails}
                    fieldId={'taskImg1'}
                  />
                  <Collapse isOpened={hasAtLeastOneTaskImg}>
                    <ImageUploaderButton
                      updateTaskThumbnails={this.updateTaskThumbnails}
                      fieldId={'taskImg2'}
                    />

                    <ImageUploaderButton
                      updateTaskThumbnails={this.updateTaskThumbnails}
                      fieldId={'taskImg3'}
                    />
                  </Collapse>
                </div>
              )}

              <TextInput
                id="jobTitle"
                type="text"
                label="Task title"
                placeholder={'Enter a title...'}
                error={touched.jobTitle && errors.jobTitle}
                value={values.jobTitle || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                helpText={'*a unique short title will help you identify the job easily'}
              ></TextInput>

              <input
                id="addressText"
                className="input is-invisible"
                type="hidden"
                value={values.addressText || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <input
                id="location"
                className="input is-invisible"
                type="hidden"
                value={values.location || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <GeoAddressInput
                id="geoInputField"
                type="text"
                helpText={'*Your exact address will be shared with the awarded Tasker only.'}
                label="Address"
                placeholder="Start typing an address..."
                autoDetectComponent={this.shouldShowAutodetectControl}
                error={errors.addressText || errors.location}
                touched={touched.addressText || touched.location}
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
                  setFieldValue('addressText', address, true);
                  geocodeByAddress(address)
                    .then((results) => getLatLng(results[0]))
                    .then((latLng) => {
                      setFieldValue('location', latLng, true);
                      // console.log('Success', latLng);
                    })
                    .catch((error) => {
                      errors.addressText = 'error getting lat lng ' + error;
                      console.error('Error', error);
                    });
                }}
              />
              {requiresDestinationField && (
                <>
                  <input
                    id="destinationText"
                    className="input is-invisible"
                    type="hidden"
                    value={values.destinationText || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <GeoAddressInput
                    id="geoInputField2"
                    type="text"
                    helpText={'You must select an address from the drop down menu'}
                    label="destination"
                    placeholder="start typing an address"
                    autoDetectComponent={this.shouldShowAutodetectControlForDestinationField}
                    error={errors.destinationText}
                    touched={touched.destinationText}
                    value={values.destinationText || ''}
                    onError={(e) => {
                      errors.addressText = 'google api error ' + e;
                    }}
                    onChangeEvent={(e) => {
                      setFieldValue('destinationText', e, true);
                    }}
                    onBlurEvent={(e) => {
                      if (e && e.target) {
                        e.target.id = 'destinationText';
                        handleBlur(e);
                      }
                    }}
                    handleSelect={(address) => {
                      setFieldValue('destinationText', address, true);
                      // this.autoSetGeoLocation(address);
                    }}
                  />
                </>
              )}

              <input
                id="startingDateAndTime"
                className="input is-invisible"
                type="hidden"
                value={values.startingDateAndTime}
              />

              <DateInput
                id="DateInputField"
                type="text"
                label="Task date"
                onChangeEvent={this.updateDateInputFieldValue}
                error={errors.startingDateAndTime}
                touched={touched.startingDateAndTime}
              />
              <div className={`group ${touched.timeOfDay && errors.timeOfDay ? 'isError' : ''}`}>
                <label className={timeOfDayClass}>{'Preferred time'}</label>
                <div>
                  <div className={`select ${timeOfDayClass}`}>
                    <select
                      id="timeOfDay"
                      value={values.timeOfDay}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>.
                      <option value="morning">Morning (8AM-12PM)</option>
                      <option value="afternoon">Afternoon (12PM-5PM)</option>
                      <option value="evening">Evening (5PM-12AM)</option>
                      <option value="anytime">Anytime (8AM-12AM)</option>
                    </select>
                    {touched.timeOfDay && errors.timeOfDay && (
                      <div className="help is-danger">{errors.timeOfDay}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* {extras} */}
              {taskSpecificExtraFormFields}

              <TextAreaInput
                id="detailedDescription"
                type="text"
                label="Additional instructions"
                startWithTemplateButton={
                  <div
                    onClick={this.insertTemplateText}
                    style={{
                      cursor: 'pointer',
                      color: '#ce1bbf',
                    }}
                    className="help"
                  >
                    <span className="icon">
                      <i className="fas fa-pen" />
                    </span>
                    <span>or click to answer our sample questions</span>
                  </div>
                }
                placeholder={
                  'Type in any additional or special instructions to help the Tasker perform the task to your satisfaction'
                }
                error={touched.detailedDescription && errors.detailedDescription}
                value={values.detailedDescription || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <br></br>
              <input
                id="recaptchaField"
                className="input is-invisible"
                type="hidden"
                value={values.recaptchaField || recaptchaField}
              />
              {process.env.NODE_ENV === 'production' && (
                <>
                  <Recaptcha
                    ref={(ref) => (this.recaptcha = ref)}
                    sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
                    onLoaded={() => console.log('loaded')}
                    onResolved={this.onResolved}
                    onExpired={() => this.recaptcha.reset()}
                    badge={'inline'}
                  />
                  {/* https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-v3-badge-what-is-allowed */}
                  <div className="help">
                    {`This site is protected by reCAPTCHA and the Google `}
                    <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                    <a href="https://policies.google.com/terms">Terms of Service</a> apply.
                  </div>
                </>
              )}
              <br></br>
              {dirty && errors && Object.keys(errors).length > 0 && (
                <div className="help is-dark">
                  * some fields are missing or contain errors. Scroll up if needed.
                </div>
              )}
              <button
                type="submit"
                style={{
                  marginLeft: '1rem',
                  borderRadius: 25,
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '1.5rem',
                  fontWeight: 400,
                  boxShadow: '0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)',
                }}
                className={`button is-success is-medium ${isSubmitting ? 'is-loading' : ''}`}
                disabled={isSubmitting}
              >
                <span className="icon">
                  <i className="far fa-paper-plane" />
                </span>
                <span>Post It</span>
              </button>

            </form>
          </div>
        </div>
        <br />
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
        alert('Sorry! Bid or Boo is only available in Canada');
      } else {
        this.autoSetGeoLocation(address);
      }
    }
  };

  successfullGeoCodingForDestination = (results, status) => {
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
        this.autoSetGeoLocationForDestinationAddress(address);
      }
    }
  };
  getDestinationAddress = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 5 * 60 * 1000,
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

        if (this.google && this.geocoder) {
          //https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
          this.geocoder.geocode(
            {
              location: { lat: parseFloat(pos.lat), lng: parseFloat(pos.lng) },
            },
            this.successfullGeoCodingForDestination,
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
      console.error('no html 5 geo location');
    }
  };
  getCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 5 * 60 * 1000,
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
      console.error('no html 5 geo location');
    }
  };
}

const EnhancedForms = withFormik({
  validationSchema: (props) => {
    return Yup.object().shape({
      templateId: Yup.string()
        .ensure()
        .trim()
        .oneOf(['bdbCarDetailing', 'bdbHouseCleaning', 'bdbPetSittingWalking', 'bdbMoving'])
        .required('Template Id missing or not recognized, This field is required'),
      jobTitle: Yup.string()
        .ensure()
        .trim()
        .min(5, 'your description must be more than 5 characters')
        .max(20, 'job title must be less than 20 characters')
        .required('Template Id missing or not recognized, This field is required'),
      startingDateAndTime: Yup.date()
        .min(moment(), '*Tasks Can not be scheduled in the past')
        .max(moment().add(30, 'd'), '*Tasks can only be scheduled a month in advance')
        .required('* Date Field is required'),
      timeOfDay: Yup.string()
        .ensure()
        .trim()
        .oneOf(
          ['morning', 'afternoon', 'evening', 'anytime'],
          '*Please select a value from the drop down',
        )
        .required('*Please select a value from the drop down'),
      detailedDescription: Yup.string()
        .ensure()
        .trim()
        .min(20, 'your description must be more than 20 characters')
        .max(500, 'job title must be less than 500 characters')
        .required('*Please provide a detailed description'),
      recaptchaField: Yup.string()
        .ensure()
        .trim()
        .required('require pass recaptcha.'),
      ...TASKS_DEFINITIONS[props.requestTemplateId].extraValidationSchema,
    });
  },
  validate: (values) => {
    let errors = {};
    const extrasValidations = TASKS_DEFINITIONS[values.templateId].extrasValidation;
    const requiresDestinationField = TASKS_DEFINITIONS[values.templateId].requiresDestinationField;

    // process the values to be sent to the server
    const {
      location,
      detailedDescription,
      startingDateAndTime,
      addressText,
      destinationText,
      templateId,
      timeOfDay,
      jobTitle,
    } = values;

    // do some validation before submitting
    if (!location || !location.lat || !location.lng) {
      errors.location = '*Please type in an address and select location from the drop down';
    }
    if (!addressText) {
      errors.addressText = '*Please type in an address then select an address from the drop down';
    }
    if (requiresDestinationField && !destinationText) {
      errors.destinationText =
        '*Please type in an address then select an address from the drop down';
    }
    if (!detailedDescription) {
      errors.detailedDescription =
        '*Please provide more details to help the tasker fulfill this request to yoru satisfaction';
    }
    if (!startingDateAndTime) {
      errors.startingDateAndTime = '*Please specify a date for when you need this service';
    }
    if (!templateId) {
      errors.templateId =
        'Sorry something went wrong at our end, we could not detect the Job ID . please try again later';
    }
    if (!timeOfDay || timeOfDay === 'noSelection') {
      errors.timeOfDay = '*Please select a value from the drop down';
    }

    if (!jobTitle) {
      errors.jobTitle = '*Please type in a title or nickname for this task';
    }

    if (extrasValidations) {
      errors = { ...errors, ...extrasValidations(values) };
    }

    return errors;
  },
  mapPropsToValues: (props) => {
    return {
      templateId: props.requestTemplateId,
      startingDateAndTime: '',
      detailedDescription: '',
      jobTitle: '',
      addressText: '',
      destinationText: '',
      timeOfDay: 'noSelection',
      location: { lat: 0, lng: 0 },
      recaptchaField: process.env.NODE_ENV === 'production' ? '' : 'development_test',
      ...TASKS_DEFINITIONS[props.requestTemplateId].defaultExtrasValues,
    };
  },
  handleSubmit: async (values, { setSubmitting, props }) => {
    const { postNewJob } = props;
    setSubmitting(true);

    // process the values to be sent to the server
    const {
      location,
      detailedDescription,
      startingDateAndTime,
      addressText,
      templateId,
      taskImg1,
      taskImg2,
      taskImg3,
      jobTitle,
      recaptchaField,
      ...extras // everything else
    } = values;

    let userUploadedImages = [];
    if (!!taskImg1) {
      userUploadedImages.push(taskImg1);
    }
    if (!!taskImg2) {
      userUploadedImages.push(taskImg2);
    }
    if (!!taskImg3) {
      userUploadedImages.push(taskImg3);
    }

    let finalImages = [];
    if (userUploadedImages.length > 0) {
      try {
        const { data: resultOfImageUpload } = await uploadTaskImages(userUploadedImages);
        if (
          resultOfImageUpload &&
          resultOfImageUpload.taskImages &&
          resultOfImageUpload.taskImages.length > 0
        ) {
          finalImages = resultOfImageUpload.taskImages;
        }
      } catch (e) {
        console.error('error uploading images');
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
      console.error('failed to create location');
    }

    let mappedFieldsToJobSchema = {
      detailedDescription,
      jobTitle,
      startingDateAndTime,
      addressText,
      templateId,
      extras: {
        ...extras,
      },
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    };

    if (finalImages) {
      mappedFieldsToJobSchema = {
        ...mappedFieldsToJobSchema,
        taskImages: finalImages,
      };
    }

    await postNewJob({ jobDetails: mappedFieldsToJobSchema, recaptchaField });

    setSubmitting(false);
  },
  displayName: 'GenericRequestForm',
});

export default EnhancedForms(GenericRequestForm);

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);

const ImageUploaderButton = ({ updateTaskThumbnails, fieldId }) => {
  const [thumb, setThumb] = useState(null);
  const [showUploader, setshowUploader] = useState(false);

  return (
    <div style={{ marginBottom: '2.25rem' }}>
      {showUploader && (
        <UploaderComponent
          thumb={thumb}
          shouldShow={showUploader}
          closeDialog={() => setshowUploader(false)}
          onDoneCropping={(thumb, actualblob) => {
            setThumb(thumb);
            setshowUploader(false);
            updateTaskThumbnails({ fieldId, fieldValue: actualblob });
          }}
        />
      )}
      <div
        style={{
          position: 'relative',
          height: 100,
          width: 200,
          background: '#eeeeee',
          border: thumb ? '' : '1px dashed #26ca70',
        }}
      >
        {thumb && (
          <img
            style={{
              height: 99,
              width: 200,
              border: 'none',
              objectFit: 'contain',
              border: '1px solid #eeeeee',
            }}
            onClick={() => setshowUploader(true)}
            src={thumb}
          />
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '0.5rem',
            height: 20,
          }}
        >
          <button
            style={{ height: 48 }}
            type="button"
            onClick={() => setshowUploader(true)}
            className="button is-success"
          >
            <span>
              <i className="fa fa-camera" aria-hidden="true" />
            </span>
          </button>
        </div>

        {thumb && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: '0.5rem',
              height: 20,
            }}
          >
            <button
              type="button"
              style={{ height: 48 }}
              onClick={() => {
                setThumb(null);
                updateTaskThumbnails({ fieldId, fieldValue: '' });
              }}
              className="button is-dark"
            >
              <span>
                <i className="far fa-trash-alt" aria-hidden="true" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const uploadTaskImages = (taskImages) => {
  if (taskImages && taskImages.length > 0) {
    let data = new FormData();

    taskImages &&
      taskImages.length > 0 &&
      taskImages.forEach((file, index) => {
        data.append('filesToUpload', file, `jobImages+${index}`);
      });
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };

    return axios.post(ROUTES.API.JOB.POST.jobImage, data, config);
  }
};
