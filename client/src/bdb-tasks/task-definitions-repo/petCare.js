import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import * as Yup from 'yup';
import dogWalking_img from '../../assets/images/dogWalking_img.png';
import { TextAreaInput, TextInput } from '../../components/forms/FormsHelpers';

export default {
  ID: 'bdbPetSittingWalking',
  TITLE: 'Pet Sitting/Walking',
  ICON: '',
  IMG: dogWalking_img,
  DESCRIPTION: `Do you need someone to care for your Pet while you are away or on a night out? Leave your pet in the gentle care of our pet loving Taskers.`,
  SUGGESTION_TEXT: `Q1)What kind/breed of pet ?
[Answer here:   ]
`,
  defaultExtrasValues: {
    duration: '',
    isRequesterHosting: 'noSelection',
    requiresWalking: 'noSelection',
    dietaryRestrictions: '',
  },
  extraValidationSchema: {
    isRequesterHosting: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        ['ownersPlace', 'taskersPlace', 'decideLater'],
        '*Please select an option from the drop down',
      )
      .required('*Please select where will the pet stay during the service required'),
    requiresWalking: Yup.string()
      .ensure()
      .trim()
      .oneOf(['yes', 'no'], '*Please select an option from the drop down')
      .required('*Please select whether or not the pet requires outdoor walking'),
    duration: Yup.string()
      .ensure()
      .trim()
      .min(3, 'must be minimum 3 chars, examples : 3hours, 1 day , 3 months')
      .max(30, 'can not be more than 30 characthers , examples : 3hours, 1 day , 3 months')
      .required('*Please select the duration of the service required'),
    dietaryRestrictions: Yup.string()
      .ensure()
      .trim()
      .max(200, 'can not be more than 200 charachters'),
  },

  renderThankYouForPostingMoment: function(setShowModal) {
    return renderThankyouMoment({
      dogWalking_img,
      setShowModal,
      subText: 'Our Taskers will be bidding on this request shortly',
    });
  },
  renderThankYouForPostingBid: function(setShowModal) {
    return renderThankyouMoment({
      dogWalking_img,
      setShowModal,
      subText: 'The Requester Will Be notified. Good Luck',
    });
  },
  renderThankYouForEditingBid: function(setShowModal) {
    return renderThankyouMoment({
      dogWalking_img,
      setShowModal,
      mainText: 'Bid Was Updated!',
      subText: 'The Requester Will Be notified. Good Luck',
    });
  },

  renderSummaryCard: function({ withDetails = true }) {
    return (
      <div style={{ padding: `${!withDetails ? '0 0 1.5rem 0' : '1.5rem'}` }}>
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <div className="watermark">
                <img src={dogWalking_img} style={{ height: 125, width: 125, objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div style={{ maxWidth: 320, paddingLeft: '1.5rem' }}>
                <h1 className="title" style={{ fontWeight: 300, marginBottom: '0.5rem' }}>
                  Pet Sitting/Walking
                </h1>
                {withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    Do you need someone to care for your Pet while you are away or on a night out?
                    Leave your pet in the gentle care of our pet loving Taskers.
                  </p>
                )}
                {!withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    BIDORBOO Tasker will watch over, feed, walk and entertain your pet in accordance
                    to your request and guidelines.
                  </p>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  },
  // extrasValidation: function(values) {
  //   let errors = {};

  //   return errors;
  // },
  enableImageUploadField: true,
  extras: function() {
    return {
      duration: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          return (
            <React.Fragment key={'extras-duration'}>
              <TextInput
                id="duration"
                type="text"
                label="Service duration"
                helpText="How long do you need the Tasker to take care of your pet?"
                placeholder={'for example: 3 hours , 3 days , 1 week , until 1/10/2021 ..,etc'}
                error={touched.duration && errors.duration}
                value={values.duration || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </React.Fragment>
          );
        },
        renderSelection: (durationText) => {
          return (
            <div key={'extras-duration'} className="group">
              <label className="label hasSelectedValue">Duration of service</label>
              <div className="control">{durationText}</div>
            </div>
          );
        },
      },
      isRequesterHosting: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let isRequesterHostingClass = '';
          let isTouched = touched && touched.isRequesterHosting;
          if (isTouched) {
            isRequesterHostingClass =
              values.isRequesterHosting === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-isRequesterHosting'}>
              <div
                className={`group ${isTouched && errors.isRequesterHosting ? 'isError' : ''} ${
                  values.isRequesterHosting === 'ownersPlace' ||
                  values.isRequesterHosting === 'taskersPlace'
                    ? 'isHelp'
                    : ''
                }`}
              >
                <label className={isRequesterHostingClass}>
                  Where will the pet stay during this service?
                </label>
                <div>
                  <div id="isRequesterHosting" className={`select ${isRequesterHostingClass} `}>
                    <select
                      id="isRequesterHosting"
                      value={values.isRequesterHosting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="ownersPlace">{`At My place`}</option>
                      <option value="taskersPlace">{`At Tasker's place`}</option>
                      <option value="decideLater">{`Unsure - decide later`}</option>
                    </select>
                    {isTouched && errors.isRequesterHosting && (
                      <div className="help is-danger">{errors.isRequesterHosting}</div>
                    )}
                    {values.isRequesterHosting === 'ownersPlace' && (
                      <div className="help">
                        Tasker will come to your home and take care/check on the pet
                      </div>
                    )}
                    {values.isRequesterHosting === 'taskersPlace' && (
                      <div className="help">Your pet will be in the caring home of our Tasker</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (isRequesterHosting) => {
          let selectedValue = null;
          let helperText = null;
          switch (isRequesterHosting) {
            case 'ownersPlace':
              selectedValue = `Owner's Place`;
              helperText = (
                <div className="help">
                  Tasker expected to go to the pet owner's home and take care/check on the pet
                  regularly for the duration of the service.
                </div>
              );
              break;
            case 'taskersPlace':
              selectedValue = `Tasker's Place - Owner will drop the pet at the tasker's place`;
              helperText = (
                <div className="help">
                  The pet will be in the caring <strong>home of the Tasker</strong> for the duration
                  of the service.
                </div>
              );
              break;
            case 'decideLater':
              selectedValue =
                'The Owner and Tasker should be willing to have the service take place in thier homes and will decide later after the task is awarded';
              break;
          }
          return (
            <div key={'extras-isRequesterHosting'} className="group">
              <label className="label hasSelectedValue">Where will the pet stay?</label>
              <div className="control">{selectedValue}</div>
              {helperText}
            </div>
          );
        },
      },

      requiresWalking: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let requiresWalkingClass = '';
          let isTouched = touched && touched.requiresWalking;
          if (isTouched) {
            requiresWalkingClass =
              values.requiresWalking === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-requiresWalking'}>
              <div className={`group ${isTouched && errors.requiresWalking ? 'isError' : ''}`}>
                <label className={requiresWalkingClass}>{'does the pet need outdoor walks?'}</label>
                <div>
                  <div id="requiresWalking" className={`select ${requiresWalkingClass} `}>
                    <select
                      id="requiresWalking"
                      value={values.requiresWalking}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="yes">{`Yes`}</option>
                      <option value="no">{`No`}</option>
                    </select>
                    {isTouched && errors.requiresWalking && (
                      <div className="help is-danger">{errors.requiresWalking}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (requiresWalking) => {
          let selectedValue = null;
          switch (requiresWalking) {
            case 'yes':
              selectedValue = 'Yes - requires outdoor walk/play';
              break;
            case 'no':
              selectedValue = 'No - The pet stays indoors';
              break;
          }
          return (
            <div key={'extras-requiresWalking'} className="group">
              <label className="label hasSelectedValue">Can the pet go outdoors?</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
      dietaryRestrictions: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          return (
            <React.Fragment key={'extras-dietryRestrictions'}>
              <TextAreaInput
                id="dietaryRestrictions"
                type="text"
                label="Any dietary/medical/special needs?"
                helpText="Type in, None or leave this empty if your pet doesn't need any"
                placeholder={'enter any dietry restrictions or medical needs your pet'}
                error={touched.dietaryRestrictions && errors.dietaryRestrictions}
                value={values.dietaryRestrictions || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </React.Fragment>
          );
        },
        renderSelection: (dietaryRestrictions) => {
          return (
            dietaryRestrictions && (
              <div key={'extras-dietaryRestrictions'} className="group">
                <label className="label hasSelectedValue">Dietry/medical needs</label>
                <TextareaAutosize
                  value={dietaryRestrictions}
                  className="textarea is-marginless is-paddingless control"
                  style={{
                    resize: 'none',
                    border: 'none',
                  }}
                  readOnly
                />
              </div>
            )
          );
        },
      },
    };
  },
  TASK_EXPECTATIONS: `BIDORBOO Tasker will watch over, feed, walk and entertain your pet in accordance to your request and guidelines.`,
};
const renderThankyouMoment = ({
  dogWalking_img,
  setShowModal,
  mainText = 'Thank You!',
  subText,
}) => {
  return (
    <div style={{ padding: '1.5rem', background: 'white' }}>
      <div>
        <img src={dogWalking_img} style={{ height: 125, width: 125, objectFit: 'cover' }} />
      </div>
      <h1 className="title" style={{ color: '#6a748a', fontWeight: 300, marginBottom: '0.5rem' }}>
        {mainText}
      </h1>

      <p style={{ fontSize: 18, fontWeight: 500, paddingBottom: '1rem' }}>{subText}</p>
      <a className="button is-large is-success" onClick={() => setShowModal(false)}>
        <span className="icon is-large">
          <i className="fas fa-arrow-right" />
        </span>
      </a>
    </div>
  );
};
