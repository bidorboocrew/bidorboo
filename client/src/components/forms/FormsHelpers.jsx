import React from 'react';
import GeoSearch from '../GeoSearch';
import DatePickerInput from '../DatePickerInput';


const InputFeedback = ({ error }) =>
  error ? <p className="help is-danger">{error}</p> : null;

const Label = ({ error, className, children, id, ...props }) => {
  return (
    <label htmlFor={id} className="label" {...props}>
      {children}
    </label>
  );
};

const HelpText = ({ helpText }) =>
  helpText ? (
    <p style={{ color: 'grey' }} className="help">
      {helpText}
    </p>
  ) : null;

export const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  helpText,
  ...props
}) => {
  return (
    <div className="field">
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <input
        id={id}
        className="input"
        type={type}
        value={value || ''}
        onChange={onChange}
        {...props}
      />
      <HelpText helpText={helpText} />
      <InputFeedback error={error} />
    </div>
  );
};

export const TextAreaInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  helpText,
  ...props
}) => {
  return (
    <div className="field">
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <textarea
        style={{ resize: 'none', fontSize: 16, padding: 10, height: 'unset' }}
        className="input textarea"
        id={id}
        type={type}
        value={value || ''}
        onChange={onChange}
        {...props}
      />

      <HelpText helpText={helpText} />
      <InputFeedback error={error} />
    </div>
  );
};

export const GeoAddressInput = ({
  id,
  label,
  value,
  helpText,
  onError,
  error,
  handleSelect,
  placeholder,
  onChangeEvent,
  onBlurEvent
}) => {
  return (
    <div className="field">
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <GeoSearch
        id={id}
        value={value}
        onError={onError}
        placeholder={placeholder}
        handleSelect={handleSelect}
        onChangeEvent={onChangeEvent}
        onBlurEvent={onBlurEvent}
      />
      <HelpText helpText={helpText} />
      <InputFeedback error={error} />
    </div>
  );
};



export const DateInput = ({
  id,
  label,
  value,
  helpText,
  onError,
  error,
  handleSelect,
  placeholder,
  onChangeEvent,
  onBlurEvent
}) => {
  return (
    <div className="field">
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <DatePickerInput
        id={id}
        value={value}
        onError={onError}
        placeholder={placeholder}
        handleSelect={handleSelect}
        onChangeEvent={onChangeEvent}
        onBlurEvent={onBlurEvent}
      />
      <HelpText helpText={helpText} />
      <InputFeedback error={error} />
    </div>
  );
};
