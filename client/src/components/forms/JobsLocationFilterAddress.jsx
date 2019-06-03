/**
/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ReactDOM from 'react-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import autoBind from 'react-autobind';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

export default class JobsLocationFilterAddress extends React.Component {
  constructor(props) {
    super(props);
    this.google = window.google;
    if (this.google) {
      this.geocoder = new this.google.maps.Geocoder();
    }
    this.state = {
      showModal: false,
      address: '',
      latLng: { lat: '', lng: '' },
      searchRadius: 50,
      lastKnownSearchFromState: {
        ...this.props.lastKnownSearch,
      },
    };
  }
  // xxx one of the shittiest piece of code I have got eventually unwind this hsit
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.lastKnownSearch) {
      const { addressText, location, searchRadius } = nextProps.lastKnownSearch;
      const { lastKnownSearchFromState } = prevState;
      const {
        addressText: addressTextFromState,
        location: locationFromState,
        searchRadius: searchRadiusFromState,
      } = lastKnownSearchFromState;
      if (
        searchRadius !== lastKnownSearchFromState.searchRadius ||
        addressText !== lastKnownSearchFromState.addressText ||
        (location &&
          location.coordinates &&
          locationFromState &&
          locationFromState.coordinates &&
          location.coordinates[1] !== locationFromState.coordinates[1]) ||
        (location &&
          location.coordinates &&
          locationFromState &&
          locationFromState.coordinates &&
          location.coordinates[0] !== locationFromState.coordinates[0])
      ) {
        return {
          lastKnownSearchFromState: { ...nextProps.lastKnownSearch },
          address: addressText,
          latLng: { lat: location.coordinates[1], lng: location.coordinates[0] },
          searchRadius: searchRadius,
        };
      }
    }
    return null;
  }
  handleChange = (address, latLng) => {
    this.setState({ address, latLng });
  };

  updateSearchRaduisSelection = (raduisKm) => {
    this.setState({ searchRadius: raduisKm });
  };
  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.handleChange(address, latLng);
      })
      .catch(this.errorHandling);
  };

  successfullGeoCoding = (results, status, pos) => {
    // xxx handle the various error (api over limit ...etc)
    if (status !== this.google.maps.GeocoderStatus.OK) {
      alert(status);
    }
    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status === this.google.maps.GeocoderStatus.OK) {
      let address = results[0].formatted_address;
      if (address && !address.toLowerCase().includes('canada')) {
        alert('Sorry! Bid or Boo is only available in Canada.');
      } else {
        this.handleChange(address, { ...pos });
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
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  handleSubmit(e) {
    e.preventDefault();
    const { address, latLng, searchRadius } = this.state;

    this.props.submitSearchLocationParams({ address, latLng, searchRadius });
    this.toggleModal();
  }
  render() {
    const { showModal, address, latLng, searchRadius } = this.state;
    const disableSubmit = !address || !latLng || !latLng.lat || !latLng.lng || !searchRadius;

    return (
      <React.Fragment>
        {showModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Search By Address</div>
                  <button onClick={this.toggleModal} className="delete" aria-label="close" />
                </header>
                <section style={{ padding: '1rem 0.5rem' }} className="modal-card-body">
                  <div className="content">
                    <div className="field">
                      <label className="label">
                        Where are you planning to provide your services?
                      </label>
                      <GeoSearch
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        handleSelect={this.handleSelect}
                        onError={() => alert('error')}
                        onChangeEvent={this.handleSelect}
                        onBlurEvent={this.handleSelect}
                        placeholder="Start entering an adddress"
                        forceSetAddressValue={address}
                        id="filter-tasker-job"
                      />
                      <React.Fragment>
                        <div>
                          <a
                            style={{ marginTop: 6, fontSize: 14 }}
                            onClick={this.autoDetectCurrentAddress}
                            className="button is-small is-info is-outlined"
                          >
                            <span className="icon">
                              <i className="fas fa-map-marker-alt" />
                            </span>
                            <span>Auto Detect My Address</span>
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
                <footer className="modal-card-foot">
                  <button
                    disabled={disableSubmit}
                    onClick={this.handleSubmit}
                    className="button is-success"
                  >
                    <span>Submit Search</span>
                  </button>
                  <button type="submit" onClick={this.toggleModal} className="button">
                    <span>Cancel</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <a onClick={this.toggleModal} className="button is-link">
          {`${address ? `within ${searchRadius}km of ${address}` : 'Choose Area Of Service'}`}
        </a>
      </React.Fragment>
    );
  }
}

class GeoSearch extends React.Component {
  static propTypes = {
    handleSelect: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onChangeEvent: PropTypes.func.isRequired,
    onBlurEvent: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    autoSetValue: PropTypes.string,
  };
  static defaultProps = {
    placeholder: '',
    value: '',
  };
  constructor(props) {
    super(props);
    this.state = { address: props.value };
    autoBind(this, 'updateField');
  }

  updateField(address) {
    this.setState({ address });
    this.props.onChangeEvent(address);
  }

  render() {
    const {
      handleSelect,
      onError,
      placeholder,
      id,
      onBlurEvent,
      forceSetAddressValue,
      value,
    } = this.props;

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
          <div className="control">
            <input
              id={id}
              value={value}
              onBlur={onBlurEvent}
              {...getInputProps({
                type: 'text',
                placeholder: `${placeholder}`,
                className: 'location-search-input input',
              })}
            />
            {/* <span className="icon is-small is-left">
              <i className="fab fa-canadian-maple-leaf" />
            </span> */}
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
                    color: '#4a4a4a',
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
        value={forceSetAddressValue ? forceSetAddressValue : this.state.address}
        onChange={this.updateField}
        onBlur={onBlurEvent}
        onSelect={handleSelect}
        onError={onError}
        debounce={750}
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
      <div className="field">
        <label className="label">Search Radius</label>
        <div className="buttons has-addons">
          <span
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
