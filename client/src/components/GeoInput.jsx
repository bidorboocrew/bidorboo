import React from 'react';

import PlacesAutocomplete, {
  geocodeByAddress,
  // geocodeByPlaceId,
  getLatLng
} from 'react-places-autocomplete';

class GeoInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }
  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => {
          //copied drop down menu from bulmaIO
          console.log(suggestions);
          const containerDropDownStyle =
            suggestions && suggestions.length > 0
              ? {
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  boxShadow:
                    '0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1)',
                  paddingBottom: '.5rem',
                  paddingTop: '.5rem'
                }
              : {};
          return (
            <div>
              <input
                {...getInputProps({
                  type: 'text',
                  placeholder: 'Search Places ...',
                  className: 'location-search-input input'
                })}
              />
              <div
                style={{ ...containerDropDownStyle }}
                role="menu"
                className="autocomplete-dropdown-container"
              >
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? {
                        backgroundColor: '#3273dc',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '.875rem',
                        lineHeight: '1.5',
                        padding: '.375rem 1rem'
                      }
                    : {
                        color: '#4a4a4a',
                        fontSize: '.875rem',
                        lineHeight: '1.5',
                        padding: '.375rem 1rem',
                        cursor: 'pointer'
                      };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </PlacesAutocomplete>
    );
  }
}

export default GeoInput;
