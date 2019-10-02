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
      dietaryRestrictions: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          return (
            <React.Fragment key={'dietryRestrictions'}>
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
              <div key={'dietaryRestrictions'} className="group">
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
