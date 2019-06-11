//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
const minDate = process.env.NODE_ENV === 'production' ? moment().add(1, 'day') : moment();
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
      startDate: minDate,
    };
  }

  handleChange = (date) => {
    const dateWithTimeZone = moment(date);
    this.setState({
      startDate: date,
    });
    this.props.onChangeEvent(dateWithTimeZone.toISOString());
  };

  render() {
    return (
      <DatePicker
        inline
        selected={this.state.startDate}
        onChange={this.handleChange}
        minDate={minDate}
        maxDate={moment().add(20, 'd')}
      />
    );
  }
}
