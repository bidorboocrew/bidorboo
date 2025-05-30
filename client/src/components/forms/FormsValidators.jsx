// import PlacesAutocomplete, {
//   geocodeByAddress,
//   // geocodeByPlaceId,
//   getLatLng
// } from 'react-places-autocomplete';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const requiredField = (value) => {
  return value && value.trim && value.trim() && value.length > 0
    ? undefined
    : 'this is a required field';
};

export const moreThan0lessThan250Chars = (value) => {
  return moreThanLessThan(value, 0, 250);
};

export const alphanumericField = (value) => {
  const isValid = value && /^[a-z\d\-_\s]+$/i.test(value.trim());
  return isValid;
};
export const AddressField = (value) => {
  const isValid = /^[a-z\d\-_\s\\,]+$/i.test(value.trim());
  return isValid
    ? undefined
    : 'field can not contain special characters. Example: Street,City,Postal Code,Country';
};

export const numericField = (value) => {
  const isValid = /^[0-9]*$/.test(value.trim());
  return isValid ? undefined : 'Field input must only use numbers.';
};

export const moreThan3LessThan25Chars = (value) => {
  return moreThanLessThan(value, 3, 25);
};

const moreThanLessThan = (value, lowerLimit, upperLimit) => {
  const isValid = value && value.trim() && value.length > lowerLimit && value.length <= upperLimit;
  return isValid;
};

export const enforceNumericField = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  return onlyNums;
};

export const phoneNumber = (value) => {
  if (!value) {
    return value;
  }
  // const isValid = /^[0-9]\d{2}\d{3}\d{4}$/g.test(value);
  const isValid = value && isValidPhoneNumber(value);
  return isValid;
};
