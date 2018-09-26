//xxx TODO said
// on blur must be propagated to the calling form
// Limit boundary of search into canada and usa only
import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import PlacesAutocomplete from 'react-places-autocomplete';

class GeoSearch extends React.Component {
  static propTypes = {
    handleSelect: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onChangeEvent: PropTypes.func.isRequired,
    onBlurEvent: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    autoSetValue: PropTypes.string
  };
  static defaultProps = {
    placeholder: '',
    value: ''
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
      forceSetAddressValue
    } = this.props;

    const inputField = ({
      getInputProps,
      suggestions,
      getSuggestionItemProps
    }) => {
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
          <div className="control has-icons-left">
            <input
              id={id}
              onBlur={onBlurEvent}
              {...getInputProps({
                type: 'text',
                placeholder: `${placeholder}`,
                className: 'location-search-input input'
              })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-globe" />
            </span>
          </div>
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
          types: ['address']
        }}
      >
        {inputField}
      </PlacesAutocomplete>
    );
  }
}

export default GeoSearch;
