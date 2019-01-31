/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {
  StartDateAndTime,
  UserImageAndRating,
  DisplayLabelValue,
} from '../../containers/commonComponents';
import { withFormik } from 'formik';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import TextareaAutosize from 'react-autosize-textarea';

import * as Yup from 'yup';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GeoAddressInput, TextAreaInput, DateInput } from './FormsHelpers';
import moment from 'moment';
import { relative } from 'upath';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class NewJobForm extends React.Component {
  constructor(props) {
    super(props);

    this.google = window.google;
    const googleObj = this.google;
    if (this.google) {
      this.geocoder = new googleObj.maps.Geocoder();
    }
    this.state = {
      forceSetAddressValue: '',
      selectedTimeButtonId: 'evening',
      showConfirmationDialog: false,
      reviewConfirmation: false,
    };
  }

  componentDidMount() {
    navigator.geolocation && this.getCurrentAddress();
  }

  toggleConfirmationDialog = () => {
    this.setState({
      showConfirmationDialog: !this.state.showConfirmationDialog,
      reviewConfirmation: false,
    });
  };

  toggleReviewConfirmation = () => {
    this.setState({ reviewConfirmation: !this.state.reviewConfirmation });
  };

  autoSetGeoLocation = (addressText) => {
    this.setState(() => ({ forceSetAddressValue: addressText }));
    // update the form field with the current position coordinates
    this.props.setFieldValue('addressTextField', addressText, false);
  };

  insertTemplateText = () => {
    const existingText = this.props.values.detailedDescriptionField
      ? `${this.props.values.detailedDescriptionField}\n`
      : '';

    this.props.setFieldValue(
      'detailedDescriptionField',
      `${existingText}${this.props.suggestedDetailsText}`,
      true,
    );
  };

  selectTimeButton = (selectionId) => {
    const { setFieldValue, values } = this.props;
    let selectedTimeValue = 17;

    switch (selectionId) {
      case 'morning': {
        selectedTimeValue = 8;
        break;
      }
      case 'afternoon': {
        selectedTimeValue = 12;
        break;
      }
      case 'evening': {
        selectedTimeValue = 17;
        break;
      }

      case 'anytime': {
        selectedTimeValue = 10;
        break;
      }
      default: {
        selectedTimeValue = 17;
        break;
      }
    }

    this.setState({ selectedTimeButtonId: selectionId }, () => {
      setFieldValue('timeField', selectedTimeValue, false);
      const newAdjustedTimeVal = moment(values.dateField)
        .set({ hour: selectedTimeValue, minute: 0, second: 0, millisecond: 0 })
        .toISOString();

      setFieldValue('dateField', newAdjustedTimeVal, false);
    });
  };

  updateDateInputFieldValue = (val) => {
    const { setFieldValue, values } = this.props;

    const adjustedTimeVal = moment(val)
      .set({ hour: values.timeField, minute: 0, second: 0, millisecond: 0 })
      .toISOString();

    setFieldValue('dateField', adjustedTimeVal, false);
  };
  render() {
    const {
      fromTemplateIdField,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      onGoBack,
      isValid,
      isSubmitting,
      setFieldValue,
      currentUserDetails,
    } = this.props;

    const { selectedTimeButtonId, showConfirmationDialog, reviewConfirmation } = this.state;

    const autoDetectCurrentLocation = navigator.geolocation ? (
      <React.Fragment>
        <span>
          <a style={{ fontSize: 14 }} onClick={this.getCurrentAddress} className="is-link">
            Auto Detect
          </a>
        </span>
        <span style={{ fontSize: 12, color: 'grey' }}>
          {` or manually select an address from the drop down menu`}
        </span>
      </React.Fragment>
    ) : null;

    //get an initial title from the job title
    values.fromTemplateIdField = fromTemplateIdField;
    return (
      <React.Fragment>
        {showConfirmationDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Review Task Details</p>
                </header>
                <section className="modal-card-body">
                  <label className="label">Task Preview</label>
                  <div className="card is-clipped">
                    <header
                      style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                      className="card-header is-clipped"
                    >
                      <p className="card-header-title">
                        {templatesRepo[fromTemplateIdField].title} Request
                      </p>
                    </header>
                    <div className="card-image is-clipped">
                      <img
                        className="bdb-cover-img"
                        src={`${templatesRepo[fromTemplateIdField].imageUrl}`}
                      />
                    </div>

                    <div
                      style={{
                        paddingTop: '0.25rem',
                        paddingBottom: '0.25rem',
                        position: 'relative',
                      }}
                      className="card-content"
                    >
                      <UserImageAndRating userDetails={currentUserDetails} />
                      <div className="content">
                        <StartDateAndTime date={values.dateField} />
                        <DisplayLabelValue
                          labelText="Address:"
                          labelValue={values.addressTextField}
                        />
                        <div className="has-text-grey is-size-7">Detailed Description</div>
                        <span className="is-size-7">
                          <TextareaAutosize
                            value={values.detailedDescriptionField}
                            className="textarea is-marginless is-paddingless is-size-6"
                            style={{
                              resize: 'none',
                              border: 'none',
                              color: '#4a4a4a',
                              fontSize: '1rem',
                            }}
                            readOnly
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  <HelpText helpText={`BidOrBoo Fairness and Safety rules:`} />
                  <HelpText helpText={`*Once you post you will not be able to edit the job.`} />
                  <HelpText helpText={`*Bidders will not be able to view the EXACT location.`} />
                  <HelpText helpText={`*Upon awarding a tasker you will get their contact info.`} />
                </section>
                <footer
                  style={{
                    paddingTop: 6,
                    borderRadius: 0,
                    background: 'whitesmoke',
                  }}
                  className="modal-card-foot"
                >
                  <div className="control">
                    <label className="radio">
                      <input
                        checked={reviewConfirmation}
                        onChange={this.toggleReviewConfirmation}
                        type="checkbox"
                        name="success"
                        required
                      />
                      <span>
                        {` I Confirm that all details are accurate and matches my expectations.`}
                      </span>
                    </label>
                  </div>
                </footer>
                <footer style={{ borderTop: 0, paddingTop: 0 }} className="modal-card-foot">
                  <button
                    style={{ width: 140 }}
                    onClick={this.toggleConfirmationDialog}
                    className="button is-outline"
                  >
                    <span className="icon">
                      <i className="far fa-edit" />
                    </span>
                    <span>Edit Details</span>
                  </button>
                  <button
                    style={{ width: 140 }}
                    type="submit"
                    disabled={!reviewConfirmation}
                    onClick={handleSubmit}
                    className="button is-success"
                  >
                    <span className="icon">
                      <i className="far fa-paper-plane" />
                    </span>
                    <span>Submit</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            id="fromTemplateIdField"
            className="input is-invisible"
            type="hidden"
            value={values.fromTemplateIdField || fromTemplateIdField}
          />
          <input
            id="addressTextField"
            className="input is-invisible"
            type="hidden"
            value={values.addressTextField || ''}
          />
          <input
            id="locationField"
            className="input is-invisible"
            type="hidden"
            value={values.locationField || ''}
          />
          <input
            id="dateField"
            className="input is-invisible"
            type="hidden"
            value={values.dateField}
          />
          <input
            id="timeField"
            className="input is-invisible"
            type="hidden"
            value={values.timeField || 5}
          />
          <GeoAddressInput
            id="geoInputField"
            type="text"
            helpText={'You must select an address from the drop down menu'}
            label="Service Address"
            placeholder="specify your task address"
            autoDetectComponent={autoDetectCurrentLocation}
            error={touched.addressTextField && errors.addressTextField}
            value={values.addressTextField || ''}
            onError={(e) => {
              errors.addressTextField = 'google api error ' + e;
            }}
            onChangeEvent={(e) => {
              console.log(`onChangeEvent={(e) => ${e}`);
              setFieldValue('addressTextField', e, true);
            }}
            onBlurEvent={(e) => {
              if (e && e.target) {
                console.log(`onChangeEvent={(e) => ${e}`);
                e.target.id = 'addressTextField';
                handleBlur(e);
              }
            }}
            handleSelect={(address) => {
              setFieldValue('addressTextField', address, false);
              geocodeByAddress(address)
                .then((results) => getLatLng(results[0]))
                .then((latLng) => {
                  setFieldValue('locationField', latLng, false);
                  console.log('Success', latLng);
                })
                .catch((error) => {
                  errors.addressTextField = 'error getting lat lng ' + error;
                  console.error('Error', error);
                });
            }}
          />
          <br />
          <DateInput
            id="DateInputField"
            type="text"
            label="Start Date and Time"
            onChangeEvent={this.updateDateInputFieldValue}
          />
          <div className="buttons">
            <span
              style={{ width: 100 }}
              onClick={() => this.selectTimeButton('morning')}
              className={`button is-info ${
                selectedTimeButtonId === 'morning' ? '' : 'is-outlined'
              }`}
            >
              Morning
            </span>
            <span
              style={{ width: 100 }}
              onClick={() => this.selectTimeButton('afternoon')}
              className={`button is-info ${
                selectedTimeButtonId === 'afternoon' ? '' : 'is-outlined'
              }`}
            >
              Afternoon
            </span>
            <span
              style={{ width: 100 }}
              onClick={() => this.selectTimeButton('evening')}
              className={`button is-info ${
                selectedTimeButtonId === 'evening' ? '' : 'is-outlined'
              }`}
            >
              Evening
            </span>
            <span
              style={{ width: 100 }}
              onClick={() => this.selectTimeButton('anytime')}
              className={`button is-info ${
                selectedTimeButtonId === 'anytime' ? '' : 'is-outlined'
              }`}
            >
              Anytime
            </span>
          </div>
          <br />
          <TextAreaInput
            id="detailedDescriptionField"
            type="text"
            helpText={'* PleaseProvide as much details as possible to ensure more accurate bids.'}
            label="Detailed Description"
            startWithTemplateButton={
              <a
                style={{ marginBottom: 4 }}
                className="button is-info is-small"
                onClick={this.insertTemplateText}
              >
                Start by answering Questions
              </a>
            }
            placeholder={this.props.suggestedDetailsText}
            error={touched.detailedDescriptionField && errors.detailedDescriptionField}
            value={values.detailedDescriptionField || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="field">
            <button
              style={{ width: 140 }}
              type="button"
              className="button is-outlined is-medium"
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                onGoBack(e);
              }}
            >
              <span className="icon">
                <i className="far fa-arrow-alt-circle-left" />
              </span>
              <span>Back</span>
            </button>
            <button
              style={{ width: 140, marginLeft: '1rem' }}
              className={`button is-success is-medium  ${isSubmitting ? 'is-loading' : ''}`}
              disabled={isSubmitting || !isValid}
              onClick={(e) => {
                e.preventDefault();
                this.toggleConfirmationDialog();
              }}
            >
              <span className="icon">
                <i className="fas fa-glasses" />
              </span>
              <span>Review</span>
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }

  successfullGeoCoding = (results, status) => {
    // xxx handle the various error (api over limit ...etc)
    if (status !== this.google.maps.GeocoderStatus.OK) {
      alert(status);
    }
    // This is checking to see if the Geoeode Status is OK before proceeding
    if (status === this.google.maps.GeocoderStatus.OK) {
      var address = results[0].formatted_address;
      this.autoSetGeoLocation(address);
    }
  };
  getCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 10000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      const errorHandling = () => {
        console.error('can not auto detect address');
      };
      const successfulRetrieval = (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // update the form field with the current position coordinates
        this.props.setFieldValue('locationField', pos, true);

        if (this.google && this.geocoder) {
          //https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
          this.geocoder.geocode(
            {
              location: { lat: parseFloat(pos.lat), lng: parseFloat(pos.lng) },
            },
            this.successfullGeoCoding,
          );
        }
      };

      //get the current location
      navigator.geolocation.getCurrentPosition(
        successfulRetrieval,
        errorHandling,
        getCurrentPositionOptions,
      );
    } else {
      console.log('no html 5 geo location');
    }
  };
}

const EnhancedForms = withFormik({
  validationSchema: Yup.object().shape({
    fromTemplateIdField: Yup.string()
      .ensure()
      .trim()
      .required('*Template Id missing, This field is required'),
    dateField: Yup.string().required('*Date Field is required'),
    detailedDescriptionField: Yup.string()
      .ensure()
      .trim()
      .min(
        20,
        'your description must be more than 20 chars , please be detailed in descibing the task',
      )
      .required('*Please provide a detailed description '),
  }),
  mapPropsToValues: (props) => {
    return {
      timeField: 5,
      fromTemplateIdField: props.fromTemplateIdField,
      dateField: moment()
        .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
        .toISOString(),
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    // https://stackoverflow.com/questions/32540667/moment-js-utc-to-local-time
    // var x = moment.utc(values.dateField).format('YYYY-MM-DD HH:mm:ss');
    // var y = moment.utc("2018-04-19T19:29:45.000Z").local().format('YYYY-MM-DD HH:mm:ss');;
    props.onNext(values);
  },
  displayName: 'NewJobForm',
});

export default EnhancedForms(NewJobForm);

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);
