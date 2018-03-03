import React from 'react';

export const requiredField = value => {
  return value && value.trim() && value.length > 0
    ? undefined
    : 'this is a required field';
};
export const alphanumericField = value => {
  const isValid = RegExp(`^[a-zA-Z0-9_]*$`).test(value.trim());
  debugger;
  return isValid
    ? undefined
    : 'Username can not contain special charachters. Please only use letters and number';
};
export const numericField = value => {
  const isValid = RegExp(`^[0-9]*$`).test(value.trim());
  debugger;
  return isValid ? undefined : 'phone number can not include any charachters';
};

export const moreThan3LessThan15 = value => {
  const isValid =
    value && value.trim() && value.length > 3 && value.length < 15;
  return isValid
    ? undefined
    : 'Username must be more than 3 letters and less than 15.';
};

export const normalizePhone = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 3) {
      return onlyNums + '-';
    }
    if (onlyNums.length === 6) {
      return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3) + '-';
    }
  }
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  if (onlyNums.length <= 6) {
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
  }
  return (
    onlyNums.slice(0, 3) +
    '-' +
    onlyNums.slice(3, 6) +
    '-' +
    onlyNums.slice(6, 10)
  );
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
  meta: { touched, error }
}) => (
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
        className="input"
        type="text"
        placeholder={placeholderText}
      />
      {helpText && (
        <p style={{ color: 'grey' }} className="help">
          {helpText}
        </p>
      )}
      {touched && error && <p className="help is-danger">{error}</p>}
    </div>
  </div>
);
