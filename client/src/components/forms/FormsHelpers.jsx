import React from 'react';
import GeoSearch from '../GeoSearch';
import DatePickerInput from '../DatePickerInput';
// import moment from 'moment';

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
  iconLeft,
  ...props
}) => {
  return (
    <div className="field">
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      {!iconLeft && (
        <input
          id={id}
          className="input"
          type={type}
          value={value || ''}
          onChange={onChange}
          {...props}
        />
      )}
      {iconLeft && (
        <div className="field">
          <div className="control has-icons-left">
            <input
              id={id}
              className="input"
              type={type}
              value={value || ''}
              onChange={onChange}
              {...props}
            />
            <span className="icon is-small is-left">
              <i className={iconLeft} />
            </span>
          </div>
        </div>
      )}
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

export const TimeInput = ({ id, label, helpText, error, onChange, onBlur }) => {
  return (
    <div className="field">
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <div className="control">
        <div className="select is-info">
          <select
            onChange={e => {
              e.target.id = id;
              onChange(e);
            }}
            onBlur={e => {
              e.target.id = id;
              onBlur(e);
            }}
            style={{ marginRight: 6 }}
          >
            <option>hh</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>
        <div className="select is-info">
          <select
            onChange={e => {
              e.target.id = id;
              onChange(e);
            }}
            onBlur={e => {
              e.target.id = id;
              onBlur(e);
            }}
            style={{ marginRight: 6 }}
          >
            <option>mm</option>
            <option>00</option>
            <option>15</option>
            <option>30</option>
            <option>45</option>
          </select>
        </div>
        <div
          onChange={e => {
            e.target.id = id;
            onChange(e);
          }}
          onBlur={e => {
            e.target.id = id;
            onBlur(e);
          }}
          className="select is-info"
        >
          <select>
            <option>pp</option>
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
      </div>
      <HelpText helpText={helpText} />
      <InputFeedback error={error} />
    </div>
  );
};
