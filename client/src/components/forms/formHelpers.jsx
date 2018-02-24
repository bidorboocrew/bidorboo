import React from 'react';

export const renderFormField = ({
  input,
  label,
  type,
  id,
  meta: { touched, error }
}) => {
  return (
    <div className="input-field">
      <label htmlFor={id}>{label}</label>
      <div className="form-field">
        <input {...input} type={type} />
        {touched && error && <span className="form-error">{error}</span>}
      </div>
    </div>
  );
};
