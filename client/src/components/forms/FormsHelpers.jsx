import React from 'react';
import GeoSearch from './GeoSearch';
import DatePickerInput from '../forms/DatePickerInput';
// import moment from 'moment';
import TimePickerInput from '../forms/TimePickerInput';

const InputFeedback = ({ error }) => (error ? <p className="help is-danger">{error}</p> : null);

const Label = ({ error, labelClassName, children, id, ...props }) => {
  return (
    <label htmlFor={id} className={labelClassName || 'label'} {...props}>
      {children}
    </label>
  );
};

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);

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
  ...props
}) => {
  let inputClassName = className || 'checkbox';

  if (error) {
    inputClassName += ' is-danger';
  }

  return (
    <div className="group saidTest">
      <div className="group">
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
  setFocusImmediately,
  placeholder,
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
    <div className="group">
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
  labelClassName,
  helpText,
  iconLeft,
  setFocusImmediately,
  placeholder,
  startWithTemplateButton,
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
      <div>
        <textarea
          style={{ resize: 'none', height: 'unset', minHeight: 100 }}
          className={`input ${inputStateClass} ${iconLeft ? 'has-icon-left' : ''}`}
          id={id}
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {startWithTemplateButton && startWithTemplateButton}
      <InputFeedback error={error} />
      <HelpText helpText={helpText} />
    </div>
  );
};

export const DateInput = ({ ...props }) => {
  return <DatePickerInput {...props} />;
};

export const TimeInput = ({ label, onChangeEvent }) => {
  return (
    <div className="group saidTest">
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
