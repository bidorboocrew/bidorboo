//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

export default class DatePickerInput extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  };
  static defaultProps = {
    value: '',
  };

  constructor(props) {
    super(props);
    this.minDate = moment()
      .add(1, 'day')
      .toDate();
    this.state = {
      selectedDate: null,
    };
  }

  handleChange = (date) => {
    const dateWithTimeZone = moment.utc(date);
    this.setState({
      selectedDate: dateWithTimeZone.toDate(),
    });
    this.props.onChangeEvent(dateWithTimeZone.toISOString());
  };

  componentDidMount() {
    const { value } = this.props;
    if (value && moment(value).isValid()) {
      const dateWithTimeZone = moment.utc(value);
      this.setState({
        selectedDate: dateWithTimeZone.toDate(),
      });
      this.props.onChangeEvent(dateWithTimeZone.toISOString());
    }
  }

  render() {
    const { label, error, helpText, touched, value } = this.props;

    const { selectedDate } = this.state;

    let dateClass = '';
    if (!!selectedDate) {
      dateClass = selectedDate && !error ? 'hasSelectedValue' : 'is-danger';
    }
    if (touched && error) {
      dateClass = 'is-danger';
    }

    return (
      <div className={`group ${touched && error ? 'isError' : ''}`}>
        <label className={`label ${dateClass}`}>{label}</label>
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={this.handleChange}
            minDate={this.minDate}
            maxDate={moment()
              .add(30, 'd')
              .toDate()}
            disabledKeyboardNavigation
            customInput={<CustomDateButton />}
            placeholderText="Select a date..."
            dateFormat={'dd/MMMM/yyyy'}
          />
        </div>
        {helpText && <p className="help">{helpText}</p>}
        {touched && error && (
          <div style={{ fontWeight: 500 }} className="help is-danger">
            {error}
          </div>
        )}
      </div>
    );
  }
}
class CustomDateButton extends React.Component {
  render() {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.props.onClick(e);
        }}
        style={{ boxShadow: 'none' }}
        className={'input is-fullwidth has-text-left'}
      >
        {this.props.value ? this.props.value : 'Select a Date'}
      </button>
    );
  }
}
