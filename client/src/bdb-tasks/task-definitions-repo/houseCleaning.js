import React from 'react';

import * as Yup from 'yup';
import houseCleaning_img from '../../assets/images/houseCleaning_img.png';
import { switchRoute } from './../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

export default {
  ID: 'bdbHouseCleaning',
  TITLE: 'House Cleaning',
  ICON: 'fas fa-home',
  IMG: houseCleaning_img,
  isComingSoon: false,
  DESCRIPTION: `Does your home need cleaning? Book one of our clean freak Taskers to take care of it!`,
  SUGGESTION_TEXT: `Q1) Do you have pets in the house?
[Answer:   ]
Q2) describe your living room floor type (hardwood, laminate, carpet) ?
[Answer:   ]
Q3) Will the Tasker be required to move heavy items (couch, bed, etc.)?
[Answer:   ]
Q4) Anything else you want the Tasker to do?
[Answer:   ]
`,
  defaultExtrasValues: {
    effort: 'noSelection',
    kitchenCleaning: 'noSelection',
    livingRoomCleaning: 'noSelection',
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
      .required('*Please select the approximat effort required'),
    kitchenCleaning: Yup.string()
      .ensure()
      .trim()
      .oneOf(['Yes (required)', 'No (not required)'], '*Please select an option from the drop down')
      .required('*Please specify if kitchen cleaning is required'),
    livingRoomCleaning: Yup.string()
      .ensure()
      .trim()
      .oneOf(['Yes (required)', 'No (not required)'], '*Please select an option from the drop down')
      .required('*Please specify if living room cleaning is required'),
    bathroomCount: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        [
          'Bathroom cleaning is not required',
          'One Bathroom',
          'Two Bathrooms',
          'Three Bathrooms',
          'Four Bathrooms',
          'Five Bathrooms',
          'Six Bathrooms',
        ],
        '*Please select an option from the drop down',
      )
      .required('*Please select the number of bathroom that require cleaning'),
    bedroomCount: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        [
          'Bedroom cleaning is not required',
          'One Bedroom',
          'Two Bedrooms',
          'Three Bedrooms',
          'Four Bedrooms',
          'Five Bedrooms',
          'Six Bedrooms',
        ],
        '*Please select an option from the drop down',
      )
      .required('*Please select the number of bedrooms that require cleaning'),
    basementCleaning: Yup.string()
      .ensure()
      .trim()
      .oneOf(['Yes (required)', 'No (not required)'], '*Please select an option from the drop down')
      .required('*Please specify if basement cleaning is required'),
    equipmentProvider: Yup.string()
      .ensure()
      .trim()
      .oneOf(['taskerProvides', 'requesterProvides'], '*Please select an option from the drop down')
      .required('*Please specify who will provide the cleaning equipment'),
  },

  renderThankYouForPostingMoment: function (setShowModal) {
    return renderThankyouMoment({
      houseCleaning_img,
      setShowModal,
      subText: 'Our Taskers will be bidding on this request shortly',
    });
  },
  renderThankYouForPostingBid: function (setShowModal) {
    return renderThankyouMoment({
      houseCleaning_img,
      setShowModal,
      subText: 'The Requester Will Be notified. Good Luck',
      renderExtraAction: () => (
        <a
          style={{ minWidth: 200 }}
          className="button is-dark"
          onClick={() => {
            setShowModal(false);
            switchRoute(ROUTES.CLIENT.TASKER.root);
          }}
        >
          <span style={{ marginRight: 2 }}>Continue Bidding</span>
          <span className="icon">
            <i className="fas fa-chevron-right" />
          </span>
        </a>
      ),
    });
  },
  renderThankYouForEditingBid: function (setShowModal) {
    return renderThankyouMoment({
      houseCleaning_img,
      setShowModal,
      mainText: 'Bid Was Updated!',
      subText: 'The Requester Will Be notified. Good Luck',
      renderExtraAction: () => (
        <a
          style={{ minWidth: 200 }}
          className="button is-dark"
          onClick={() => {
            setShowModal(false);
            switchRoute(ROUTES.CLIENT.TASKER.root);
          }}
        >
          <span style={{ marginRight: 2 }}>Continue Bidding</span>
          <span className="icon">
            <i className="fas fa-chevron-right" />
          </span>
        </a>
      ),
    });
  },

  renderSummaryCard: function ({ withDetails = true }) {
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
                    Taskers will bring all-purpose cleaning products required to clean your house
                    thoroughly.
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
  extras: function () {
    return {
      effort: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let effortClass = '';
          let isTouched = touched && touched.effort;
          if (isTouched) {
            effortClass = values.effort === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          } else {
            effortClass = values.effort !== 'noSelection' ? 'hasSelectedValue' : '';
          }

          return (
            <React.Fragment key={'extras-effort'}>
              <div className={`group ${isTouched && errors.effort ? 'isError' : ''}`}>
                <label className={effortClass}>{'Duration (approximate)'}</label>
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
          return selectedValue ? (
            <div key={'extras-effort'} className="group">
              <label className="label hasSelectedValue">Duration (approximate)</label>
              <div className="control">{selectedValue}</div>
            </div>
          ) : null;
        },
      },
      kitchenCleaning: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let kitchenCleaningClass = '';
          let isTouched = touched && touched.kitchenCleaning;
          if (isTouched) {
            kitchenCleaningClass =
              values.kitchenCleaning === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          } else {
            kitchenCleaningClass =
              values.kitchenCleaning !== 'noSelection' ? 'hasSelectedValue' : '';
          }
          return (
            <React.Fragment key={'extras-kitchenCleaning'}>
              <div className={`group ${isTouched && errors.kitchenCleaning ? 'isError' : ''}`}>
                <label className={kitchenCleaningClass}>{'Is kitchen cleaning required?'}</label>
                <div>
                  <div className={`select ${kitchenCleaningClass} `}>
                    <select
                      id="kitchenCleaning"
                      value={values.kitchenCleaning}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="Yes (required)">Yes (required)</option>
                      <option value="No (not required)">No (not required)</option>
                    </select>
                    {isTouched && errors.kitchenCleaning && (
                      <div className="help is-danger">{errors.kitchenCleaning}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (kitchenCleaning) => {
          return kitchenCleaning ? (
            <div key={'extras-kitchenCleaning'} className="group">
              <label className="label hasSelectedValue">Kitchen cleaning</label>
              <div className="control">{kitchenCleaning}</div>
            </div>
          ) : null;
        },
      },
      livingRoomCleaning: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let livingRoomCleaningClass = '';
          let isTouched = touched && touched.livingRoomCleaning;
          if (isTouched) {
            livingRoomCleaningClass =
              values.livingRoomCleaning === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          } else {
            livingRoomCleaningClass =
              values.livingRoomCleaning !== 'noSelection' ? 'hasSelectedValue' : '';
          }
          return (
            <React.Fragment key={'extras-livingRoomCleaning'}>
              <div className={`group ${isTouched && errors.livingRoomCleaning ? 'isError' : ''}`}>
                <label className={livingRoomCleaningClass}>
                  {'Is living room cleaning required?'}
                </label>
                <div>
                  <div className={`select ${livingRoomCleaningClass} `}>
                    <select
                      id="livingRoomCleaning"
                      value={values.livingRoomCleaning}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="Yes (required)">Yes (required)</option>
                      <option value="No (not required)">No (not required)</option>
                    </select>
                    {isTouched && errors.livingRoomCleaning && (
                      <div className="help is-danger">{errors.livingRoomCleaning}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (livingRoomCleaning) => {
          return livingRoomCleaning ? (
            <div key={'extras-livingRoomCleaning'} className="group">
              <label className="label hasSelectedValue">Living room cleaning</label>
              <div className="control">{livingRoomCleaning}</div>
            </div>
          ) : null;
        },
      },
      bedroomCount: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let bedroomCountClass = '';
          let isTouched = touched && touched.bedroomCount;
          if (isTouched) {
            bedroomCountClass =
              values.bedroomCount === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          } else {
            bedroomCountClass = values.bedroomCount !== 'noSelection' ? 'hasSelectedValue' : '';
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
                      <option value="Bedroom cleaning is not required">0</option>
                      <option value="One Bedroom">1</option>
                      <option value="Two Bedrooms">2</option>
                      <option value="Three Bedrooms">3</option>
                      <option value="Four Bedrooms">4</option>
                      <option value="Five Bedrooms">5</option>
                      <option value="Six Bedrooms">6</option>
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
          return bedroomCount ? (
            <div key={'extras-bedroomCount'} className="group">
              <label className="label hasSelectedValue">Number of bedrooms</label>
              <div className="control">{bedroomCount}</div>
            </div>
          ) : null;
        },
      },
      bathroomCount: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let bathroomCountClass = '';
          let isTouched = touched && touched.bathroomCount;
          if (isTouched) {
            bathroomCountClass =
              values.bathroomCount === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          } else {
            bathroomCountClass = values.bathroomCount !== 'noSelection' ? 'hasSelectedValue' : '';
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
                      <option value="Bathroom cleaning is not required">0</option>
                      <option value="One Bathroom">1</option>
                      <option value="Two Bathrooms">2</option>
                      <option value="Three Bathrooms">3</option>
                      <option value="Four Bathrooms">4</option>
                      <option value="Five Bathrooms">5</option>
                      <option value="Six Bathrooms">6</option>
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
          return bathroomCount ? (
            <div key={'extras-bathroomCount'} className="group">
              <label className="label hasSelectedValue">Number of bathrooms</label>
              <div className="control">
                {bathroomCount === 1 ? `${bathroomCount} bathroom` : `${bathroomCount} bathrooms`}
              </div>
            </div>
          ) : null;
        },
      },
      basementCleaning: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let basementCleaningClass = '';
          let isTouched = touched && touched.basementCleaning;
          if (isTouched) {
            basementCleaningClass =
              values.basementCleaning === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          } else {
            basementCleaningClass =
              values.basementCleaning !== 'noSelection' ? 'hasSelectedValue' : '';
          }
          return (
            <React.Fragment key={'extras-basementCleaning'}>
              <div className={`group ${isTouched && errors.basementCleaning ? 'isError' : ''}`}>
                <label className={basementCleaningClass}>{'Is basement cleaning required?'}</label>
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
          return basementCleaning ? (
            <div key={'extras-basementCleaning'} className="group">
              <label className="label hasSelectedValue">Basement cleaning</label>
              <div className="control">{basementCleaning}</div>
            </div>
          ) : null;
        },
      },
      equipmentProvider: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let equipmentProviderClass = '';
          let isTouched = touched && touched.equipmentProvider;
          if (isTouched) {
            equipmentProviderClass =
              values.equipmentProvider === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          } else {
            equipmentProviderClass =
              values.equipmentProvider !== 'noSelection' ? 'hasSelectedValue' : '';
          }
          return (
            <React.Fragment key={'extras-equipmentProvider'}>
              <div className={`group ${isTouched && errors.equipmentProvider ? 'isError' : ''}`}>
                <label className={equipmentProviderClass}>
                  {'Should Tasker bring cleaning equipment (vacuum, mop, etc.)?'}
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
                      <option value="taskerProvides">Yes (Tasker brings equipment)</option>
                      <option value="requesterProvides">No (I will provide equipment)</option>
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
              valueOfField = 'Tasker must bring cleaning equipment (vacuum, mop, etc.)';
              break;
            case 'requesterProvides':
              valueOfField = 'The requester will provide equipment (vacuum, mop, etc.)';
              break;
          }
          return equipmentProvider ? (
            <div key={'extras-equipmentProvider'} className="group">
              <label className="label hasSelectedValue">
                Who will provide cleaning equipments?
              </label>
              <div className="control">{valueOfField}</div>
            </div>
          ) : null;
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
  renderExtraAction = () => null,
}) => {
  return (
    <div className="fade-in" style={{ padding: '1.5rem', background: 'white' }}>
      <div>
        <img src={houseCleaning_img} style={{ height: 125, width: 125, objectFit: 'cover' }} />
      </div>
      <h1 className="title" style={{ color: '#6a748a', fontWeight: 300, marginBottom: '0.5rem' }}>
        {mainText}
      </h1>

      <p style={{ fontSize: 18, fontWeight: 500, paddingBottom: '1rem' }}>{subText}</p>
      <div>
        <a
          style={{ minWidth: 200 }}
          className="button is-success"
          onClick={() => setShowModal(false)}
        >
          <span style={{ marginRight: 2 }}>View Inbox</span>
          <span className="icon">
            <i className="fas fa-chevron-right" />
          </span>
        </a>
      </div>
      <br></br>
      <div>{renderExtraAction()}</div>
    </div>
  );
};
