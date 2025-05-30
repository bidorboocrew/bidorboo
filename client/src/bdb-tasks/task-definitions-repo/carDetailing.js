import React from 'react';

import * as Yup from 'yup';
import carDetailing_img from '../../assets/images/carDetailing_img.png';
import { switchRoute } from './../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

const NO_SELECTION = 'noSelection';
export default {
  ID: 'bdbCarDetailing',
  TITLE: 'Car Detailing',
  ICON: 'fas fa-car',
  IMG: carDetailing_img,
  isComingSoon: false,
  DESCRIPTION: `Your car deserves some love. let our Taskers pamper your car and give it a scrub`,
  SUGGESTION_TEXT: `Q1) What Year Make and model is your car?
[Answer:   ]
Q2) Do you want the Tasker to clean the exterior, interior or both?
[Answer:   ]
Q3) Is there any pet stains or hair on the seats?
[Answer:   ]
Q4) Anything else you want the Tasker to do?
[Answer:   ]
`,
  TASK_EXPECTATIONS: `BidOrBoo Tasker will bring the cleaning products and equipments required to clean your car thouroughally`,
  defaultExtrasValues: {
    carSize: NO_SELECTION,
    interiorType: NO_SELECTION,
    trunkCleaning: NO_SELECTION,
    exteriorCleaning: NO_SELECTION,
    rimsCleaning: NO_SELECTION,
  },
  requiresDestinationField: false,
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
    exteriorCleaning: Yup.string()
      .ensure()
      .trim()
      .oneOf(['isRequired', 'notRequired'], '*Please select a value from the drop down')
      .required('*Please select a value from the drop down'),
    rimsCleaning: Yup.string()
      .ensure()
      .trim()
      .oneOf(['isRequired', 'notRequired'], '*Please select a value from the drop down')
      .required('*Please select a value from the drop down'),
  },
  renderThankYouForPostingMoment: function (setShowModal) {
    return renderThankyouMoment({
      carDetailing_img,
      setShowModal,
      subText: 'Our Taskers will be bidding on this request shortly',
    });
  },
  renderThankYouForPostingBid: function (setShowModal) {
    return renderThankyouMoment({
      carDetailing_img,
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
      carDetailing_img,
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
                {/* <i className="fas fa-car-alt" style={{ fontSize: 68, color: '#ee2a36' }} /> */}
                <img
                  src={carDetailing_img}
                  alt="BidOrBoo task"
                  style={{
                    height: 125,
                    width: 125,
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div style={{ maxWidth: 320, paddingLeft: '1.5rem' }}>
                <h1 className="title" style={{ fontWeight: 300, marginBottom: '0.5rem' }}>
                  Car Detailing
                </h1>
                {withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    Your car deserves some love. let our Taskers pamper your car and give it a
                    scrub.
                  </p>
                )}

                {!withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1rem' }}>
                    Tasker will bring the cleaning products and equipments required to clean your
                    car thouroughally. Tasker is NOT Allowed to drive your vehicle.
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
  //   if (!values.carSize || values.carSize === NO_SELECTION) {
  //     errors.carSize = '*Please select a value from the drop down';
  //   }
  //   if (!values.interiorType || values.interiorType === NO_SELECTION) {
  //     errors.interiorType = '*Please select a value from the drop down';
  //   }
  //   if (!values.trunkCleaning || values.trunkCleaning === NO_SELECTION) {
  //     errors.trunkCleaning = '*Please select a value from the drop down';
  //   }
  //   return errors;
  // },
  enableImageUploadField: true,
  extras: function () {
    return {
      carSize: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          // this is assumed to render in the context of a formik form
          let carSizeSelectClass = '';
          let isTouched = touched && touched.carSize;
          if (isTouched) {
            carSizeSelectClass = values.carSize === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
          } else {
            carSizeSelectClass = values.carSize !== 'noSelection' ? 'hasSelectedValue' : '';
          }

          return (
            <React.Fragment key={'extras-carSize'}>
              <div className={`group ${isTouched && errors.carSize ? 'isError' : ''}`}>
                <label className={carSizeSelectClass}>{'Car size'}</label>
                <div>
                  <div className={`select ${carSizeSelectClass} `}>
                    <select
                      id="carSize"
                      value={values.carSize}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>
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
            <div key={'extras-carSize'} className="group">
              <label className="label hasSelectedValue">Car size</label>
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
          } else {
            interiorTypeClass = values.interiorType !== 'noSelection' ? 'hasSelectedValue' : '';
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
            <div key={'extras-interiorType'} className="group">
              <label className="label hasSelectedValue">Interior Type</label>
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
          } else {
            trunkCleaningClass = values.trunkCleaning !== 'noSelection' ? 'hasSelectedValue' : '';
          }
          return (
            <React.Fragment key={'extras-trunkCleaning'}>
              <div className={`group ${isTouched && errors.trunkCleaning ? 'isError' : ''}`}>
                <label className={trunkCleaningClass}>Trunk cleaning</label>
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
          return (
            <div key={'extras-trunkCleaning'} className="group">
              <label className="label hasSelectedValue">Trunk cleaning</label>
              <div className="control">{requiresTrunkCleaning}</div>
            </div>
          );
        },
      },
      exteriorCleaning: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          // this is assumed to render in the context of a formik form

          let exteriorCleaningClass = '';
          let isTouched = touched && touched.exteriorCleaning;
          if (isTouched) {
            exteriorCleaningClass =
              values.exteriorCleaning === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
          } else {
            exteriorCleaningClass =
              values.exteriorCleaning !== 'noSelection' ? 'hasSelectedValue' : '';
          }
          return (
            <React.Fragment key={'extras-exteriorCleaning'}>
              <div className={`group ${isTouched && errors.exteriorCleaning ? 'isError' : ''}`}>
                <label className={exteriorCleaningClass}>Exterior cleaning</label>
                <div>
                  <div className={`select ${exteriorCleaningClass}`}>
                    <select
                      id="exteriorCleaning"
                      value={values.exteriorCleaning}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>.
                      <option value="isRequired">Requires Cleaning</option>
                      <option value="notRequired">Not Required</option>
                    </select>
                    {isTouched && errors.exteriorCleaning && (
                      <div className="help is-danger">{errors.exteriorCleaning}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (requiresExteriorCleaning) => {
          return (
            <div key={'extras-exteriorCleaning'} className="group">
              <label className="label hasSelectedValue">Exterior cleaning</label>
              <div className="control">{requiresExteriorCleaning}</div>
            </div>
          );
        },
      },
      rimsCleaning: {
        renderFormOptions: ({ errors, values, touched, handleChange, handleBlur }) => {
          // this is assumed to render in the context of a formik form

          let rimsCleaningClass = '';
          let isTouched = touched && touched.rimsCleaning;
          if (isTouched) {
            rimsCleaningClass =
              values.rimsCleaning === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
          } else {
            rimsCleaningClass = values.rimsCleaning !== 'noSelection' ? 'hasSelectedValue' : '';
          }
          return (
            <React.Fragment key={'extras-RimsCleaning'}>
              <div className={`group ${isTouched && errors.RimsCleaning ? 'isError' : ''}`}>
                <label className={rimsCleaningClass}>Rims cleaning</label>
                <div>
                  <div className={`select ${rimsCleaningClass}`}>
                    <select
                      id="rimsCleaning"
                      value={values.rimsCleaning}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="noSelection">-Select One-</option>.
                      <option value="isRequired">Requires cleaning</option>
                      <option value="notRequired">Not required</option>
                    </select>
                    {isTouched && errors.rimsCleaning && (
                      <div className="help is-danger">{errors.rimsCleaning}</div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (requiresRimsCleaning) => {
          return (
            <div key={'extras-rimsCleaning'} className="group">
              <label className="label hasSelectedValue">Rims cleaning</label>
              <div className="control">{requiresRimsCleaning}</div>
            </div>
          );
        },
      },
    };
  },
};

const renderThankyouMoment = ({
  carDetailing_img,
  setShowModal,
  mainText = 'Thank You!',
  subText,
  renderExtraAction = () => null,
}) => {
  return (
    <div className="fade-in" style={{ padding: '1.5rem', background: 'white' }}>
      <div>
        <img
          src={carDetailing_img}
          alt="BidOrBoo Thank You"
          style={{ height: 125, width: 125, objectFit: 'cover' }}
        />
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
