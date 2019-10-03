/**
/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on addressText change
 * make the addressText optional
 *
 */

import React from 'react';

import classNames from 'classnames';

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

  updateSearchRaduisSelection = (raduisKm) => {
    this.props.updateSearchLocationState({ searchRadius: raduisKm });
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
      console.log('no html 5 geo location');
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
    const { activeSearchParams, submitSearchLocationParams, toggleSideNav } = this.props;
    submitSearchLocationParams({
      ...activeSearchParams,
    });
    toggleSideNav();
  };

  render() {
    const { activeSearchParams, toggleSideNav, isLoggedIn } = this.props;
    const { addressText, latLng, searchRadius } = activeSearchParams;

    const disableSubmit = !addressText || !latLng || !latLng.lat || !latLng.lng || !searchRadius;

    return (
      <React.Fragment>
        <div
          style={{
            background: '#6b88e0',
            color: 'white',
            padding: '0.75rem 0.25rem',
            marginBottom: '0',
            fontSize: '1.5rem',
          }}
          onClick={toggleSideNav}
        >
          <span className="icon">
            <i className="fas fa-chevron-left" />
          </span>
          <span style={{ marginLeft: 8 }}>Filter Tasks</span>
        </div>

        <div className="theContent">
          <>
            <div style={{ padding: '0 0.5rem 0.5rem 0.5rem', fontWeight: 600 }}>
              Where will you provide your services?
            </div>
            <section style={{ padding: '0.5rem' }} className="modal-card-body">
              <div className="content">
                <div className="group">
                  <label className="label">Enter Address</label>
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
                  <React.Fragment>
                    <div>
                      <a
                        style={{ marginTop: 6, fontSize: 14 }}
                        onClick={this.autoDetectCurrentAddress}
                        className="is-small is-text"
                      >
                        <span className="icon">
                          <i className="fas fa-map-marker-alt" />
                        </span>
                        <span>Auto Detect</span>
                      </a>
                    </div>
                  </React.Fragment>
                </div>

                <SearchRadius
                  updateSearchRaduisSelection={this.updateSearchRaduisSelection}
                  searchRadiusValue={searchRadius}
                />
              </div>
            </section>
          </>
          {/* {isLoggedIn && (
            <>
              <div style={{ padding: '0.5rem' }}>
                <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  Should BidOrBoo Notify you When A New Task is Posted?
                </div>

                <input
                  id="newJobNotification"
                  type="checkbox"
                  name="newJobNotification"
                  className="switch is-rounded is-success"
                  onChange={this.toggleEnableNotifyMeAboutJobsInMyArea}
                  checked={this.state.enableNotifyMeAboutJobsInMyArea}
                />
                <label
                  className="has-text-dark has-text-weight-normal"
                  htmlFor="newJobNotification"
                >
                  {this.state.enableNotifyMeAboutJobsInMyArea
                    ? 'Yes, Notify Me'
                    : "No, Don't Notify Me"}
                </label>
              </div>
            </>
          )} */}

          <div className="has-text-centered">
            <button
              disabled={disableSubmit}
              style={{ width: 300 }}
              onClick={this.handleSubmit}
              className="button is-success"
            >
              <span className="icon">
                <i className="far fa-share-square" />
              </span>
              <span>{`${isLoggedIn ? 'Save & Apply' : 'Apply Search'}`}</span>
            </button>
          </div>
          <br />
          <div className="has-text-centered">
            <button style={{ width: 300 }} onClick={toggleSideNav} className="button is-light">
              <span className="icon">
                <i className="fas fa-chevron-left" />
              </span>
              <span>{`Discard & Close`}</span>
            </button>
          </div>
          <br />
        </div>
      </React.Fragment>
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
          <div>
            <input
              id={id}
              value={value}
              onBlur={onBlurEvent}
              {...getInputProps({
                type: 'text',
                placeholder: `${placeholder}`,
                className: 'input',
              })}
            />
          </div>
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
      <div className="group">
        <label className="label">Select Search Radius</label>
        <div className="buttons has-addons">
          <span
            style={{ borderRadius: 0 }}
            onClick={() => updateSearchRaduisSelection(25)}
            className={classNames('button ', {
              'is-info is-selected': searchRadiusValue === 25,
            })}
          >
            25km
          </span>
          <span
            onClick={() => updateSearchRaduisSelection(50)}
            className={classNames('button ', {
              'is-info is-selected': searchRadiusValue === 50,
            })}
          >
            50km
          </span>
          <span
            onClick={() => updateSearchRaduisSelection(100)}
            className={classNames('button ', {
              'is-info is-selected': searchRadiusValue === 100,
            })}
          >
            100km
          </span>
          <span
            style={{ borderRadius: 0 }}
            onClick={() => updateSearchRaduisSelection(150)}
            className={classNames('button ', {
              'is-info is-selected': searchRadiusValue === 150,
            })}
          >
            150km
          </span>
        </div>
      </div>
    );
  }
}
