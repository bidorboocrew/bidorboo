import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import * as Yup from 'yup';
import dogWalking_img from '../../assets/images/dogWalking_img.png';
import { TextAreaInput } from '../../components/forms/FormsHelpers';

export default {
  ID: 'bdbPetSittingWalking',
  TITLE: 'Pet Sitting/Walking',
  ICON: '',
  IMG: dogWalking_img,
  DESCRIPTION: `Do you need someone to care for your Pet while you are away or on a night out? Leave your pet in the gentle care of our pet loving Taskers.`,
  SUGGESTION_TEXT: `*What kind of pet? (Dog, Cat, Fish, Lizard ...others) ?

*Does your pet have any special needs (medicines, allergies, physical issues ...etc)?
`,
  defaultExtrasValues: {
    effort: 'noSelection',
  },
  extraValidationSchema: {
    effort: Yup.string()
      .ensure()
      .trim()
      .oneOf(['small', 'medium', 'large'], '*Please select an option from the drop down')
      .required('*Please select the effort required'),
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
                    BidOrBoo Tasker will watch over, feed, walk and entertain your pet in accordance
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
  extrasValidation: function(values) {
    let errors = {};
    if (!values.effort || values.effort === 'noSelection') {
      errors.effort = 'Please select the required effort';
    }
    return errors;
  },
  extras: function() {
    return {
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
              <div className={`group ${isTouched && errors.isRequesterHosting ? 'isError' : ''}`}>
                <label className={isRequesterHostingClass}>Where will the pet stay?</label>
                <div>
                  <div id="isRequesterHosting" className={`select ${isRequesterHostingClass} `}>
                    <select
                      id="isRequesterHosting"
                      value={values.isRequesterHosting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="notNecessary">{`No overnight stay is required`}</option>
                      <option value="yes">{`Owner's Place - Tasker will come and stay at my place`}</option>
                      <option value="no">{`Tasker's Place - I will drop the pet at the tasker place`}</option>
                      <option value="decideLater">{`Not Sure - will decide together later`}</option>
                    </select>
                    {isTouched && errors.isRequesterHosting && (
                      <div className="help is-danger">{errors.isRequesterHosting}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (isRequesterHosting) => {
          let selectedValue = null;
          switch (isRequesterHosting) {
            case 'notNecessary':
              selectedValue = 'No overnight stay is required';
              break;
            case 'yes':
              selectedValue = `Owner's Place - Tasker will stay with the pet at the owner's place`;
              break;
            case 'no':
              selectedValue = `Tasker's Place - Owner will drop the pet at the tasker's place`;
              break;
            case 'decideLater':
              selectedValue = 'Unsure - Tasker and Owner can decide later';
              break;
          }
          return (
            <div key={'extras-isRequesterHosting'} className="group">
              <label className="label hasSelectedValue">Where will the pet stay?</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
      effort: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let effortClass = '';
          let isTouched = touched && touched.effort;
          if (isTouched) {
            effortClass = values.effort === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-effort'}>
              <div className={`group ${isTouched && errors.effort ? 'isError' : ''}`}>
                <label className={effortClass}>{'Approximate Duration'}</label>
                <div>
                  <div id="effort" className={`select ${effortClass} `}>
                    <select
                      id="effort"
                      value={values.effort}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="small">{`Small (1-3 hours)`}</option>
                      <option value="medium">{`Medium (3-6 hours)`}</option>
                      <option value="large">{`Large (6-8 hours)`}</option>
                    </select>
                    {isTouched && errors.effort && (
                      <div className="help is-danger">{errors.effort}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (size) => {
          let selectedValue = null;
          switch (size) {
            case 'small':
              selectedValue = 'Small (1-3 hours)';
              break;
            case 'medium':
              selectedValue = 'Medium (3-6 hours)';
              break;
            case 'large':
              selectedValue = 'Large (6-8 hours)';
              break;
          }
          return (
            <div key={'extras-effort'} className="group">
              <label className="label hasSelectedValue">Task Effort</label>
              <div className="control">{selectedValue}</div>
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
                <label className={requiresWalkingClass}>{'Requires outdoor walk/play ?'}</label>
                <div>
                  <div id="requiresWalking" className={`select ${requiresWalkingClass} `}>
                    <select
                      id="requiresWalking"
                      value={values.requiresWalking}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="yes">{`Yes - it is required`}</option>
                      <option value="no">{`No - indoor only`}</option>
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
              selectedValue = 'Requires walk/play outdoors';
              break;
            case 'no':
              selectedValue = 'Pet stays indoors';
              break;
          }
          return (
            <div key={'extras-requiresWalking'} className="group">
              <label className="label hasSelectedValue">Requires outdoor walk/play?</label>
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
                id="dietryRestrictions"
                type="text"
                label="any dietary/medical needs?"
                helpText="you can say no if your pet doesn't need any"
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
  TASK_EXPECTATIONS: `BidOrBoo Tasker will watch over, feed, walk and entertain your pet in accordance to your request and guidelines.`,
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
