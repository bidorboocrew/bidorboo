/**
/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on addressText change
 * make the addressText optional
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import * as A from '../../app-state/actionTypes';

import TASKS_DEFINITIONS from '../../bdb-tasks/tasksDefinitions';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

// for reverse geocoding , get addressText from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code
class TaskerRootLocationFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { addressField: '' || props.addressText };
    this.google = window.google;
    if (this.google) {
      this.geocoder = new this.google.maps.Geocoder();
    }
  }

  handleChange = (addressText, latLng, withSearch = false) => {
    this.props.updateSearchLocationState({ addressText, latLng }, withSearch);
  };

  updateSearchRaduisSelection = (event) => {
    this.props.updateSearchLocationState({ searchRadius: event.target.value });
  };
  updateTaskTypesFilter = (taskTypes) => {
    this.props.updateSearchLocationState({ tasksTypeFilter: taskTypes });
  };

  handleSelect = (addressText) => {
    if (addressText && addressText.length > 3) {
      geocodeByAddress(addressText)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          this.handleChange(addressText, latLng, true);
        })
        .catch(this.errorHandling);
    }
  };

  successfullGeoCoding = (results, status, pos) => {
    // xxx handle the various error (api over limit ...etc)
    if (status !== this.google.maps.GeocoderStatus.OK) {
      this.props.dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: 'Google Geocoding failed ' + status,
          },
        },
      });
    }
    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status === this.google.maps.GeocoderStatus.OK) {
      let addressText = results[0].formatted_address;
      if (addressText && !addressText.toLowerCase().includes('canada')) {
        this.props.dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'warn',
              msg: 'Sorry! BidOrBoo is currently available in Canada. We will be expanding soon.',
            },
          },
        });
      } else {
        this.handleChange(addressText, { ...pos }, true);
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
      this.props.dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: 'no geocoding support on ur device, please use manual input',
          },
        },
      });
    }
  };

  errorHandling = (err) => {
    console.error('can not auto detect address' + err);
    let msg = '';
    if (err.code === 3) {
      // Timed out
      msg = "Can't get your location (high accuracy attempt). ";
    }
    if (err.code === 1) {
      // Access denied by user
      msg =
        'PERMISSION_DENIED - You have not given BidOrBoo permission to detect your address. Please go to your browser settings and enable auto detect location for bidorboo.ca';
    } else if (err.code === 2) {
      // Position unavailable
      msg = 'POSITION_UNAVAILABLE';
    } else {
      // Unknown error
      msg = ', msg = ' + err.message;
    }
    this.props.dispatch({
      type: A.UI_ACTIONS.SHOW_TOAST_MSG,
      payload: {
        toastDetails: {
          type: 'error',
          msg,
        },
      },
    });
  };

  render() {
    const { activeSearchParams, renderSubscribeToSearchResults } = this.props;
    const { addressText, latLng, searchRadius, tasksTypeFilter } = activeSearchParams;

    const disableSubmit = !addressText || !latLng || !latLng.lat || !latLng.lng || !searchRadius;

    return (
      <div style={{ height: 'unset', boxShadow: 'none' }} className="card nofixedwidth">
        <div className="card-content">
          <div className="container">
            <div className="content has-text-left">
              <div className="group">
                <label style={{ fontWeight: 400 }} className="label">
                  Street Address
                </label>
                <GeoSearch
                  value={addressText}
                  onChange={this.handleChange}
                  onSelect={this.handleSelect}
                  handleSelect={this.handleSelect}
                  onError={this.errorHandling}
                  placeholder="Enter an address, e.g 123 Bank st"
                  forceSetAddressValue={addressText}
                  id="filter-tasker-request"
                />
                <a
                  style={{ marginTop: 6, fontSize: 14, color: '#ce1bbf' }}
                  onClick={this.autoDetectCurrentAddress}
                  className="is-small is-text"
                >
                  <span className="icon">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                  <span>Auto Detect</span>
                </a>
              </div>
              <div className="group">
                <SearchRadius
                  updateSearchRaduisSelection={this.updateSearchRaduisSelection}
                  searchRadiusValue={searchRadius}
                />
              </div>

              <TaskTypeFilter
                updateTaskTypesFilter={this.updateTaskTypesFilter}
                currentFilters={tasksTypeFilter}
              ></TaskTypeFilter>
              {/*
              <div>
                <button
                  disableSubmit={disableSubmit}
                  onClick={this.handleSubmit}
                  className="button is-success"
                >
                  <span className="icon">
                    <i className="fas fa-search" />
                  </span>
                  <span>{`Search`}</span>
                </button>
              </div> */}

              {renderSubscribeToSearchResults && renderSubscribeToSearchResults()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, null)(TaskerRootLocationFilter);

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
          <div style={{ width: 100 }} className="select">
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

class TaskTypeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { taskTypesIds: {} };
  }

  createTaskFilterButtonTags = () => {
    const { currentFilters } = this.props;

    const filterButtons = Object.keys(TASKS_DEFINITIONS)
      .filter((key) => !TASKS_DEFINITIONS[key].isComingSoon)
      .map((key) => {
        const isSelected = currentFilters.indexOf(key) > -1;
        // let controlClass = `tag is-rounded ${taskTypesIds[key] ? 'is-link' : ''}`;
        let controlClass = `button is-small ${isSelected && 'is-info'}`;
        return (
          <span
            style={{
              cursor: 'pointer',
              minWidth: 165,
            }}
            key={`key-${key}`}
            onClick={(e) => {
              e.preventDefault();

              const { updateTaskTypesFilter } = this.props;
              let currentActiveFilters = [...currentFilters];

              if (currentActiveFilters.indexOf(key) > -1) {
                if (currentActiveFilters && Object.keys(currentActiveFilters).length === 1) {
                  alert('One service type filter must be selected.');
                } else {
                  currentActiveFilters.splice(currentActiveFilters.indexOf(key), 1);
                }
              } else {
                currentActiveFilters.push(key);
              }
              updateTaskTypesFilter(currentActiveFilters);
            }}
            style={{
              borderRadius: 25,
              margin: '4px 8px 0 0',
              boxShadow: isSelected
                ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
                : 'none',
            }}
            className={controlClass}
          >
            {isSelected && (
              <span className="icon">
                <i className="far fa-check-circle"></i>
              </span>
            )}
            {!isSelected && (
              <span className="icon">
                <i className="far fa-circle"></i>
              </span>
            )}

            <span>{TASKS_DEFINITIONS[key].TITLE}</span>
          </span>
        );
      });
    return filterButtons;
  };

  render() {
    const listOfTasks = this.createTaskFilterButtonTags();
    return (
      <div style={{ marginBottom: '2.5rem' }} className="has-text-left">
        <div className="group">
          <label className="label">Filter by service type</label>
          <div className="tags are-medium">{listOfTasks}</div>
        </div>
      </div>
    );
  }
}
