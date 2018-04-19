//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';


class CustomDateButton extends React.Component {
static propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string
};
  render () {
    return (

      <button
        className="button is-info is-outlined"
        onClick={this.props.onClick}>
        <span className="icon">
            <i className="far fa-calendar-alt" />
          </span>
          <span>{this.props.value}</span>

      </button>
    )
  }
}

export default class DatePickerInput extends React.Component {
  static propTypes = {
    onChangeEvent: PropTypes.func.isRequired,
    onBlurEvent: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string])
  };
  static defaultProps = {
    placeholder: '',
    value: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.value || moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
    this.props.onChangeEvent(date);
  }

  render() {
    const {
      // handleSelect,
      // onError,
      // onChangeEvent,
      onBlurEvent,
      // id,
      placeholder
    } = this.props;
    return (
      <DatePicker
        customInput={<CustomDateButton />}
        placeholderText={placeholder}
        selected={this.state.startDate}
        onChange={this.handleChange}
        minDate={moment()}
        maxDate={moment().add(1, 'year')}
        onBlur={onBlurEvent}
        className="input is-overlay"

      />
    );
  }
}
