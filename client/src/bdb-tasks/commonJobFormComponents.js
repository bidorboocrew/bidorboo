import React from 'react';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { GeoAddressInput, TextAreaInput, DateInput } from '../components/forms/FormsHelpers';

export function toggleConfirmationDialog() {
  const { isLoggedIn, showLoginDialog } = this.props;
  if (!isLoggedIn) {
    showLoginDialog(true);
    return;
  }
  this.setState({
    showConfirmationDialog: !this.state.showConfirmationDialog,
  });
}

export function autoSetGeoLocation(addressText) {
  this.setState(() => ({ forceSetAddressValue: addressText }));
  // update the form field with the current position coordinates
  this.props.setFieldValue('addressTextField', addressText, false);
}

export function autoDetectLocationIfPermitted() {
  const { currentUserDetails } = this.props;
  // xxx do not do that automatically it will scare people
  if (
    currentUserDetails &&
    currentUserDetails.autoDetectlocation &&
    navigator &&
    navigator.geolocation
  ) {
    this.getCurrentAddress();
  }
}

export function getCurrentAddress() {
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
}

export function insertTemplateText() {
  const existingText = this.props.values.detailedDescriptionField
    ? `${this.props.values.detailedDescriptionField}\n`
    : '';

  this.props.setFieldValue(
    'detailedDescriptionField',
    `${existingText}${this.props.suggestedDetailsText}`,
    true,
  );
}

export function selectTimeButton(selectionId) {
  const { setFieldValue, values } = this.props;
  let selectedTimeValue = 17;

  switch (selectionId) {
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

  this.setState({ selectedTimeButtonId: selectionId }, () => {
    setFieldValue('timeField', selectedTimeValue, false);
    const newAdjustedTimeVal = moment(values.dateField)
      .set({ hour: selectedTimeValue, minute: 0, second: 0, millisecond: 0 })
      .toISOString();

    setFieldValue('dateField', newAdjustedTimeVal, false);
  });
}

export function updateDateInputFieldValue(val) {
  const { setFieldValue, values } = this.props;

  const adjustedTimeVal = moment(val)
    .set({ hour: values.timeField, minute: 0, second: 0, millisecond: 0 })
    .toISOString();

  setFieldValue('dateField', adjustedTimeVal, false);
}

export function setupGoogleAndGeoCoder() {
  this.google = window.google;
  if (this.google) {
    this.geocoder = new this.google.maps.Geocoder();
  }
}

export function shouldShowAutodetectControl() {
  return (
    navigator.geolocation && (
      <React.Fragment>
        <div>
          <a
            style={{ marginTop: 6, fontSize: 14 }}
            onClick={this.getCurrentAddress}
            className="button is-small is-info is-outlined"
          >
            <span className="icon">
              <i className="fas fa-map-marker-alt" />
            </span>
            <span>Auto Detect My Address</span>
          </a>
        </div>
      </React.Fragment>
    )
  );
}

export function RenderDateAndTimeField() {
  const { selectedTimeButtonId } = this.state;
  const { values } = this.props;

  return (
    <React.Fragment>
      <input id="dateField" className="input is-invisible" type="hidden" value={values.dateField} />
      <input
        id="timeField"
        className="input is-invisible"
        type="hidden"
        value={values.timeField || 5}
      />
      <DateInput
        id="DateInputField"
        type="text"
        label="When do you want it done?"
        onChangeEvent={this.updateDateInputFieldValue}
      />
      <div className="buttons">
        <span
          style={{ width: 100 }}
          onClick={() => this.selectTimeButton('morning')}
          className={`button is-info ${selectedTimeButtonId === 'morning' ? '' : 'is-outlined'}`}
        >
          Morning
        </span>
        <span
          style={{ width: 100 }}
          onClick={() => this.selectTimeButton('afternoon')}
          className={`button is-info ${selectedTimeButtonId === 'afternoon' ? '' : 'is-outlined'}`}
        >
          Afternoon
        </span>
        <span
          style={{ width: 100 }}
          onClick={() => this.selectTimeButton('evening')}
          className={`button is-info ${selectedTimeButtonId === 'evening' ? '' : 'is-outlined'}`}
        >
          Evening
        </span>
        <span
          style={{ width: 100 }}
          onClick={() => this.selectTimeButton('anytime')}
          className={`button is-info ${selectedTimeButtonId === 'anytime' ? '' : 'is-outlined'}`}
        >
          Anytime
        </span>
      </div>
    </React.Fragment>
  );
}

export function RenderLocationField() {
  const { values, touched, errors, handleBlur, setFieldValue } = this.props;

  return (
    <React.Fragment>
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

      <GeoAddressInput
        id="geoInputField"
        type="text"
        helpText={'You must select an address from the drop down menu'}
        label="What's the address where you need cleaning?"
        placeholder="Enter your request's address"
        autoDetectComponent={this.shouldShowAutodetectControl()}
        error={touched.addressTextField && errors.addressTextField}
        value={values.addressTextField || ''}
        onError={(e) => {
          errors.addressTextField = 'google api error ' + e;
        }}
        onChangeEvent={(e) => {
          setFieldValue('addressTextField', e, true);
        }}
        onBlurEvent={(e) => {
          if (e && e.target) {
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
    </React.Fragment>
  );
}

export function RenderDetailedDescriptionField() {
  const { values, touched, errors, handleBlur, handleChange } = this.props;

  return (
    <TextAreaInput
      id="detailedDescriptionField"
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
          <span>Answer FAQs</span>
        </a>
      }
      placeholder={this.props.suggestedDetailsText}
      error={touched.detailedDescriptionField && errors.detailedDescriptionField}
      value={values.detailedDescriptionField || ''}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export function RenderFormActionButtons() {
  const { onGoBack, isValid, isSubmitting } = this.props;
  return (
    <React.Fragment>
      <div className="field">
        <button
          style={{ width: 120 }}
          type="button"
          className="button is-outlined is-medium"
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            onGoBack(e);
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
          <span className="icon">
            <i className="fas fa-bullseye" />
          </span>
          <span>Preview</span>
        </button>
      </div>
    </React.Fragment>
  );
}

export function renderEffortField(effort) {
  const { values } = this.props;
  const { selectedEffortButtonId } = this.state;

  return (
    <React.Fragment>
      <input
        id="effortField"
        className="input is-invisible"
        type="hidden"
        value={values.effortField || effort.small}
      />
      <div className="field">
        <label className="label">How big is this job</label>
        <div className="buttons">
          <span
            style={{ width: 160 }}
            onClick={() => this.selectEffortLevel(effort.small)}
            className={`button is-info ${
              selectedEffortButtonId === effort.small ? '' : 'is-outlined'
            }`}
          >
            {effort.small}
          </span>
          <span
            style={{ width: 160 }}
            onClick={() => this.selectEffortLevel(effort.medium)}
            className={`button is-info ${
              selectedEffortButtonId === effort.medium ? '' : 'is-outlined'
            }`}
          >
            {effort.medium}
          </span>
          <span
            style={{ width: 160 }}
            onClick={() => this.selectEffortLevel(effort.large)}
            className={`button is-info ${
              selectedEffortButtonId === effort.large ? '' : 'is-outlined'
            }`}
          >
            {effort.large}
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}

export function selectEffortLevel(selectedEffort) {
  const { setFieldValue } = this.props;

  this.setState({ selectedEffortButtonId: selectedEffort }, () => {
    setFieldValue('effortField', selectedEffort, false);
  });
}
