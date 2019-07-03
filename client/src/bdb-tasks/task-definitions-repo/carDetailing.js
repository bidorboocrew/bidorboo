import React from 'react';

export default {
  ID: 'bdbCarDetailing',
  TITLE: 'Car Detailing',
  ICON: 'fas fa-car',
  DESCRIPTION: `Does your car need cleaning and detailing inside out ? Would like the interior of your car to look and smell better ?
Get one of our tasker to give your car a good cleaning!`,
  SUGGESTION_TEXT: `*What Year Make and model is your car?

*Any particular stains or dirt that you want to make the tasker aware of ?

*Is there any pet stains or hair on the seats ?

`,
  defaultExtrasValues: {
    carSize: 'sedan',
    interiorType: 'leather',
    trunkCleaning: 'notRequired',
  },
  extrasValidation: function() {
    const { values } = this.props;
    if (!values.carSize) {
      alert('please choose a car size');
      return false;
    }
    if (!values.interiorType) {
      alert('please choose an interior type');
      return false;
    }
    if (!values.trunkCleaning) {
      alert('please specify if trunk cleaning is required');
      return false;
    }
    return true;
  },
  extras: function() {
    return {
      carSize: {
        renderFormOptions: ({ values, setFieldValue }) => {
          // this is assumed to render in the context of a formik form
          return (
            <React.Fragment key={'extras-carSize'}>
              <input
                id="carSize"
                className="input is-invisible"
                type="hidden"
                value={values.carSize}
              />
              <div className="field">
                <label className="label">How Big Is Your Car?</label>
                <div className="buttons">
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('carSize', 'mini', true)}
                    className={`button is-info ${values.carSize === 'mini' ? '' : 'is-outlined'}`}
                  >
                    {`Small (ex, mini)`}
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('carSize', 'sedan', true)}
                    className={`button is-info ${values.carSize === 'sedan' ? '' : 'is-outlined'}`}
                  >
                    {`Regular (ex, Sedan)`}
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('carSize', 'suv', true)}
                    className={`button is-info ${values.carSize === 'suv' ? '' : 'is-outlined'}`}
                  >
                    {`Large (ex, SUV)`}
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('carSize', 'truck', true)}
                    className={`button is-info ${values.carSize === 'truck' ? '' : 'is-outlined'}`}
                  >
                    {`XL (ex, Truck)`}
                  </span>
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
            <div key={'extras-carSize'} className="field">
              <label className="label">Car Size</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
      interiorType: {
        renderFormOptions: ({ values, setFieldValue }) => {
          return (
            <React.Fragment key={'extras-interiorType'}>
              <input
                id="interiorType"
                className="input is-invisible"
                type="hidden"
                value={values.interiorType}
              />
              <div className="field">
                <label className="label">What is the car's interior Type?</label>
                <div className="buttons">
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('interiorType', 'leather', true)}
                    className={`button is-info ${
                      values.interiorType === 'leather' ? '' : 'is-outlined'
                    }`}
                  >
                    Leather
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('interiorType', 'fabric', true)}
                    className={`button is-info ${
                      values.interiorType === 'fabric' ? '' : 'is-outlined'
                    }`}
                  >
                    Fabric
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('interiorType', 'other', true)}
                    className={`button is-info ${
                      values.interiorType === 'other' ? '' : 'is-outlined'
                    }`}
                  >
                    Other
                  </span>
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
            <div key={'extras-interiorType'} className="field">
              <label className="label">Interior Type</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
      trunkCleaning: {
        renderFormOptions: ({ values, setFieldValue }) => {
          // this is assumed to render in the context of a formik form
          return (
            <React.Fragment key={'extras-trunkCleaning'}>
              <input
                id="interiorType"
                className="input is-invisible"
                type="hidden"
                value={values.interiorType}
              />
              <div className="field">
                <label className="label">Do you require trunk cleaning?</label>
                <div className="buttons">
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('trunkCleaning', 'isRequired', true)}
                    className={`button is-info ${
                      values.trunkCleaning === 'isRequired' ? '' : 'is-outlined'
                    }`}
                  >
                    Required
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('trunkCleaning', 'notRequired', true)}
                    className={`button is-info ${
                      values.trunkCleaning === 'notRequired' ? '' : 'is-outlined'
                    }`}
                  >
                    Not Required
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        },
        renderSelection: (requiresTrunkCleaning) => {
          let selectedValue = null;
          switch (requiresTrunkCleaning) {
            case 'isRequired':
              selectedValue = 'Required';
              break;
            case 'notRequired':
              selectedValue = 'Not Required';
              break;
          }
          return (
            <div key={'extras-trunkCleaning'} className="field">
              <label className="label">Trunk cleaning</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
    };
  },
  TASK_EXPECTATIONS: `BidOrBoo Tasker will bring the cleaning products and equipments required to clean your car thouroughally`,
};
