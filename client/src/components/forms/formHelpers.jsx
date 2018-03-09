import React from 'react';

export const requiredField = value => {
  return value && value.trim() && value.length > 0
    ? undefined
    : 'this is a required field';
};

export const moreThan0lessThan250Chars = value => {
  return moreThanLessThan(value, 0, 250);
};

export const alphanumericField = value => {
  const isValid = value && /^[a-z\d\-_\s]+$/i.test(value.trim());
  return isValid
    ? undefined
    : 'field can not contain special charachters. Please only use letters and number';
};
export const AddressField = value => {
  const isValid = /^[a-z\d\-_\s\\,]+$/i.test(value.trim());
  return isValid
    ? undefined
    : 'field can not contain special charachters. Example: Street,City,Postal Code,Country';
};

export const numericField = value => {
  const isValid = /^[0-9]*$/.test(value.trim());
  return isValid ? undefined : 'Field input must only use numbers.';
};

export const moreThan3LessThan25Chars = value => {
  return moreThanLessThan(value, 3, 25);
};

const moreThanLessThan = (value, lowerLimit, upperLimit) => {
  const isValid =
    value &&
    value.trim() &&
    value.length > lowerLimit &&
    value.length <= upperLimit;
  return isValid
    ? undefined
    : `input must be more than ${lowerLimit} letters and less than ${upperLimit}.`;
};

export const enforceNumericField = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
 return onlyNums;
};

export const phoneNumber = value => {
  return RegExp(`^(+0?1s)?(?d{3})?[s.-]d{3}[s.-]d{4}$`).test(value)
    ? undefined
    : 'should match +areacode-123-1234-1234';
};
export const renderFormTextField = ({
  input,
  label,
  type,
  helpText,
  placeholderText,
  meta: { touched, error },
  charsLimit
}) => {
  let remainingChars = charsLimit - (input ? input.value.length : 0);
  return (
    <div className="field">
      <label
        style={{ color: 'grey', fontSize: 14, fontWeight: '400' }}
        className="label"
      >
        {label}
      </label>
      <div className="control">
        <input
          {...input}
          style={{ fontSize: 16, padding: 10, height: 'unset' }}
          className="input"
          type="text"
          placeholder={placeholderText}
        />
        {helpText && (
          <p style={{ color: 'grey' }} className="help">
            {helpText}
          </p>
        )}
        {charsLimit &&
          remainingChars < charsLimit &&
          (remainingChars >= 0 ? (
            <p style={{ color: 'grey' }} className="help">
              {`${remainingChars} remaining charachters`}
            </p>
          ) : (
            <p style={{ color: '#ff3860' }} className="help">
              {`${Math.abs(remainingChars)} over the limit`}
            </p>
          ))}
        {touched && error && <p className="help is-danger">{error}</p>}
      </div>
    </div>
  );
};

export const renderAddressFormField = ({
  input,
  label,
  type,
  helpText,
  placeholderText,
  change,
  meta: { touched, error },
  charsLimit
}) => {
  let remainingChars = charsLimit - (input ? input.value.length : 0);
  return (
    <div className="field">
      <label
        style={{ color: 'grey', fontSize: 14, fontWeight: '400' }}
        className="label"
      >
        {label}
      </label>
      <div className="control">
        <input
          {...input}
          style={{ fontSize: 16, padding: 10, height: 'unset' }}
          className="input"
          type="text"
          placeholder={placeholderText}
        />

        <div>
          <span style={{ color: 'grey' }}>
            <p className="help">
              {'Example: Street,City,Postal Code,Country '}
            </p>
          </span>
          {navigator &&
            navigator.geolocation && (
              <span>
                <a
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    const locationFoundsuccessfully = loc => {
                      if (loc && loc.coords) {
                        const geocoder = new window.google.maps.Geocoder();
                        const latlng = {
                          lat: loc.coords.latitude,
                          lng: loc.coords.longitude
                        };
                        geocoder.geocode(
                          { location: latlng },
                          (results, status) => {
                            if (status === 'OK') {
                              if (results[0]) {
                                change(
                                  'addressField',
                                  results[0].formatted_address
                                );
                              } else {
                                change('addressField', 'No results found');
                              }
                            } else {
                              console.error(
                                'Geocoder failed due to: ' + status
                              );
                            }
                          }
                        );
                      }
                    };
                    const locationError = e => {
                      console.error('failed to get location ' + e);
                    };
                    const options = {
                      enableHighAccuracy: true,
                      timeout: 5000,
                      maximumAge: 0
                    };
                    // https://github.com/erikras/redux-form/issues/369
                    // https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
                    navigator.geolocation.getCurrentPosition(
                      locationFoundsuccessfully,
                      locationError,
                      options
                    );
                  }}
                >
                  or Use Current Location
                </a>
              </span>
            )}
        </div>

        {helpText && (
          <p style={{ color: 'grey' }} className="help">
            {helpText}
          </p>
        )}
        {charsLimit &&
          (remainingChars >= 0 ? (
            <p style={{ color: 'grey' }} className="help">
              {`${remainingChars} remaining charachters`}
            </p>
          ) : (
            <p style={{ color: '#ff3860' }} className="help">
              {`${Math.abs(remainingChars)} over the limit`}
            </p>
          ))}
        {touched && error && <p className="help is-danger">{error}</p>}
      </div>
    </div>
  );
};

export const renderFormParagraphField = ({
  input,
  label,
  type,
  helpText,
  placeholderText,
  meta: { touched, error },
  charsLimit
}) => {
  let remainingChars =
    charsLimit - (this.textInput ? this.textInput.value.length : 0);
  return (
    <div className="field">
      <label
        style={{ color: 'grey', fontSize: 14, fontWeight: '400' }}
        className="label"
      >
        {label}
      </label>
      <div className="control">
        <textarea
          {...input}
          style={{ resize: 'none', fontSize: 16, padding: 10, height: 'unset' }}
          ref={textInput => {
            this.textInput = textInput;
          }}
          className="input"
          type="text"
          placeholder={placeholderText}
        />
        {helpText && (
          <p style={{ color: 'grey' }} className="help">
            {helpText}
          </p>
        )}
        {charsLimit &&
          (remainingChars >= 0 ? (
            <p style={{ color: 'grey' }} className="help">
              {`${remainingChars} remaining charachters`}
            </p>
          ) : (
            <p style={{ color: '#ff3860' }} className="help">
              {`${Math.abs(remainingChars)} over the limit`}
            </p>
          ))}
        {touched && error && <p className="help is-danger">{error}</p>}
      </div>
    </div>
  );
};
