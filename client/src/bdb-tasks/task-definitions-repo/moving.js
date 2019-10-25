import React from 'react';

import * as Yup from 'yup';
import moving_img from '../../assets/images/moving_img.png';

export default {
  ID: 'bdbMoving',
  TITLE: 'Moving/Lifting Helpers',
  ICON: 'fas fa-home',
  IMG: moving_img,
  DESCRIPTION: `Do you need help moving or lifting heavy furniture ? Get our strong taskers to help you out.`,
  SUGGESTION_TEXT: `Q1)Any special heavy items ?
[Answer here:   ]
Q2)Any items that require extreme caution or care ?
[Answer here:   ]
`,
  defaultExtrasValues: {
    approximateDuration: 'noSelection',
    houseType: 'noSelection',
    requiresTaskerWithCar: 'noSelection',
    trollyProvided: 'noSelection',
    toolsForDisassembly: 'noSelection',
  },
  requiresDestinationField: true,
  extraValidationSchema: {
    approximateDuration: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        [
          '1 hour',
          '2 hours',
          '3 hours',
          '4 hours',
          '5 hours',
          '6 hours',
          '7 hours',
          '8 hours',
          '9 hours',
          '10 hours',
        ],
        '*Please select an option from the drop down',
      )
      .required('*Please select the approximate duration of the service'),
    houseType: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        [
          'xs (single bedroom)',
          'small (bachlor)',
          'medium (condo appartment)',
          'large (townhouse/duplex)',
          'xl (bungalow/house)',
        ],
        '*Please select an option from the drop down',
      )
      .required('*Please select your current home type'),
    requiresTaskerWithCar: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        ['No, no car needed', 'Yes, Any car is good', 'Yes, must have an SUV'],
        "*Please select tasker's car requirement from the drop down",
      )
      .required('*Please select the number of bathroom that require cleaning'),
    trollyProvided: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        ['Yes (trolly provided)', 'No (trolly not provided)'],
        '*Please select an option from the drop down',
      )
      .required('*Please specify if trolly will be provided'),
    toolsForDisassembly: Yup.string()
      .ensure()
      .trim()
      .oneOf(
        [
          'Yes (requester will provide tools)',
          'No (Tasker is required to bring tools)',
          'Optional (Tasker should bring tools to speed things up)',
        ],
        '*Please select an option from the drop down',
      )
      .required('*Please specify if trolly will be provided'),
  },

  renderThankYouForPostingMoment: function(setShowModal) {
    return renderThankyouMoment({
      moving_img,
      setShowModal,
      subText: 'Our Taskers will be bidding on this request shortly',
    });
  },
  renderThankYouForPostingBid: function(setShowModal) {
    return renderThankyouMoment({
      moving_img,
      setShowModal,
      subText: 'The Requester Will Be notified. Good Luck',
    });
  },
  renderThankYouForEditingBid: function(setShowModal) {
    return renderThankyouMoment({
      moving_img,
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
                <img src={moving_img} style={{ height: 125, width: 125, objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div style={{ maxWidth: 320, paddingLeft: '1.5rem' }}>
                <h1 className="title" style={{ fontWeight: 300, marginBottom: '0.5rem' }}>
                  Moving/heavy lifting
                </h1>
                {withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    Do you need help moving or lifting heavy furniture ? Get our strong taskers to
                    help you out.
                  </p>
                )}
                {!withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    BIDORBOO Tasker will help you move or pack if required, but you must be
                    reasonable and have enough people to carry heavier items safely. Moving is never
                    easy and we want to inform you that While our taskers will do thier best and
                    care for all your valuables while moving HOWEVER It is YOUR responsibility to
                    wrap things well and to inform taskers of any fragile pieces.
                  </p>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  },

  enableImageUploadField: false,
  extras: function() {
    return {
      approximateDuration: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let approximateDurationClass = '';
          let isTouched = touched && touched.approximateDuration;
          if (isTouched) {
            approximateDurationClass =
              values.approximateDuration === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-approximateDuration'}>
              <div className={`group ${isTouched && errors.approximateDuration ? 'isError' : ''}`}>
                <label className={approximateDurationClass}>
                  {'How many hours will you need?'}
                </label>
                <div>
                  <div className={`select ${approximateDurationClass} `}>
                    <select
                      id="approximateDuration"
                      value={values.approximateDuration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                      <option value="3 hours">3 hours</option>
                      <option value="4 hours">4 hours</option>
                      <option value="5 hours">5 hours</option>
                      <option value="6 hours">6 hours</option>
                      <option value="7 hours">7 hours</option>
                      <option value="8 hours">8 hours</option>
                      <option value="9 hours">9 hours</option>
                      <option value="10 hours">10 hours</option>
                    </select>
                    {isTouched && errors.approximateDuration && (
                      <div className="help is-danger">{errors.approximateDuration}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (approximateDuration) => {
          return (
            <div key={'extras-approximateDuration'} className="group">
              <label className="label hasSelectedValue">Required task durations</label>
              <div className="control">{approximateDuration}</div>
            </div>
          );
        },
      },
      houseType: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let houseTypeClass = '';
          let isTouched = touched && touched.houseType;
          if (isTouched) {
            houseTypeClass = values.houseType === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-houseType'}>
              <div className={`group ${isTouched && errors.houseType ? 'isError' : ''}`}>
                <label className={houseTypeClass}>{'What type of home are you in?'}</label>
                <div>
                  <div className={`select ${houseTypeClass} `}>
                    <select
                      id="houseType"
                      value={values.houseType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="xs (single bedroom)">xs (single bedroom)</option>
                      <option value="small (bachlor)">small (bachlor)</option>
                      <option value="medium (condo appartment)">medium (condo appartment)</option>
                      <option value="large (townhouse/duplex)">large (townhouse/duplex)</option>
                      <option value="xl (bungalow/house)">xl (bungalow/house)</option>
                    </select>
                    {isTouched && errors.houseType && (
                      <div className="help is-danger">{errors.houseType}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (houseType) => {
          return (
            <div key={'extras-houseType'} className="group">
              <label className="label hasSelectedValue">Type of home</label>
              <div className="control">{houseType}</div>
            </div>
          );
        },
      },

      requiresTaskerWithCar: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let requiresTaskerWithCarClass = '';
          let isTouched = touched && touched.requiresTaskerWithCar;
          if (isTouched) {
            requiresTaskerWithCarClass =
              values.requiresTaskerWithCar === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-requiresTaskerWithCar'}>
              <div
                className={`group ${isTouched && errors.requiresTaskerWithCar ? 'isError' : ''}`}
              >
                <label className={requiresTaskerWithCarClass}>
                  {"Do you require tasker's car for the move?"}
                </label>
                <div>
                  <div className={`select ${requiresTaskerWithCarClass} `}>
                    <select
                      id="requiresTaskerWithCar"
                      value={values.requiresTaskerWithCar}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="No, no car needed">No, no car needed</option>
                      <option value="Yes, Any car is good">Yes, Any car is good</option>
                      <option value="Yes, must have an SUV">Yes, must have an SUV</option>
                    </select>
                    {isTouched && errors.requiresTaskerWithCar && (
                      <div className="help is-danger">{errors.requiresTaskerWithCar}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (requiresTaskerWithCar) => {
          return (
            <div key={'extras-requiresTaskerWithCar'} className="group">
              <label className="label hasSelectedValue">
                Do you require tasker's car for the move
              </label>
              <div className="control">{requiresTaskerWithCar}</div>
            </div>
          );
        },
      },
      toolsForDisassembly: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let toolsForDisassemblyClass = '';
          let isTouched = touched && touched.toolsForDisassembly;
          if (isTouched) {
            toolsForDisassemblyClass =
              values.toolsForDisassembly === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-toolsForDisassembly'}>
              <div className={`group ${isTouched && errors.toolsForDisassembly ? 'isError' : ''}`}>
                <label className={toolsForDisassemblyClass}>
                  {'Will requester provide tools for furniture assembly/disassembly?'}
                </label>
                <div>
                  <div className={`select ${toolsForDisassemblyClass} `}>
                    <select
                      id="toolsForDisassembly"
                      value={values.toolsForDisassembly}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="Yes (requester will provide tools)">
                        Yes (requester will provide tools)
                      </option>
                      <option value="No (Tasker is required to bring tools)">
                        No (Tasker is required to bring tools)
                      </option>
                      <option value="Optional (Tasker should bring tools to speed things up)">
                        Optional (Tasker should bring tools to speed things up)
                      </option>
                    </select>
                    {isTouched && errors.toolsForDisassembly && (
                      <div className="help is-danger">{errors.toolsForDisassembly}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (toolsForDisassembly) => {
          return (
            <div key={'extras-toolsForDisassembly'} className="group">
              <label className="label hasSelectedValue">
                Will requester provide tools for furniture assembly/disassembly?
              </label>
              <div className="control">{toolsForDisassembly}</div>
            </div>
          );
        },
      },
      trollyProvided: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let trollyProvidedClass = '';
          let isTouched = touched && touched.trollyProvided;
          if (isTouched) {
            trollyProvidedClass =
              values.trollyProvided === 'noSelection' ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-trollyProvided'}>
              <div className={`group ${isTouched && errors.trollyProvided ? 'isError' : ''}`}>
                <label className={trollyProvidedClass}>
                  {'Will requester provide trolly for the move?'}
                </label>
                <div>
                  <div className={`select ${trollyProvidedClass} `}>
                    <select
                      id="trollyProvided"
                      value={values.trollyProvided}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
                      <option value="Yes (trolly provided)">Yes (trolly provided)</option>
                      <option value="No (trolly not provided)">No (trolly not provided)</option>
                    </select>
                    {isTouched && errors.trollyProvided && (
                      <div className="help is-danger">{errors.trollyProvided}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (trollyProvided) => {
          return (
            <div key={'extras-trollyProvided'} className="group">
              <label className="label hasSelectedValue">
                Will requester provide trolly for the move
              </label>
              <div className="control">{trollyProvided}</div>
            </div>
          );
        },
      },
    };
  },
  TASK_EXPECTATIONS: ` BIDORBOO Tasker will help you move or pack if required, but you must be
  reasonable and have enough people to carry heavier items safely. Moving is never
  easy and we want to inform you that While our taskers will do thier best and
  care for all your valuables while moving HOWEVER It is YOUR responsibility to
  wrap things well and to inform taskers of any fragile pieces.`,
};
const renderThankyouMoment = ({ moving_img, setShowModal, mainText = 'Thank You!', subText }) => {
  return (
    <div style={{ padding: '1.5rem', background: 'white' }}>
      <div>
        <img src={moving_img} style={{ height: 125, width: 125, objectFit: 'cover' }} />
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
