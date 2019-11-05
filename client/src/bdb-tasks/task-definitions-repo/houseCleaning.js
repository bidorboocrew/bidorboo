import React from 'react';

import * as Yup from 'yup';
import houseCleaning_img from '../../assets/images/houseCleaning_img.png';

export default {
  ID: 'bdbHouseCleaning',
  TITLE: 'House Cleaning',
  ICON: 'fas fa-home',
  IMG: houseCleaning_img,
  isComingSoon: false,
  DESCRIPTION: `Does your home need cleaning? Book one of our clean freak Taskers to take care of it!`,
  SUGGESTION_TEXT: `Q1)Do you have pets in the house?
[Answer here:   ]
Q2)Will the tasker be required to move heavy items (couch-beds-fridge) ?
[Answer here:   ]
`,
  defaultExtrasValues: {
    effort: 'noSelection',
    bathroomCount: 'noSelection',
    bedroomCount: 'noSelection',
    basementCleaning: 'noSelection',
    equipmentProvider: 'noSelection',
  },
  requiresDestinationField: false,
  extraValidationSchema: {
    effort: Yup.string()
      .ensure()
      .trim()
      .oneOf(['small', 'medium', 'large'], '*Please select an option from the drop down')
      .required('*Please select the effort required'),
    bathroomCount: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
        '*Please select an option from the drop down',
      )
      .required('*Please select the number of bathroom that require cleaning'),
    bedroomCount: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
        '*Please select an option from the drop down',
      )
      .required('*Please select the number of bathroom that require cleaning'),
    basementCleaning: Yup.string()
      .ensure()
      .trim()
      .oneOf(['Yes (required)', 'No (not required)'], '*Please select an option from the drop down')
      .required('*Please select the number of bathroom that require cleaning'),
    equipmentProvider: Yup.string()
      .ensure()
      .trim()
      .oneOf(['taskerProvides', 'requesterProvides'], '*Please select an option from the drop down')
      .required('*Please select the number of bathroom that require cleaning'),
  },

  renderThankYouForPostingMoment: function(setShowModal) {
    return renderThankyouMoment({
      houseCleaning_img,
      setShowModal,
      subText: 'Our Taskers will be bidding on this request shortly',
    });
  },
  renderThankYouForPostingBid: function(setShowModal) {
    return renderThankyouMoment({
      houseCleaning_img,
      setShowModal,
      subText: 'The Requester Will Be notified. Good Luck',
    });
  },
  renderThankYouForEditingBid: function(setShowModal) {
    return renderThankyouMoment({
      houseCleaning_img,
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
                <img
                  src={houseCleaning_img}
                  style={{ height: 125, width: 125, objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div style={{ maxWidth: 320, paddingLeft: '1.5rem' }}>
                <h1 className="title" style={{ fontWeight: 300, marginBottom: '0.5rem' }}>
                  House Cleaning
                </h1>
                {withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    Does your home need cleaning? Book one of our clean freak Taskers to take care
                    of it!
                  </p>
                )}
                {!withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    BidOrBoo Tasker will bring All purpose cleaning products and equipments required
                    to clean your house thouroughally.
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
  // if (!values.effort || values.effort === 'noSelection') {
  //   errors.effort = 'Please select the required effort';
  // }
  //   return errors;
  // },
  enableImageUploadField: false,
  extras: function() {
    return {
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
                <label className={effortClass}>{'Approximate cleaning duration'}</label>
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
      bedroomCount: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let bedroomCountClass = '';
          let isTouched = touched && touched.bedroomCount;
          if (isTouched) {
            bedroomCountClass =
              values.bedroomCount === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-bedroomCount'}>
              <div className={`group ${isTouched && errors.bedroomCount ? 'isError' : ''}`}>
                <label className={bedroomCountClass}>{'How many bedrooms?'}</label>
                <div>
                  <div className={`select ${bedroomCountClass} `}>
                    <select
                      id="bedroomCount"
                      value={values.bedroomCount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="One">1</option>
                      <option value="Two">2</option>
                      <option value="Three">3</option>
                      <option value="Four">4</option>
                      <option value="Five">5</option>
                      <option value="Six">6</option>
                    </select>
                    {isTouched && errors.bedroomCount && (
                      <div className="help is-danger">{errors.bedroomCount}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (bedroomCount) => {
          return (
            <div key={'extras-bedroomCount'} className="group">
              <label className="label hasSelectedValue">Number of bedrooms</label>
              <div className="control">
                {bedroomCount === 1 ? `${bedroomCount} bedroom` : `${bedroomCount} bedrooms`}
              </div>
            </div>
          );
        },
      },
      bathroomCount: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let bathroomCountClass = '';
          let isTouched = touched && touched.bathroomCount;
          if (isTouched) {
            bathroomCountClass =
              values.bathroomCount === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-bathroomCount'}>
              <div className={`group ${isTouched && errors.bathroomCount ? 'isError' : ''}`}>
                <label className={bathroomCountClass}>{'How many bathrooms?'}</label>
                <div>
                  <div className={`select ${bathroomCountClass} `}>
                    <select
                      id="bathroomCount"
                      value={values.bathroomCount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="One">1</option>
                      <option value="Two">2</option>
                      <option value="Three">3</option>
                      <option value="Four">4</option>
                      <option value="Five">5</option>
                      <option value="Six">6</option>
                    </select>
                    {isTouched && errors.bathroomCount && (
                      <div className="help is-danger">{errors.bathroomCount}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (bathroomCount) => {
          return (
            <div key={'extras-bathroomCount'} className="group">
              <label className="label hasSelectedValue">Number of bathrooms</label>
              <div className="control">
                {bathroomCount === 1 ? `${bathroomCount} bathroom` : `${bathroomCount} bathrooms`}
              </div>
            </div>
          );
        },
      },
      basementCleaning: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let basementCleaningClass = '';
          let isTouched = touched && touched.basementCleaning;
          if (isTouched) {
            basementCleaningClass =
              values.basementCleaning === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-basementCleaning'}>
              <div className={`group ${isTouched && errors.basementCleaning ? 'isError' : ''}`}>
                <label className={basementCleaningClass}>{'Is basement cleaning Required ?'}</label>
                <div>
                  <div className={`select ${basementCleaningClass} `}>
                    <select
                      id="basementCleaning"
                      value={values.basementCleaning}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="Yes (required)">Yes (required)</option>
                      <option value="No (not required)">No (not required)</option>
                    </select>
                    {isTouched && errors.basementCleaning && (
                      <div className="help is-danger">{errors.basementCleaning}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (basementCleaning) => {
          return (
            <div key={'extras-basementCleaning'} className="group">
              <label className="label hasSelectedValue">Basement Cleaning</label>
              <div className="control">{basementCleaning}</div>
            </div>
          );
        },
      },

      equipmentProvider: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let equipmentProviderClass = '';
          let isTouched = touched && touched.equipmentProvider;
          if (isTouched) {
            equipmentProviderClass =
              values.equipmentProvider === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-equipmentProvider'}>
              <div className={`group ${isTouched && errors.equipmentProvider ? 'isError' : ''}`}>
                <label className={equipmentProviderClass}>
                  {'Should tasker bring Vaccum/Mob?'}
                </label>
                <div>
                  <div className={`select ${equipmentProviderClass}`}>
                    <select
                      id="equipmentProvider"
                      value={values.equipmentProvider}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="taskerProvides">Yes (Tasker brings vaccum/mop)</option>
                      <option value="requesterProvides">No (I will provide them)</option>
                    </select>
                    {isTouched && errors.equipmentProvider && (
                      <div className="help is-danger">{errors.equipmentProvider}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (equipmentProvider) => {
          let valueOfField = '';
          switch (equipmentProvider) {
            case 'taskerProvides':
              valueOfField = 'Tasker must bring Vaccum/Mop';
              break;
            case 'requesterProvides':
              valueOfField = 'The requester will provide Vaccum/Mop';
              break;
          }
          return (
            <div key={'extras-equipmentProvider'} className="group">
              <label className="label hasSelectedValue">Who will provide vaccum/mop?</label>
              <div className="control">{valueOfField}</div>
            </div>
          );
        },
      },
    };
  },
  TASK_EXPECTATIONS: `BidOrBoo Tasker will bring All purpose cleaning products and equipments required to clean your house thouroughally.`,
};
const renderThankyouMoment = ({
  houseCleaning_img,
  setShowModal,
  mainText = 'Thank You!',
  subText,
}) => {
  return (
    <div style={{ padding: '1.5rem', background: 'white' }}>
      <div>
        <img src={houseCleaning_img} style={{ height: 125, width: 125, objectFit: 'cover' }} />
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
