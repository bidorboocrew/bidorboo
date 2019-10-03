//xxx TODO said
// on blur must be propagated to the calling form
// Limit boundary of search into canada and usa only
import React from 'react';
import autoBind from 'react-autobind';

import PlacesAutocomplete from 'react-places-autocomplete';

class GeoSearch extends React.Component {
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
      onBlurEvent,
      forceSetAddressValue,
      id,
      label,
      helpText,
      error,
      touched,
      autoDetectComponent,
      value = '',
    } = this.props;

    let inputState = '';
    if (value && value.length > 0) {
      inputState = 'hasSelectedValue';
    }
    if (touched && error) {
      inputState = 'is-danger';
    }

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
        <div className={`group ${touched && error ? 'isError' : ''}`}>
          <label className={inputState}>{label}</label>
          <div>
            <input
              id={id}
              onBlur={onBlurEvent}
              {...getInputProps({
                type: 'text',
                placeholder: `${placeholder}`,
                className: `input ${inputState}`,
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
          {autoDetectComponent && autoDetectComponent(value)}
          {!autoDetectComponent && helpText && <p className="help">{helpText}</p>}
          {touched && error && (
            <div style={{ fontWeight: 500 }} className="help is-danger">
              {error}
            </div>
          )}
        </div>
      );
    };

    return (
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

export default GeoSearch;
