/**
/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on addressText change
 * make the addressText optional
 *
 */

import React from 'react';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

// for reverse geocoding , get addressText from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

export default class BidderRootLocationFilter extends React.Component {
  constructor(props) {
    super(props);
    this.google = window.google;
    if (this.google) {
      this.geocoder = new this.google.maps.Geocoder();
    }
    this.state = {
      enableNotifyMeAboutJobsInMyArea: false,
    };
  }

  handleChange = (addressText, latLng) => {
    this.props.updateSearchLocationState({ addressText, latLng });
  };

  updateSearchRaduisSelection = (event) => {
    this.props.updateSearchLocationState({ searchRadius: event.target.value });
  };

  handleSelect = (addressText) => {
    if (addressText && addressText.length > 3) {
      geocodeByAddress(addressText)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          this.handleChange(addressText, latLng);
        })
        .catch(this.errorHandling);
    }
  };

  successfullGeoCoding = (results, status, pos) => {
    // xxx handle the various error (api over limit ...etc)
    if (status !== this.google.maps.GeocoderStatus.OK) {
      alert(status);
    }
    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status === this.google.maps.GeocoderStatus.OK) {
      let addressText = results[0].formatted_address;
      if (addressText && !addressText.toLowerCase().includes('canada')) {
        alert('Sorry! Bid or Boo is only available in Canada.');
      } else {
        this.handleChange(addressText, { ...pos });
      }
    }
  };

  successfulRetrieval = (position) => {
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
        (results, status) => {
          this.successfullGeoCoding(results, status, pos);
        },
      );
    }
  };

  autoDetectCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 10000,
        timeout: 5000,
        enableHighAccuracy: true,
      };

      //get the current location
      navigator.geolocation.getCurrentPosition(
        this.successfulRetrieval,
        this.errorHandling,
        getCurrentPositionOptions,
      );
    } else {
      console.error('no html 5 geo location');
    }
  };

  errorHandling = (err) => {
    console.error('can not auto detect address' + err);
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
    // alert(msg);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { activeSearchParams, submitSearchLocationParams } = this.props;
    submitSearchLocationParams({
      ...activeSearchParams,
    });
  };

  render() {
    const { activeSearchParams } = this.props;
    const { addressText, latLng, searchRadius } = activeSearchParams;

    const disableSubmit = !addressText || !latLng || !latLng.lat || !latLng.lng || !searchRadius;

    return (
      <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', textAlign: 'left' }}>
        <div style={{ width: 500, padding: 10 }}>
          <div>
            <label style={{ fontWeight: 400 }} className="label">
              Address
            </label>
            <GeoSearch
              value={addressText}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
              handleSelect={this.handleSelect}
              onError={this.errorHandling}
              placeholder="Start entering an adddress"
              forceSetAddressValue={addressText}
              id="filter-tasker-job"
            />

            <a
              style={{ marginTop: 6, fontSize: 14, color: 'white' }}
              onClick={this.autoDetectCurrentAddress}
              className="is-small is-text"
            >
              <span className="icon">
                <i className="fas fa-map-marker-alt" />
              </span>
              <span>Auto Detect</span>
            </a>
          </div>
        </div>
        <div style={{ width: 150, padding: 10 }}>
          <SearchRadius
            updateSearchRaduisSelection={this.updateSearchRaduisSelection}
            searchRadiusValue={searchRadius}
          />
        </div>
        <div style={{ padding: '10px 10px 20px 10px' }}>
          <div
            style={{
              display: '-webkit-box',
              display: '-webkit-flex',
              display: '-ms-flexbox',
              display: 'flex',
              alignItems: 'center',
              height: '90px',
              justifyContent: 'center',
            }}
          >
            <div disabled={disableSubmit} onClick={this.handleSubmit} className="button is-success">
              <span className="icon">
                <i className="fas fa-search" />
              </span>
              <span>{`Search`}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class GeoSearch extends React.Component {
  render() {
    const { handleSelect, onError, placeholder, id, onBlurEvent, onChange, value } = this.props;

    const inputField = ({ getInputProps, suggestions, getSuggestionItemProps }) => {
      const containerDropDownStyle =
        suggestions && suggestions.length > 0
          ? {
              backgroundColor: '#fff',
              borderRadius: '4px',
              boxShadow: '0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1)',
              paddingBottom: '.5rem',
              paddingTop: '.5rem',
            }
          : {};

      return (
        <div>
          <input
            id={id}
            value={value}
            onBlur={onBlurEvent}
            {...getInputProps({
              type: 'text',
              placeholder: `${placeholder}`,
              className: 'input',
              style: {
                fontWeight: 500,

                backgroundColor: 'white',
                borderLeft: 'unset',
                borderRight: 'unset',
                borderTop: 'unset',
                boxShadow: 'unset',
                borderRadius: 0,
              },
            })}
          />

          <div
            style={{ ...containerDropDownStyle }}
            role="menu"
            className="autocomplete-dropdown-container"
          >
            {suggestions.map((suggestion) => {
              const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? {
                    backgroundColor: '#3273dc',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '.875rem',
                    lineHeight: '1.5',
                    padding: '.375rem 1rem',
                  }
                : {
                    color: '#353535',
                    fontSize: '.875rem',
                    lineHeight: '1.5',
                    padding: '.375rem 1rem',
                    cursor: 'pointer',
                  };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      //xxx add US here
      <PlacesAutocomplete
        value={value}
        onChange={onChange}
        onBlur={onBlurEvent}
        onSelect={handleSelect}
        onError={onError}
        debounce={1000}
        searchOptions={{
          componentRestrictions: { country: 'CA' },
          types: ['address'],
        }}
      >
        {inputField}
      </PlacesAutocomplete>
    );
  }
}

class SearchRadius extends React.Component {
  render() {
    const { updateSearchRaduisSelection, searchRadiusValue } = this.props;
    return (
      <div style={{ marginBottom: 0 }} className="group">
        <label style={{ fontWeight: 400 }} className="label">
          Search Radius
        </label>
        <div>
          <div className="select">
            <select
              style={{
                padding: '0 6px',
              }}
              value={searchRadiusValue}
              onChange={updateSearchRaduisSelection}
              onBlur={updateSearchRaduisSelection}
            >
              <option value="25">{`25km`}</option>
              <option value="50">{`50km`}</option>
              <option value="100">{`100km`}</option>
              <option value="150">{`150km`}</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
