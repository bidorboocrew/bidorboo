//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import autoBind from 'react-autobind';

import 'react-datepicker/dist/react-datepicker.css';

class CustomDateButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string,
  };
  render() {
    return (
      <a className="button is-info is-outlined" onClick={this.props.onClick}>
        <span className="icon">
          <i className="far fa-calendar-alt" />
        </span>
        <span>{this.props.value || 'Select Date'}</span>
      </a>
    );
  }
}

export default class DatePickerInput extends React.Component {
  static propTypes = {
    onChangeEvent: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  };
  static defaultProps = {
    value: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
    };
    autoBind(this, 'handleChange');
  }

  handleChange(date) {
    const dateWithTimeZone = moment.utc(date).toDate();

    this.setState({
      startDate: date,
    });
    this.props.onChangeEvent(dateWithTimeZone);
  }

  render() {
    return this.state.startDate ? (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
        locale="en-gb"
        minDate={moment()}
        maxDate={moment().add(6, 'month')}
        customInput={<CustomDateButton />}
        className="input is-overlay"
      />
    ) : (
      <DatePicker
        onChange={this.handleChange}
        locale="en-gb"
        minDate={moment()}
        maxDate={moment().add(6, 'month')}
        customInput={<CustomDateButton />}
        className="input is-overlay"
      />
    );
  }
}
