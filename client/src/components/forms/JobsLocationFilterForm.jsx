/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import { withFormik } from 'formik';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GeoAddressInput } from './FormsHelpers';

import jobIdToDefinitionObjectMapper from '../../bdb-tasks/jobIdToDefinitionObjectMapper';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class JobsLocationFilterForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.google = window.google;
    const googleObj = this.google;
    if (this.google) {
      this.geocoder = new googleObj.maps.Geocoder();
    }
    this.state = {
      forceSetAddressValue: '',
    };

    autoBind(
      this,
      'getCurrentAddress',
      'autoSetGeoLocation',
      'successfullGeoCoding',
      'toggleJobCategorySelection',
      'updateSearchRaduisSelection',
    );
  }
  componentDidMount() {
    this.mount = true;
  }

  componentWillUnmount() {
    this.mount = false;
  }
  updateSearchRaduisSelection(raduisKm) {
    this.props.setFieldValue('searchRaduisField', raduisKm, false);
  }

  toggleJobCategorySelection(jobKey) {
    let listOfAllSelectedJobs = this.props.values.filterJobsByCategoryField;

    let indexOfSelectedJob = listOfAllSelectedJobs.indexOf(jobKey);

    if (indexOfSelectedJob > -1) {
      listOfAllSelectedJobs.splice(indexOfSelectedJob, 1);
    } else {
      listOfAllSelectedJobs.push(jobKey);
    }
    // array of the selected jobs that we should filter based upon
    this.props.setFieldValue('filterJobsByCategoryField', listOfAllSelectedJobs, false);
  }

  autoSetGeoLocation(addressText) {
    this.mount && this.setState({ forceSetAddressValue: addressText });
    // update the form field with the current position coordinates
    this.props.setFieldValue('addressTextField', addressText, false);
  }

  shouldComponentUpdate() {
    return !!this.props.values;
  }

  render() {
    const {
      values,
      touched,
      errors,
      handleBlur,
      handleSubmit,
      setFieldValue,
      resetForm,
    } = this.props;

    const filteredJobsList = values.filterJobsByCategoryField;
    const staticJobCategoryButtons = Object.keys(jobIdToDefinitionObjectMapper).map((key) => {
      const isThisJobSelected = filteredJobsList && filteredJobsList.includes(key);

      return (
        <span
          key={key}
          onClick={() => this.toggleJobCategorySelection(key)}
          className={classNames('button ', {
            'is-info is-selected': isThisJobSelected,
          })}
        >
          {jobIdToDefinitionObjectMapper[key].TITLE}
        </span>
      );
    });

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

    return (
      <form
        style={{
          padding: '1rem',
          backgroundColor: '#eee',
          height: '100%',
        }}
        onSubmit={handleSubmit}
      >
        <input
          id="searchRaduisField"
          className="input is-invisible"
          type="hidden"
          value={values.searchRaduisField}
        />

        <input
          id="filterJobsByCategoryField"
          className="input is-invisible"
          type="hidden"
          value={values.filterJobsByCategoryField}
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

        <GeoAddressInput
          id="geoInputField"
          type="text"
          helpText={'You must select an address from the drop down menu'}
          label="Service Address"
          placeholder="specify your task address"
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
            console.log(`onChangeEvent={(e) => ${address}`);
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
        <div className="field">
          <label className="label">Search Raduis</label>

          <div className="buttons has-addons">
            <span
              onClick={() => this.updateSearchRaduisSelection(15)}
              className={classNames('button ', {
                'is-info is-selected': values.searchRaduisField === 15,
              })}
            >
              15km
            </span>
            <span
              onClick={() => this.updateSearchRaduisSelection(25)}
              className={classNames('button ', {
                'is-info is-selected': values.searchRaduisField === 25,
              })}
            >
              25km
            </span>
            <span
              onClick={() => this.updateSearchRaduisSelection(50)}
              className={classNames('button ', {
                'is-info is-selected': values.searchRaduisField === 50,
              })}
            >
              50km
            </span>
            <span
              onClick={() => this.updateSearchRaduisSelection(100)}
              className={classNames('button ', {
                'is-info is-selected': values.searchRaduisField === 100,
              })}
            >
              100km
            </span>
          </div>
        </div>
        <br />
        <div className="field">
          <label className="label">Select Categories</label>

          <div className="buttons has-addons">{staticJobCategoryButtons}</div>
        </div>

        <br />
        <div className="field has-text-centered">
          <button
            style={{ marginRight: 6, marginTop: 8, width: 150 }}
            className="button is-link "
            type="submit"
          >
            <span className="icon">
              <i className="fas fa-filter" />
            </span>
            <span>Apply</span>
          </button>
          <button
            style={{ marginRight: 8, marginTop: 8, width: 150 }}
            type="button"
            className="button is-outlined is-link"
            onClick={() => {
              //xxx saeed yo ucan do better . th reset func should auto clear all these fields
              resetForm();
              setFieldValue('locationField', '', false);
              setFieldValue('searchRaduisField', '', false);
              setFieldValue('filterJobsByCategoryField', [], false);
              this.props.onCancel && this.props.onCancel();
            }}
          >
            <span className="icon">
              <i className="fas fa-ban" />
            </span>
            <span>Clear All Filters</span>
          </button>
        </div>
        <div className="field has-text-centered">
          <button
            style={{ marginRight: 6, marginTop: 24, width: 300 }}
            type="button"
            className="button is-outline"
            onClick={() => {
              //xxx saeed yo ucan do better . th reset func should auto clear all these fields
              this.props.onCancel && this.props.onCancel();
            }}
          >
            <span className="icon">
              <i className="far fa-times-circle" />
            </span>
            <span>Close Filter Panel</span>
          </button>
        </div>
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
      if (address && !address.toLowerCase().includes('canada')) {
        alert('Sorry! Bid or Boo is only available in Canada.');
      } else {
        this.autoSetGeoLocation(address);
      }
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

        // update the field with the current position coordinates
        this.props.setFieldValue('locationField', pos, false);

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
      // Browser doesn't support Geolocation
      // try the googlemap apis
      console.log('Browser doesnt support geolcoation');
    }
  }
}

const EnhancedForms = withFormik({
  initialValues: {
    searchRaduisField: '',
    filterJobsByCategoryField: [],
    geoInputField: '',
  },
  mapPropsToValues: (props) => {
    return {
      searchRaduisField: '',
      filterJobsByCategoryField: [],
      geoInputField: '',
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'JobsLocationFilterForm',
});

export default EnhancedForms(JobsLocationFilterForm);
