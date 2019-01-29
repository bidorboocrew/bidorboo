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
      startDate: moment(),
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
        minDate={moment()}
        maxDate={moment().add(60, 'd')}
      />
    );
  }
}
