//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import autoBind from 'react-autobind';

import 'react-datepicker/dist/react-datepicker.css';

class CustomTimeButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string,
  };

  render() {
    return (
      <a className="button is-info is-outlined" onClick={this.props.onClick}>
        <span className="icon">
          <i className="far fa-clock" />
        </span>
        <span>{this.props.value || 'Select Time'}</span>
      </a>
    );
  }
}

export default class TimePickerInput extends React.Component {
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
    const dateString = date.format('hh:mm a');
    this.setState({
      startDate: date,
    });
    this.props.onChangeEvent(dateString);
  }

  render() {
    return this.state.startDate ? (
      <DatePicker
        inline
        selected={this.state.startDate}
        onChange={this.handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        dateFormat="h:mm a"
        timeCaption="time"
        customInput={<CustomTimeButton />}
        className="input is-overlay"
      />
    ) : (
      <DatePicker
        inline
        onChange={this.handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        dateFormat="h:mm a"
        timeCaption="time"
        customInput={<CustomTimeButton />}
        className="input is-overlay"
      />
    );
  }
}
