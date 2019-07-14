//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

export default class DatePickerInput extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  };
  static defaultProps = {
    value: '',
  };

  constructor(props) {
    super(props);
    this.minDate = moment().add(1, 'day');
    this.state = {
      selectedDate: null,
    };
  }

  handleChange = (date) => {
    const dateWithTimeZone = moment.utc(date);
    this.setState({
      selectedDate: dateWithTimeZone,
    });
    this.props.onChangeEvent(dateWithTimeZone.toISOString());
  };

  render() {
    const { label, error, helpText, iconLeft } = this.props;
    let labelClass = 'withPlaceholder';
    let inputClassName = 'input';

    if (error) {
      inputClassName += ' is-danger';
    }
    if (iconLeft) {
      inputClassName += ' has-icons-left';
    }

    if (selectedDate) {
      labelClass += ' hasSelectedValue';
    }
    const { selectedDate } = this.state;

    return (
      <div className="group">
        <DatePicker
          className={inputClassName}
          selected={selectedDate}
          onChange={this.handleChange}
          minDate={this.minDate}
          maxDate={moment().add(30, 'd')}
          disabledKeyboardNavigation
          placeholderText="Select a date..."
          dateFormat={'D/MMMM/YYYY'}
        />
        <label
          style={{
            top: -16,
            zIndex: 9,
            color: `${selectedDate ? '#2196f3' : '#424242'}`,
            fontSize: 14,
          }}
          className={labelClass}
        >
          {label}
        </label>
        <span className="highlight" />
        <span className={`bar ${error ? 'is-danger' : ''}`} />
        {helpText ? <p className="help">{helpText}</p> : null}
        {error ? <p className="help is-danger">{error}</p> : null}
      </div>
    );
  }
}
