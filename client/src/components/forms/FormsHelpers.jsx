import React from 'react';
import GeoSearch from './GeoSearch';
import DatePickerInput from '../forms/DatePickerInput';

// import moment from 'moment';
import TimePickerInput from '../forms/TimePickerInput';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';

const InputFeedback = ({ error }) =>
  error ? (
    <div style={{ fontWeight: 500 }} className="help is-danger">
      {error}
    </div>
  ) : null;

const Label = ({ error, labelClassName, children, id, ...props }) => {
  return (
    <label htmlFor={id} className={labelClassName || 'label'} {...props}>
      {children}
    </label>
  );
};

export const HelpText = ({ helpText }) => {
  if (typeof helpText === 'string') {
    return <p className="help">{helpText}</p>;
  }
  if (typeof helpText === 'function') {
    return helpText();
  }
  return null;
};

export const Checkbox = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  helpText,
  iconLeft,
  touched,
  ...props
}) => {
  let inputClassName = className || 'checkbox';

  if (error) {
    inputClassName += ' is-danger';
  }

  return (
    <div className="group">
      <div className={`group ${touched && id && touched[id] && error ? 'isError' : ''}`}>
        <Label htmlFor={id} error={error}>
          {label}
        </Label>
        <div>
          <input
            id={id}
            className={inputClassName}
            type={type}
            value={value || ''}
            onChange={onChange}
            {...props}
          />
        </div>
      </div>
    </div>
  );
};

export const PhoneNumberInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  labelClassName,
  helpText,
  iconLeft,
  touched,
  setFocusImmediately,
  placeholder,
  suggestButton,
  onBlur,
  ...props
}) => {
  let inputClassName = className || 'input';
  let labelClass = '';

  if (error) {
    inputClassName += ' is-danger';
  }
  if (iconLeft) {
    inputClassName += ' has-icons-left';
  }
  if (placeholder) {
    labelClass += ' withPlaceholder';
  }
  if (value) {
    labelClass += ' hasSelectedValue';
  }

  return (
    <div className={`group ${touched && id && touched[id] && error ? 'isError' : ''}`}>
      <label className={labelClass}>{label}</label>

      <div>
        <PhoneInput
          id={id}
          className={inputClassName}
          type={type}
          value={value || ''}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
      </div>

      {!error && <HelpText helpText={helpText} />}
      {error && <InputFeedback error={error} />}
    </div>
  );
};

export const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  labelClassName,
  helpText,
  iconLeft,
  touched,
  setFocusImmediately,
  placeholder,
  suggestButton,
  extraStyle = {},
  ...props
}) => {
  let inputClassName = className || 'input';
  let labelClass = '';

  if (error) {
    inputClassName += ' is-danger';
  }
  if (iconLeft) {
    inputClassName += ' has-icons-left';
  }
  if (placeholder) {
    labelClass += ' withPlaceholder';
  }
  if (value) {
    labelClass += ' hasSelectedValue';
  }

  return (
    <div
      style={{ ...extraStyle }}
      className={`group ${touched && id && touched[id] && error ? 'isError' : ''}`}
    >
      <label className={labelClass}>{label}</label>

      <div>
        <input
          autoFocus={setFocusImmediately}
          id={id}
          className={inputClassName}
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      </div>
      <HelpText helpText={helpText} />
      {suggestButton && suggestButton}
      {error && <InputFeedback error={error} />}
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
  labelClassName,
  helpText,
  touched,
  iconLeft,
  setFocusImmediately,
  placeholder,
  startWithTemplateButton,
  textAreaStyle = {},
  ...props
}) => {
  let inputStateClass = '';

  if (error) {
    inputStateClass = 'is-danger';
  }

  if (value && value.length > 0) {
    inputStateClass = 'hasSelectedValue';
  }
  return (
    <div className={`group ${error ? 'isError' : ''}`}>
      <label className={inputStateClass}>{label}</label>
      {startWithTemplateButton && startWithTemplateButton}
      <div>
        <textarea
          style={{ resize: 'none', height: 'unset', minHeight: 150, ...textAreaStyle }}
          className={`input ${inputStateClass} ${iconLeft ? 'has-icon-left' : ''}`}
          id={id}
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      </div>
      <HelpText helpText={helpText} />
      {error && <InputFeedback error={error} />}
    </div>
  );
};

export const DateInput = ({ ...props }) => {
  return <DatePickerInput {...props} />;
};

export const TimeInput = ({ label, onChangeEvent }) => {
  return (
    <div className="group">
      <Label>{label}</Label>
      <TimePickerInput onChangeEvent={onChangeEvent} />
    </div>
  );
};

export class GeoAddressInput extends React.Component {
  render() {
    const {
      id,
      onError,
      handleSelect,
      placeholder,
      onChangeEvent,
      onBlurEvent,
      value,
    } = this.props;

    return (
      <GeoSearch
        id={id}
        onError={onError}
        placeholder={placeholder}
        handleSelect={handleSelect}
        onChangeEvent={onChangeEvent}
        onBlurEvent={onBlurEvent}
        forceSetAddressValue={value}
        {...this.props}
      />
    );
  }
}
