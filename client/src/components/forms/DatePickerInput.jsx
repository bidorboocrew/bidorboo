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
      startDate: null,
    };
  }

  handleChange = (date) => {
    const dateWithTimeZone = moment.utc(date);
    this.setState({
      startDate: dateWithTimeZone,
    });
    this.props.onChangeEvent(dateWithTimeZone.toISOString());
  };

  render() {
    return (
      <DatePicker
        className="input"
        selected={this.state.startDate}
        onChange={this.handleChange}
        minDate={this.minDate}
        maxDate={moment().add(30, 'd')}
        disabledKeyboardNavigation
        placeholderText="Select a date..."
        dateFormat={"D/MMMM/YYYY"}
      />
    );
  }
}
