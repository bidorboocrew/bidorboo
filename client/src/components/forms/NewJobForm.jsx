/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';

import autoBind from 'react-autobind';

import { withFormik } from 'formik';

import * as Yup from 'yup';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  GeoAddressInput,
  TextAreaInput,
  TextInput,
  DateInput,
  TimeInput,
  Checkbox,
  HelpText,
} from './FormsHelpers';
import moment from 'moment';

import { alphanumericField } from './FormsValidators';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class NewJobForm extends React.Component {
  constructor(props) {
    super(props);

    this.google = window.google;
    const googleObj = this.google;
    if (this.google) {
      this.geocoder = new googleObj.maps.Geocoder();
    }
    this.state = {
      forceSetAddressValue: '',
      isFlexibleTimeSelected: false,
    };

    autoBind(
      this,
      'getCurrentAddress',
      'autoSetGeoLocation',
      'successfullGeoCoding',
      'handleFlexibleTimeChecked',
    );
  }

  componentDidMount() {
    navigator.geolocation && this.getCurrentAddress();
  }
  handleFlexibleTimeChecked() {
    this.setState({ isFlexibleTimeSelected: !this.state.isFlexibleTimeSelected });
  }

  autoSetGeoLocation(addressText) {
    this.setState(() => ({ forceSetAddressValue: addressText }));
    // update the form field with the current position coordinates
    this.props.setFieldValue('addressTextField', addressText, false);
  }

  render() {
    const {
      fromTemplateIdField,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      onGoBack,
      isValid,
      isSubmitting,
      setFieldValue,
    } = this.props;
    const autoDetectCurrentLocation = navigator.geolocation ? (
      <React.Fragment>
        <span>
          <a style={{ fontSize: 14 }} onClick={this.getCurrentAddress} className="is-link">
            Auto Detect
          </a>
        </span>
        <span style={{ fontSize: 12, color: 'grey' }}>
          {` or manually select an address from the drop down menu`}
        </span>
      </React.Fragment>
    ) : null;

    //get an initial title from the job title
    values.fromTemplateIdField = fromTemplateIdField;
    return (
      <form onSubmit={handleSubmit}>
        {/* <TextInput
          id="jobTitleField"
          className="input"
          type="text"
          helpText="customize your job title"
          error={touched.jobTitleField && errors.jobTitleField}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.jobTitleField || ''}
        /> */}
        <input
          id="fromTemplateIdField"
          className="input is-invisible"
          type="hidden"
          value={values.fromTemplateIdField || fromTemplateIdField}
        />
        <input
          id="addressTextField"
          className="input is-invisible"
          type="hidden"
          value={values.addressTextField || ''}
        />
        <input
          id="locationField"
          className="input is-invisible"
          type="hidden"
          value={values.locationField || ''}
        />
        <input
          id="dateField"
          className="input is-invisible"
          type="hidden"
          value={values.dateField || moment().toDate()}
        />
        <DateInput
          id="DateInputField"
          type="text"
          label="Service Start Date"
          onChangeEvent={(val) => {
            setFieldValue('dateField', val, false);
          }}
        />
        <input
          id="timeField"
          className="input is-invisible"
          type="hidden"
          value={values.timeField || ''}
        />

        {/* <Checkbox
          type="checkbox"
          className="flexibleTimeCheckbox"
          label="Flexibe Time"
          checked={this.state.isFlexibleTimeSelected}
          onChange={this.handleFlexibleTimeChecked}
        /> */}
        <TimeInput
          id="TimeInputField"
          label="Approximate Start time"
          onChangeEvent={(val) => {
            setFieldValue('timeField', val, false);
          }}
        />

        <TextInput
          id="durationOfJobField"
          type="text"
          helpText="for example : not sure, 1 hour , 1 day"
          label="Service Duration"
          error={touched.durationOfJobField && errors.durationOfJobField}
          value={values.durationOfJobField}
          onChange={handleChange}
          onBlur={handleBlur}
          iconLeft="far fa-clock"
        />

        <GeoAddressInput
          id="geoInputField"
          type="text"
          helpText={'You must select an address from the drop down menu'}
          label="Service Address"
          placeholder="specify your job address"
          autoDetectComponent={autoDetectCurrentLocation}
          error={touched.addressTextField && errors.addressTextField}
          value={values.addressTextField || ''}
          onError={(e) => {
            errors.addressTextField = 'google api error ' + e;
          }}
          onChangeEvent={(e) => {
            console.log(`onChangeEvent={(e) => ${e}`);
            setFieldValue('addressTextField', e, true);
          }}
          onBlurEvent={(e) => {
            if (e && e.target) {
              console.log(`onChangeEvent={(e) => ${e}`);
              e.target.id = 'addressTextField';
              handleBlur(e);
            }
          }}
          handleSelect={(address) => {
            setFieldValue('addressTextField', address, false);
            geocodeByAddress(address)
              .then((results) => getLatLng(results[0]))
              .then((latLng) => {
                setFieldValue('locationField', latLng, false);
                console.log('Success', latLng);
              })
              .catch((error) => {
                errors.addressTextField = 'error getting lat lng ' + error;
                console.error('Error', error);
              });
          }}
        />

        <TextAreaInput
          id="detailedDescriptionField"
          type="text"
          label="Detailed Description"
          placeholder={'Please supply job details and your expectations'}
          error={touched.detailedDescriptionField && errors.detailedDescriptionField}
          value={values.detailedDescriptionField || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div className="field">
          <button
            style={{ borderRadius: 0 }}
            type="button"
            className="button is-outlined is-medium"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              onGoBack(e);
            }}
          >
            Back
          </button>
          <button
            style={{ borderRadius: 0, marginLeft: '1rem' }}
            className={`button is-primary is-medium  ${isSubmitting ? 'is-loading' : ''}`}
            type="submit"
            disabled={isSubmitting || !isValid}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(values, { ...this.props });
            }}
          >
            Post it!
          </button>
        </div>
        <HelpText helpText={`BidOrBoo Fairness and Safety rules:`} />
        <HelpText helpText={`*Once you post you will not be able to edit.`} />
        <HelpText helpText={`*Bidders will only see an approximate location.`} />
        <HelpText
          helpText={`*Upon awarding a bidder you will get their contact info and finalize the details.`}
        />
      </form>
    );
  }

  successfullGeoCoding(results, status) {
    // xxx handle the various error (api over limit ...etc)
    if (status !== this.google.maps.GeocoderStatus.OK) {
      alert(status);
    }
    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status === this.google.maps.GeocoderStatus.OK) {
      var address = results[0].formatted_address;
      this.autoSetGeoLocation(address);
    }
  }
  getCurrentAddress() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 10000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      const errorHandling = () => {
        console.error('can not auto detect address');
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
  }
}

const EnhancedForms = withFormik({
  mapPropsToValues: (props) => {
    return {
      hoursField: 1,
      minutesField: 0,
      periodField: 'PM',
      detailedDescriptionField: props.suggestedDetailsText,
      fromTemplateIdField: props.fromTemplateIdField,
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    // https://stackoverflow.com/questions/32540667/moment-js-utc-to-local-time
    // var x = moment.utc(values.dateField).format('YYYY-MM-DD HH:mm:ss');
    // var y = moment.utc("2018-04-19T19:29:45.000Z").local().format('YYYY-MM-DD HH:mm:ss');;
    props.onNext(values);
  },
  displayName: 'NewJobForm',
});

export default EnhancedForms(NewJobForm);
