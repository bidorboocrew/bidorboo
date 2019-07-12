//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

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
    const { selectedDate } = this.state;
    const myInput = (
      <button style={{ color: '#0a8fd1' }} className="button is-info">
        <span className="icon">
          <i className="fas fa-calendar-alt" />
        </span>

        {selectedDate && selectedDate.format ? (
          <span>{selectedDate.format('D/MMMM/YYYY')}</span>
        ) : (
          <span>Select a Date</span>
        )}
      </button>
    );
    return (
      <DatePicker
        className="input is-info is-outlined"
        customInput={myInput}
        selected={this.state.selectedDate}
        onChange={this.handleChange}
        minDate={this.minDate}
        maxDate={moment().add(30, 'd')}
        disabledKeyboardNavigation
        placeholderText="Select a date..."
        dateFormat={'D/MMMM/YYYY'}
      />
    );
  }
}
