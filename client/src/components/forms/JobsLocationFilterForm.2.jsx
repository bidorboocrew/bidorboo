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
    this.props.setFieldValue('searchRadiusField', raduisKm, false);
  }

  autoSetGeoLocation(addressText) {
    this.mount && this.props.setFieldValue('addressTextField', addressText, false);
  }

  // xxxx you can do bbetter
  componentDidUpdate(prevProps, prevState) {
    const { activeSearchParams } = this.props;
    const { values: currentValues } = prevProps;

    if (activeSearchParams.addressText !== this.state.forceSetAddressValue) {
      const nextPropsValues = {
        searchRadiusField:
          activeSearchParams && activeSearchParams.searchRadius ? activeSearchParams.searchRadius : '',
        locationField:
          activeSearchParams && activeSearchParams.location && activeSearchParams.location.coordinates
            ? {
                lat: activeSearchParams.location.coordinates[0],
                lng: activeSearchParams.location.coordinates[1],
              }
            : { lat: '', lng: '' },
        addressTextField:
          activeSearchParams && activeSearchParams.addressText ? activeSearchParams.addressText : '',
      };

      if (
        currentValues.searchRadiusField !== nextPropsValues.searchRadiusField ||
        currentValues.locationField.lat !== nextPropsValues.locationField.lat ||
        currentValues.locationField.lng !== nextPropsValues.locationField.lng ||
        currentValues.addressTextField !== nextPropsValues.addressTextField
      ) {
        this.setState(
          () => ({
            forceSetAddressValue: activeSearchParams.addressText,
          }),
          () => {
            this.props.setValues(nextPropsValues);
          },
        );
      }
    }
  }

  render() {
    const {
      values,
      errors,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setValues,
      resetForm,
      isSubmitting,
      dirty,
      touched,
    } = this.props;

    // const filteredJobsList = values.filterJobsByCategoryField;
    // const staticJobCategoryButtons = Object.keys(jobTemplateIdToDefinitionObjectMapper).map(
    //   (key) => {
    //     const isThisJobSelected = filteredJobsList && filteredJobsList.includes(key);

    //     return (
    //       <span
    //         key={key}
    //         onClick={() => this.toggleJobCategorySelection(key)}
    //         className={`button is-rounded is-small ${
    //           isThisJobSelected ? 'is-selected is-success ' : ''
    //         }`}
    //       >
    //         <span className="icon">
    //           <i className={`${jobTemplateIdToDefinitionObjectMapper[key].ICON}`} />
    //         </span>
    //         <span>{jobTemplateIdToDefinitionObjectMapper[key].TITLE}</span>
    //       </span>
    //     );
    //   },
    // );

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
          border: '1px solid lightgray',
          borderRadius: 4,
          padding: '1rem',
        }}
      >
        <input
          id="searchRadiusField"
          className="input is-invisible"
          type="hidden"
          value={values.searchRadiusField}
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
          <div style={{ flexGrow: 1 }}>
            <GeoAddressInput
              id="geoInputField"
              type="text"
              helpText={'You must select an address from the drop down menu'}
              label="Start by Entering an Adress where you want to provide your services"
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

          <div>
            <div style={{ marginLeft: '0.5rem' }} className="field">
              <label className="label">Search Radius</label>
              <div className="buttons has-addons">
                <span
                  onClick={() => this.updateSearchRaduisSelection(25)}
                  className={classNames('button ', {
                    'is-info is-selected': values.searchRadiusField === 25,
                  })}
                >
                  25km
                </span>
                <span
                  onClick={() => this.updateSearchRaduisSelection(50)}
                  className={classNames('button ', {
                    'is-info is-selected': values.searchRadiusField === 50,
                  })}
                >
                  50km
                </span>
                <span
                  onClick={() => this.updateSearchRaduisSelection(100)}
                  className={classNames('button ', {
                    'is-info is-selected': values.searchRadiusField === 100,
                  })}
                >
                  100km
                </span>
                <span
                  onClick={() => this.updateSearchRaduisSelection(150)}
                  className={classNames('button ', {
                    'is-info is-selected': values.searchRadiusField === 150,
                  })}
                >
                  150km
                </span>
                {/* <span
                  onClick={() => this.updateSearchRaduisSelection(200)}
                  className={classNames('button ', {
                    'is-info is-selected': values.searchRadiusField === 200,
                  })}
                >
                  200km
                </span> */}
              </div>
            </div>
          </div>
        </div>
        <div className="has-text-centered" style={{ marginTop: '1rem' }}>
          <button
            // disable={}
            type="submit"
            disabled={isSubmitting || !dirty || !touched}
            // style={{ marginRight: 6, marginTop: 8, width: 20 }}
            className="button is-success is-medium"
          >
            <span className="icon">
              <i className="fas fa-search" />
            </span>
            <span>Find Tasks</span>
          </button>
        </div>
        {/* <div style={{ padding: '0.5rem' }} className="field has-text-centered">
          <button
            type="submit"
            // style={{ marginRight: 6, marginTop: 8, width: 20 }}
            className="button is-success is-large"
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
              const nextValues = {
                searchRadiusField: '',
                filterJobsByCategoryField: [],
                geoInputField: '',
                addressTextField: '',
              };
              resetForm(nextValues);
            }}
          >
            <span className="icon">
              <i className="fas fa-ban" />
            </span>
            <span>Clear Filters</span>
          </button>
        </div> */}
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
    enableReinitialize: true,
    searchRadiusField: '',
    // filterJobsByCategoryField: ['bdbjob-house-cleaning'],
    addressTextField: '',
    locationField: { lng: '', lat: '' },
  },
  mapPropsToValues: ({ activeSearchParams }) => {
    //
    const x = {
      enableReinitialize: true,
      searchRadiusField:
        activeSearchParams && activeSearchParams.searchRadius ? activeSearchParams.searchRadius : '',
      locationField:
        activeSearchParams && activeSearchParams.location && activeSearchParams.location.coordinates
          ? {
              lat: activeSearchParams.location.coordinates[0],
              lng: activeSearchParams.location.coordinates[1],
            }
          : { lat: '', lng: '' },
      // filterJobsByCategoryField:
      //   activeSearchParams && activeSearchParams.selectedTemplateIds
      //     ? activeSearchParams.selectedTemplateIds
      //     : ['bdbjob-house-cleaning'],
      addressTextField:
        activeSearchParams && activeSearchParams.addressText ? activeSearchParams.addressText : '',
    };
    return x;
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'JobsLocationFilterForm',
});

export default EnhancedForms(JobsLocationFilterForm);
