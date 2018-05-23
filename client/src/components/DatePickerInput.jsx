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
  value: PropTypes.string
};
  render () {
    return (
      <a
        className="button is-info is-outlined"
        onClick={this.props.onClick}>
        <span className="icon">
            <i className="far fa-calendar-alt" />
          </span>
          <span>{this.props.value}</span>
      </a>
    )
  }
}

export default class DatePickerInput extends React.Component {
  static propTypes = {
    onChangeEvent: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string])
  };
  static defaultProps = {
    value: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.value || moment()
    };
    autoBind(this, 'handleChange');
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
    this.props.onChangeEvent(date);
  }

  render() {
    return (
      <DatePicker
        customInput={<CustomDateButton />}
        selected={this.state.startDate}
        onChange={this.handleChange}
        locale="en-gb"
        minDate={moment()}
        maxDate={moment().add(1, 'year')}
        className="input is-overlay"
      />
    );
  }
}
