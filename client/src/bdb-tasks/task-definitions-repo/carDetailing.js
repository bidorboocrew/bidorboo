import React from 'react';
import taskImage from '../../assets/images/carDetailing.png';
// import watermarker from '../../assets/images/android-chrome-192x192.png';

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
  renderSummaryCard: function({ withDetails = true, paddingValue = '1rem 1rem 1.5rem 1rem ' }) {
    return (
      <div style={{ padding: paddingValue }}>
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
                  src={watermarker}
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
                  <p style={{ color: '#6a748a' }}>
                    Does your car need thourough cleaning ? let our Taskers pamper your car.
                  </p>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
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
                <label className="withPlaceholder hasSelectedValue">{'Approximate Duration'}</label>
                <div>
                  <div className="select">
                    <select
                      value={values.carSize}
                      onChange={(event) => setFieldValue('carSize', event.target.value, true)}
                    >
                      <option value="mini">{`Small (ex, mini)`}</option>
                      <option value="sedan">{`Regular (ex, Sedan)`}</option>
                      <option value="suv">{`Large (ex, SUV)`}</option>
                      <option value="truck">{`XL (ex, Truck)`}</option>
                    </select>
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
                <label className="withPlaceholder hasSelectedValue">{'Interior Type'}</label>
                <div>
                  <div className="select">
                    <select
                      value={values.interiorType}
                      onChange={(event) => setFieldValue('interiorType', event.target.value, true)}
                    >
                      <option value="leather">Leather</option>
                      <option value="fabric">Fabric</option>
                      <option value="other">Other</option>
                    </select>
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
                <label className="withPlaceholder hasSelectedValue">Trunk Cleaning</label>
                <div>
                  <div className="select">
                    <select
                      value={values.isRequired}
                      onChange={(event) => setFieldValue('isRequired', event.target.value, true)}
                    >
                      <option values="isRequired">Requires Cleaning</option>
                      <option values="notRequired">Not Required</option>
                    </select>
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
