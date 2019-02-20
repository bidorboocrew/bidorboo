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
import ReCAPTCHA from 'react-google-recaptcha';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

class NewJobForm extends React.Component {
  constructor(props) {
    super(props);
    this.recaptchaRef = React.createRef();

    this.google = window.google;
    const googleObj = this.google;
    if (this.google) {
      this.geocoder = new googleObj.maps.Geocoder();
    }

    this.state = {
      forceSetAddressValue: '',
      selectedTimeButtonId: 'evening',
      showConfirmationDialog: false,
    };
  }

  componentDidMount() {
    const { currentUserDetails } = this.props;
    // xxx do not do that automatically it will scare people
    if (
      currentUserDetails &&
      currentUserDetails.autoDetectlocation &&
      navigator &&
      navigator.geolocation
    ) {
      this.getCurrentAddress();
    }

    this.recaptchaRef.current.execute();
  }

  toggleConfirmationDialog = () => {
    const { isLoggedIn, showLoginDialog } = this.props;
    if (!isLoggedIn) {
      showLoginDialog(true);
      return;
    }
    this.setState({
      showConfirmationDialog: !this.state.showConfirmationDialog,
    });
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
    const { selectedTimeButtonId, showConfirmationDialog } = this.state;

    const autoDetectCurrentLocation = navigator.geolocation ? (
      <React.Fragment>
        <div>
          <a
            style={{ marginTop: 6, fontSize: 14 }}
            onClick={this.getCurrentAddress}
            className="button is-small is-info is-outlined"
          >
            <span className="icon">
              <i className="fas fa-map-marker-alt" />
            </span>
            <span>Auto Detect My Address</span>
          </a>
        </div>
        <span style={{ fontSize: 12, color: 'grey' }}>
          {` or manually start typing an address in this field then select from the drop down suggestions`}
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
                <section className="modal-card-body">
                  <div
                    style={{
                      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
                      borderRaduis: 4,
                      border: '1px solid #bdbdbd',
                    }}
                  >
                    <header
                      style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                      className="card-header is-clipped"
                    >
                      <p className="card-header-title">
                        Preview: {templatesRepo[fromTemplateIdField].title}
                      </p>
                    </header>
                    <div className="card-image is-clipped">
                      <img
                        className="bdb-newjob-confirm-img"
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
                  <div style={{ paddingLeft: 4, paddingTop: 4 }}>
                    <HelpText helpText={`BidOrBoo Fairness and Safety rules:`} />
                    <HelpText helpText={`- Once you post you will not be able to edit the job.`} />
                    <HelpText helpText={`- Bidders will not be able to view the EXACT location.`} />
                    <HelpText
                      helpText={`- Upon awarding a tasker you will get their contact info.`}
                    />
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button
                    style={{ width: 120 }}
                    onClick={this.toggleConfirmationDialog}
                    className="button is-outline"
                  >
                    <span className="icon">
                      <i className="far fa-edit" />
                    </span>
                    <span>go Back</span>
                  </button>
                  <button
                    style={{ width: 120 }}
                    type="submit"
                    disabled={isSubmitting}
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
            id="recaptchaField"
            className="input is-invisible"
            type="hidden"
            value={values.recaptcha || ''}
          />
          <ReCAPTCHA
            style={{ display: 'none' }}
            ref={this.recaptchaRef}
            size="invisible"
            badge="bottomright"
            onExpired={() => this.recaptchaRef.current.execute()}
            onChange={(result) => {
              setFieldValue('recaptchaField', result, true);
            }}
            sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
          />
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
              setFieldValue('addressTextField', e, true);
            }}
            onBlurEvent={(e) => {
              if (e && e.target) {
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
            helpText={'* Please be detailed in your description.'}
            label="Detailed Description"
            startWithTemplateButton={
              <a
                style={{ marginBottom: 4 }}
                className="button is-info is-small"
                onClick={this.insertTemplateText}
              >
                <span className="icon">
                  <i className="fas fa-pencil-alt" />
                </span>
                <span>Insert Template Questions </span>
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
              style={{ width: 120 }}
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
              style={{ width: 120, marginLeft: '1rem' }}
              className={`button is-success is-medium  ${isSubmitting ? 'is-loading' : ''}`}
              disabled={isSubmitting || !isValid}
              onClick={(e) => {
                e.preventDefault();
                this.toggleConfirmationDialog();
              }}
            >
              <span className="icon">
                <i className="fas fa-bullseye" />
              </span>
              <span>Preview</span>
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
    recaptchaField: Yup.string()
      .ensure()
      .trim()
      .required('passing recaptcha is required.'),
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
    props.onSubmit(values);
  },
  displayName: 'NewJobForm',
});

export default EnhancedForms(NewJobForm);

export const HelpText = ({ helpText }) => (helpText ? <p className="help">{helpText}</p> : null);
