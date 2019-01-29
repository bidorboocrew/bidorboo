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
    this.state = {
      startDate: moment().set({ hour: 8, minute: 0, second: 0, millisecond: 0 }),
    };
  }

  handleChange = (date) => {
    const dateWithTimeZone = moment(date).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
    this.setState({
      startDate: date,
    });
    this.props.onChangeEvent(dateWithTimeZone);
  };

  render() {
    return (
      <DatePicker
        inline
        selected={this.state.startDate}
        onChange={this.handleChange}
        minDate={moment()}
        maxDate={moment().add(60, 'd')}
      />
    );
  }
}
