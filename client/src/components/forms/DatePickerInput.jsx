//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import autoBind from 'react-autobind';

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
      startDate: moment(new Date()).add(1, 'days'),
    };
    autoBind(this, 'handleChange');
  }

  handleChange(date) {
    debugger;
    const dateWithTimeZone = moment.utc(date).toDate();
    debugger;
    this.setState({
      startDate: date,
    });
    this.props.onChangeEvent(dateWithTimeZone);
  }

  render() {
    return (
      <DatePicker
        inline
        locale="en-GB"
        selected={this.state.startDate}
        onChange={this.handleChange}
        minDate={moment(new Date()).add(1, 'days')}
        maxDate={moment(new Date()).add(30, 'days')}
      />
    );
  }
}
