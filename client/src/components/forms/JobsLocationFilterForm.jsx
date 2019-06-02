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
import { withFormik, Form } from 'formik';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GeoAddressInput } from './FormsHelpers';

import jobTemplateIdToDefinitionObjectMapper from '../../bdb-tasks/jobTemplateIdToDefinitionObjectMapper';

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
    const staticJobCategoryButtons = Object.keys(jobTemplateIdToDefinitionObjectMapper).map(
      (key) => {
        const isThisJobSelected = filteredJobsList && filteredJobsList.includes(key);

        return (
          <span
            key={key}
            onClick={() => this.toggleJobCategorySelection(key)}
            className={classNames('button ', {
              'is-info is-selected': isThisJobSelected,
            })}
          >
            <span className="icon">
              <i className={`${jobTemplateIdToDefinitionObjectMapper[key].ICON}`} />
            </span>
            <span>{jobTemplateIdToDefinitionObjectMapper[key].TITLE}</span>
          </span>
        );
      },
    );

    const autoDetectCurrentLocation = () => {
      return navigator.geolocation ? (
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
      ) : (
        <div>
          <span>Manually input an address and select it from the drop down menu</span>
        </div>
      );
    };

    return (
      <Form
        style={{
          backgroundColor: '#eee',
        }}
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
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flexGrow: 1, padding: '0.5rem' }}>
            <GeoAddressInput
              id="geoInputField"
              type="text"
              helpText={'You must select an address from the drop down menu'}
              label="Enter Your City, or an address near you"
              placeholder="start typing an address..."
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
          </div>

          <div style={{ padding: '0.5rem' }}>
            <div className="field">
              <label className="label">Search Radius</label>
              <div className="buttons has-addons">
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
                <span
                  onClick={() => this.updateSearchRaduisSelection(150)}
                  className={classNames('button ', {
                    'is-info is-selected': values.searchRaduisField === 150,
                  })}
                >
                  150km
                </span>
                <span
                  onClick={() => this.updateSearchRaduisSelection(150)}
                  className={classNames('button ', {
                    'is-info is-selected': values.searchRaduisField === 150,
                  })}
                >
                  200km
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0.5rem' }}>
          <label className="label">Select the services you can do</label>
          <div className="buttons has-addons">{staticJobCategoryButtons}</div>
        </div>

        <div style={{ padding: '0.5rem' }} className="field has-text-centered">
          <button
            type="submit"
            style={{ marginRight: 6, marginTop: 8, width: 150 }}
            className="button is-link "
          >
            <span className="icon">
              <i className="fas fa-search" />
            </span>
            <span>Search</span>
          </button>
          <button
            style={{ marginTop: 8, width: 150 }}
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
            <span>Clear Filters</span>
          </button>
        </div>
      </Form>
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
    addressTextField: '',
  },
  mapPropsToValues: ({ searchParams }) => {
    return {
      searchRaduisField:
        searchParams && searchParams.searchRaduisField ? searchParams.searchRaduisField : '',
      geoInputField: searchParams && searchParams.geoInputField ? searchParams.geoInputField : '',
      filterJobsByCategoryField:
        searchParams && searchParams.filterJobsByCategoryField
          ? searchParams.filterJobsByCategoryField
          : [],
      addressTextField:
        searchParams && searchParams.addressTextField ? searchParams.addressTextField : '',
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'JobsLocationFilterForm',
});

export default EnhancedForms(JobsLocationFilterForm);
