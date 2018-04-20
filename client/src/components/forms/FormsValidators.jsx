// import PlacesAutocomplete, {
//   geocodeByAddress,
//   // geocodeByPlaceId,
//   getLatLng
// } from 'react-places-autocomplete';


export const requiredField = value => {
  return value && value.trim && value.trim() && value.length > 0
    ? undefined
    : 'this is a required field';
};

export const moreThan0lessThan250Chars = value => {
  return moreThanLessThan(value, 0, 250);
};

export const alphanumericField = value => {
  const isValid = value && /^[a-z\d\-_\s]+$/i.test(value.trim());
  console.log(isValid);
  return isValid;
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
  return isValid;
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
