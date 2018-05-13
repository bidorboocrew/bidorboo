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
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import classNames from 'classnames';
import { withFormik } from 'formik';
// import Yup from 'yup';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  GeoAddressInput,
  TextAreaInput,
  TextInput,
  DateInput,
  TimeInput
} from './FormsHelpers';
import moment from 'moment';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class SearchForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
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
      jobCategorySelection: {},
      searchRaduisSelection: 15
    };


    autoBind(
      this,
      'getCurrentAddress',
      'autoSetGeoLocation',
      'successfullGeoCoding',
      'clearForceSetAddressValue',
      'toggleJobCategorySelection',
      'updateSearchRaduisSelection'
    );

  }

  updateSearchRaduisSelection(raduisKm){
    this.setState({...this.state, searchRaduisSelection: raduisKm});
    this.props.values.searchRaduisField = raduisKm;

  }
  
  toggleJobCategorySelection(jobKey){
    let selectedJobState = this.state.jobCategorySelection[jobKey];
    if(selectedJobState){
      //button exists in our list
      // toggle its selection state
      selectedJobState = !selectedJobState.isActive
    } else {
      // first time to add the button . which means turn selection on
      selectedJobState = {isActive: true}
    }
    this.setState(()=>{
      return {...this.state, jobCategorySelection: {...this.state.jobCategorySelection, [jobKey]:selectedJobState}};
    }, ()=>{

      const existingSelectionsArray =
        Object.keys(this.state.jobCategorySelection);
      let selectedCategoryList = existingSelectionsArray && existingSelectionsArray.length > 0 ?
      existingSelectionsArray.filter((jobKey)=>{
        return this.state.jobCategorySelection[jobKey].isActive === true
      }) : [];
      debugger;
      // array of the selected jobs that we should filter based upon
      this.props.values.filterJobsByCategoryField = selectedCategoryList;
      
    }
   );

  }

  clearForceSetAddressValue(){
    this.setState({forceSetAddressValue: ''});
  }

  autoSetGeoLocation(addressText) {
    this.setState({forceSetAddressValue: addressText});
    this.props.values.geoInputField = addressText;
  }
  
  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      onCancel,
      isValid,
      isSubmitting,
      setFieldValue,
      resetForm
    } = this.props;


    const staticJobCategoryButtons = Object.keys(templatesRepo).map((key)=>{
      
      const isCategorySelected = this.state.jobCategorySelection[key];
      debugger;


      

      return (<span
        key={key}
        onClick={()=> this.toggleJobCategorySelection(key)}
        className={classNames('button',
        {'is-info is-selected': isCategorySelected && isCategorySelected.isActive})}>
        {templatesRepo[key].title}</span>)

    })


    const autoDetectCurrentLocation = navigator.geolocation ? (
      <React.Fragment>
        <span>
          <a
            style={{ fontSize: 14 }}
            onClick={this.getCurrentAddress}
            className="is-link"
          >
            Auto Detect
          </a>
        </span>
        <span style={{ fontSize: 12, color: 'grey' }}>
          {` or manually select an address from the drop down menu`}
        </span>
      </React.Fragment>
    ) : null;


    return (
      <form onSubmit={handleSubmit}>
     
        <input
          id="locationField"
          className="input is-invisible"
          type="hidden"
          value={values.locationField || ''}
        />
        
        <input
          id="searchRaduisField"
          className="input is-invisible"
          type="hidden"
          value={values.searchRaduisField || 15}
        />

        
        <input
          id="filterJobsByCategoryField"
          className="input is-invisible"
          type="hidden"
          value={values.filterJobsByCategoryField || []}
        />

        <GeoAddressInput
          id="geoInputField"
          type="text"
          forceSetAddressValue={this.state.forceSetAddressValue}
          helpText={'You must select an address from the drop down menu'}
          label="Search By Address"
          placeholder="specify your job address"
          autoDetectComponent={autoDetectCurrentLocation}
          error={touched.addressTextField && errors.addressTextField}
          onError={e => {
            errors.addressTextField = 'google api error ' + e;
          }}
          onChangeEvent={e => {
            this.clearForceSetAddressValue();
            setFieldValue('addressTextField', e, true);
            
          }}
          onBlurEvent={e => {
            if (e && e.target) {
              e.target.id = 'addressTextField';
              handleBlur(e);
            }
          }}
          handleSelect={address => {
            setFieldValue('addressTextField', address, true);
            geocodeByAddress(address)
              .then(results => getLatLng(results[0]))
              .then(latLng => {
                setFieldValue('locationField', latLng, false);
                
              })
              .catch(error => {
                errors.addressTextField = 'error getting lat lng ' + error;
                console.error('Error', error);
              });
          }}
        />
        <div className="field">
          <div className="buttons has-addons">
            <span className="button is-static">Search Raduis</span>
            <span 
            onClick={()=> this.updateSearchRaduisSelection(5)}
            className={classNames('button',
        {'is-info is-selected': this.state.searchRaduisSelection === 5})}>
            5km</span>
            <span 
            onClick={()=> this.updateSearchRaduisSelection(15)}
            className={classNames('button',
        {'is-info is-selected': this.state.searchRaduisSelection === 15})}>
            15km</span>
            <span 
            onClick={()=> this.updateSearchRaduisSelection(25)}
            className={classNames('button',
        {'is-info is-selected': this.state.searchRaduisSelection === 25})}>
            25km</span>
          </div>
        </div>


        <div className="field">
          <div className="buttons has-addons">
            <span className="button is-static">Filter By Category</span>
            {staticJobCategoryButtons}
          </div>
        </div>


        <div className="field">
          <button
            style={{ marginRight: 6 }}
            className="button is-primary is-meduim"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            search
          </button>
          <button
            className="button is-outlined is-meduim"
            disabled={isSubmitting}
            onClick={resetForm}
          >
            Reset
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
    if (status == this.google.maps.GeocoderStatus.OK) {
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
        enableHighAccuracy: true
      };
      const errorHandling = () => {
        console.error('can not auto detect address');
      };
      const successfulRetrieval = position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // update the field with the current position coordinates
        this.props.setFieldValue('addressTextField', pos, false);

        if (this.google && this.geocoder) {
          //https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
          this.geocoder.geocode(
            {
              location: { lat: parseFloat(pos.lat), lng: parseFloat(pos.lng) }
            },
            this.successfullGeoCoding
          );
        }
      };

      //get the current location
      navigator.geolocation.getCurrentPosition(
        successfulRetrieval,
        errorHandling,
        getCurrentPositionOptions
      );
    } else {
      // Browser doesn't support Geolocation
      // try the googlemap apis
      
    }
  }
}

const EnhancedForms = withFormik({
  initialValues:{
    searchRaduisField: '',
    filterJobsByCategoryField: [],
    geoInputField: 15
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    debugger;
    props.onSubmit(values);
    setSubmitting(false);
  },
  displayName: 'SearchForm'
});

export default EnhancedForms(SearchForm);
