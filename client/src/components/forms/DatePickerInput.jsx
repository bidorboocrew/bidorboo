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
    const { label, error, helpText, iconLeft } = this.props;

    const { selectedDate } = this.state;

    let dateClass = '';
    if (!!selectedDate && selectedDate.toDate) {
      debugger;
      dateClass = selectedDate.toDate ? 'hasSelectedValue' : 'is-danger';
    }

    return (
      <div className="group">
        <label className={`label ${dateClass}`}>{label}</label>
        <div>
          <DatePicker
            className={'input is-fullwidth'}
            selected={selectedDate}
            onChange={this.handleChange}
            minDate={this.minDate}
            maxDate={moment().add(30, 'd')}
            disabledKeyboardNavigation
            placeholderText="Select a date..."
            dateFormat={'D/MMMM/YYYY'}
          />
        </div>
        {helpText ? <p className="help">{helpText}</p> : null}
        {error ? <p className="help is-danger">{error}</p> : null}
      </div>
    );
  }
}
