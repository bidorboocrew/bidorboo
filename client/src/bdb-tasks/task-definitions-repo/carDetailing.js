import React from 'react';
import taskImage from '../../assets/images/carDetailing.png';
import watermark from '../../assets/images/watermark.png';

import * as Yup from 'yup';

const NO_SELECTION = NO_SELECTION;

export default {
  ID: 'bdbCarDetailing',
  TITLE: 'Car Detailing',
  ICON: 'fas fa-car',
  DESCRIPTION: `Does your car need thourough cleaning ? let our Taskers pamper your car`,
  SUGGESTION_TEXT: `*What Year Make and model is your car?

*Any particular stains or dirt that you want to make the tasker aware of ?

*Is there any pet stains or hair on the seats ?

`,
  TASK_EXPECTATIONS: `BidOrBoo Tasker will bring the cleaning products and equipments required to clean your car thouroughally`,

  defaultExtrasValues: {
    carSize: NO_SELECTION,
    interiorType: NO_SELECTION,
    trunkCleaning: NO_SELECTION,
  },
  extraValidationSchema: {
    carSize: Yup.string()
      .ensure()
      .trim()
      .oneOf(['mini', 'sedan', 'suv', 'truck'], '*Please select an option from the drop down')
      .required('*Please select a value from the drop down'),

    interiorType: Yup.string()
      .ensure()
      .trim()
      .oneOf(['leather', 'fabric', 'other'], '*Please select a value from the drop down')
      .required('*Please select a value from the drop down'),
    trunkCleaning: Yup.string()
      .ensure()
      .trim()
      .oneOf(['isRequired', 'notRequired'], '*Please select a value from the drop down')
      .required('*Please select a value from the drop down'),
  },
  renderSummaryCard: function({ withDetails = true }) {
    return (
      <div style={{ padding: '1rem' }}>
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <div className="watermark">
                <img
                  src={taskImage}
                  alt="BidOrBoo task img"
                  style={{ borderRadius: '100%', height: 125, width: 125, objectFit: 'cover' }}
                />
                {/* <img
                  src={watermark}
                  className="watermarker"
                  style={{ borderRadius: '100%', height: 125, width: 125, objectFit: 'cover' }}
                /> */}
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div style={{ maxWidth: 320, paddingLeft: '1.5rem' }}>
                <h1 className="title" style={{ fontWeight: 300, marginBottom: '1.5rem' }}>
                  Car Detailing
                </h1>
                {withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1.25rem' }}>
                    Does your car need thourough cleaning ? let our Taskers pamper your car.
                  </p>
                )}

                {!withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1.25rem' }}>
                    BidOrBoo Tasker will bring the cleaning products and equipments required to
                    clean your car thouroughally
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
    if (!values.carSize || values.carSize === NO_SELECTION) {
      errors.carSize = '*Please select a value from the drop down';
    }
    if (!values.interiorType || values.interiorType === NO_SELECTION) {
      errors.interiorType = '*Please select a value from the drop down';
    }
    if (!values.trunkCleaning || values.trunkCleaning === NO_SELECTION) {
      errors.trunkCleaning = '*Please select a value from the drop down';
    }
    return errors;
  },
  extras: function() {
    return {
      carSize: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          // this is assumed to render in the context of a formik form
          let carSizeSelectClass = '';
          let isTouched = touched && touched.carSize;
          if (isTouched) {
            carSizeSelectClass = values.carSize === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-carSize'}>
              <div className={`group ${isTouched && errors.carSize ? 'isError' : ''}`}>
                <label className={carSizeSelectClass}>{'Approximate Duration'}</label>
                <div>
                  <div className={`select ${carSizeSelectClass} `}>
                    <select
                      id="carSize"
                      value={values.carSize}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>.
                      <option value="mini">{`Small (ex, mini)`}</option>
                      <option value="sedan">{`Regular (ex, Sedan)`}</option>
                      <option value="suv">{`Large (ex, SUV)`}</option>
                      <option value="truck">{`XL (ex, Truck)`}</option>
                    </select>
                    {isTouched && errors.carSize && (
                      <div className="help is-danger">{errors.carSize}</div>
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
            case 'mini':
              selectedValue = 'Small (ex, mini)';
              break;
            case 'sedan':
              selectedValue = 'Regular (ex, Sedan)';
              break;
            case 'suv':
              selectedValue = 'Large (ex, SUV)';
              break;
            case 'truck':
              selectedValue = 'XL (ex, Truck)';
              break;
          }
          return (
            <div key={'extras-carSize'} className="group saidTest">
              <label className="label">Car Size</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
      interiorType: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          let interiorTypeClass = '';
          let isTouched = touched && touched.interiorType;
          if (isTouched) {
            interiorTypeClass =
              values.interiorType === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-interiorType'}>
              <div className={`group ${isTouched && errors.interiorType ? 'isError' : ''}`}>
                <label className={interiorTypeClass}>{'Interior Type'}</label>
                <div>
                  <div className={`select ${interiorTypeClass} `}>
                    <select
                      id="interiorType"
                      value={values.interiorType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>.
                      <option value="leather">Leather</option>
                      <option value="fabric">Fabric</option>
                      <option value="other">Other</option>
                    </select>
                    {isTouched && errors.interiorType && (
                      <div className="help is-danger">{errors.interiorType}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (interiorType) => {
          let selectedValue = null;
          switch (interiorType) {
            case 'leather':
              selectedValue = 'Leather';
              break;
            case 'fabric':
              selectedValue = 'Fabric';
              break;
            case 'other':
              selectedValue = 'Other';
              break;
          }
          return (
            <div key={'extras-interiorType'} className="group saidTest">
              <label className="label">Interior Type</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
      trunkCleaning: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          // this is assumed to render in the context of a formik form

          let trunkCleaningClass = '';
          let isTouched = touched && touched.trunkCleaning;
          if (isTouched) {
            trunkCleaningClass =
              values.trunkCleaning === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
          }
          return (
            <React.Fragment key={'extras-trunkCleaning'}>
              <div className={`group ${isTouched && errors.trunkCleaning ? 'isError' : ''}`}>
                <label className={trunkCleaningClass}>Trunk Cleaning</label>
                <div>
                  <div className={`select ${trunkCleaningClass}`}>
                    <select
                      id="trunkCleaning"
                      value={values.trunkCleaning}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>.
                      <option value="isRequired">Requires Cleaning</option>
                      <option value="notRequired">Not Required</option>
                    </select>
                    {isTouched && errors.trunkCleaning && (
                      <div className="help is-danger">{errors.trunkCleaning}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (requiresTrunkCleaning) => {
          let selectedValue = null;
          switch (requiresTrunkCleaning) {
            case 'isRequired':
              selectedValue = 'Requires Cleaning';
              break;
            case 'notRequired':
              selectedValue = 'Not Required';
              break;
          }
          return (
            <div key={'extras-trunkCleaning'} className="group saidTest">
              <label className="label">Trunk cleaning</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
    };
  },
};
