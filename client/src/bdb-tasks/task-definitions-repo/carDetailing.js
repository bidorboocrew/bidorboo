import React from 'react';

export default {
  ID: 'bdbCarDetailing',
  TITLE: 'Car Detailing',
  ICON: 'fas fa-car',
  DESCRIPTION: `Does your car need thourough cleaning ? let our Taskers pamper your car`,
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

              <div className="group">
                <div className="select">
                  <select>
                    <option
                      selected={values.carSize === 'mini'}
                      onClick={() => setFieldValue('carSize', 'mini', true)}
                    >
                      {`Small (ex, mini)`}
                    </option>
                    <option
                      selected={values.carSize === 'sedan'}
                      onClick={() => setFieldValue('carSize', 'sedan', true)}
                    >
                      {`Regular (ex, Sedan)`}
                    </option>
                    <option
                      selected={values.carSize === 'suv'}
                      onClick={() => setFieldValue('carSize', 'suv', true)}
                    >
                      {`Large (ex, SUV)`}
                    </option>
                    <option
                      selected={values.carSize === 'truck'}
                      onClick={() => setFieldValue('carSize', 'truck', true)}
                    >
                      {`XL (ex, Truck)`}
                    </option>
                  </select>
                </div>
                <span className="highlight" />
                <span className="bar" />
                <label className="withPlaceholder hasSelectedValue">{'Approximate Duration'}</label>
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

              <div className="group">
                <div className="select">
                  <select>
                    <option
                      selected={values.interiorType === 'leather'}
                      onClick={() => setFieldValue('interiorType', 'leather', true)}
                    >
                      Leather
                    </option>
                    <option
                      selected={values.interiorType === 'fabric'}
                      onClick={() => setFieldValue('interiorType', 'fabric', true)}
                    >
                      Fabric
                    </option>
                    <option
                      selected={values.interiorType === 'other'}
                      onClick={() => setFieldValue('interiorType', 'other', true)}
                    >
                      Other
                    </option>
                  </select>
                </div>
                <span className="highlight" />
                <span className="bar" />
                <label className="withPlaceholder hasSelectedValue">{'Interior Type'}</label>
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
                id="trunkCleaning"
                className="input is-invisible"
                type="hidden"
                value={values.trunkCleaning}
              />

              <div className="group">
                <div className="select">
                  <select>
                    <option
                      selected={values.trunkCleaning === 'leather'}
                      onClick={() => setFieldValue('isRequired', 'isRequired', true)}
                    >
                      Requires Cleaning
                    </option>
                    <option
                      selected={values.trunkCleaning === 'fabric'}
                      onClick={() => setFieldValue('notRequired', 'notRequired', true)}
                    >
                      Not Required
                    </option>
                  </select>
                </div>
                <span className="highlight" />
                <span className="bar" />
                <label className="withPlaceholder hasSelectedValue">Trunk Cleaning</label>
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
