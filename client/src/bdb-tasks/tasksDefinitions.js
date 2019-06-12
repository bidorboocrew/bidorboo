import React from 'react';

const TASKS_DEFINITIONS = {
  [`bdbjob-house-cleaning`]: {
    ID: 'bdbjob-house-cleaning',
    TITLE: 'House Cleaning',
    ICON: 'fas fa-home',
    DESCRIPTION: `Does your place need a cleaning ? Tired and want to get someone to clean the bathrooms
  living room kitchen bedrooms and more ?`,
    SUGGESTION_TEXT: `*What Areas would you like the Tasker to focus on (living room , bathrooms, bedrooms) ?

*Do you have pets living in the house , if so what kind of pet (cats-dogs-hamster) ?

*Will the tasker be required to move heavy items (couch-beds-fridge) ?
`,
    IMG_URL: 'https://dingo.care2.com/pictures/greenliving/1409/1408468.large.jpg',
    extras: {
      effort: {
        renderFormOptions: ({ values, setFieldValue }) => {},
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
            <div className="field">
              <label className="label">Task Effort</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
        small: 'small (1-3 hours)',
        medium: 'medium (3-6 hours)',
        large: 'large (6-8 hours)',
      },
    },
    TASK_EXPECTATIONS: `BidOrBoo Tasker will bring All purpose cleaning products and equipments required to clean your house.
Based on your reqest the Tasker may vaccume or mop the floors, dust the furniture, clean the washrooms, kitchen, bathrooms, living room and other areas.
However the tasker will not clean things that require special treatment or the intside of the closets/kitchen cabinets.`,
  },
  [`bdbjob-car-detailing`]: {
    ID: 'bdbjob-car-detailing',
    TITLE: 'Car Detailing',
    ICON: 'fas fa-car',
    DESCRIPTION: `Does your car need cleaning and detailing inside out ? Would like the interior of your car to look and smell better ?
Get one of our tasker to give your car a good cleaning!`,
    SUGGESTION_TEXT: `*What Year Make and model is your car?

*Any particular stains or dirt that you want to make the tasker aware of ?

*Is there any pet stains or hair on the seats ?

`,
    IMG_URL: 'https://dingo.care2.com/pictures/greenliving/1409/1408468.large.jpg',
    defaultExtrasValues: {
      carSize: 'sedan',
      interiorType: 'leather',
      trunkCleaning: 'notRequired',
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
                  <label className="label">How Big Is Your Car Size?</label>
                  <div className="buttons">
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('carSize', 'mini', false)}
                      className={`button is-info ${values.carSize === 'mini' ? '' : 'is-outlined'}`}
                    >
                      {`Small (ex, mini)`}
                    </span>
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('carSize', 'sedan', false)}
                      className={`button is-info ${
                        values.carSize === 'sedan' ? '' : 'is-outlined'
                      }`}
                    >
                      {`Regular (ex, Sedan)`}
                    </span>
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('carSize', 'suv', false)}
                      className={`button is-info ${values.carSize === 'suv' ? '' : 'is-outlined'}`}
                    >
                      {`Large (ex, SUV)`}
                    </span>
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('carSize', 'truck', false)}
                      className={`button is-info ${
                        values.carSize === 'truck' ? '' : 'is-outlined'
                      }`}
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
              <div className="field">
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
                  <label className="label">What is the interior Type?</label>
                  <div className="buttons">
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('interiorType', 'leather', false)}
                      className={`button is-info ${
                        values.interiorType === 'leather' ? '' : 'is-outlined'
                      }`}
                    >
                      Leather
                    </span>
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('interiorType', 'fabric', false)}
                      className={`button is-info ${
                        values.interiorType === 'fabric' ? '' : 'is-outlined'
                      }`}
                    >
                      Fabric
                    </span>
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('interiorType', 'other', false)}
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
              <div className="field">
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
                  <label className="label">What is the interior Type?</label>
                  <div className="buttons">
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('trunkCleaning', 'isRequired', false)}
                      className={`button is-info ${
                        values.trunkCleaning === 'isRequired' ? '' : 'is-outlined'
                      }`}
                    >
                      Required
                    </span>
                    <span
                      style={{ width: 160 }}
                      onClick={() => setFieldValue('trunkCleaning', 'notRequired', false)}
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
              <div className="field">
                <label className="label">Interior Type</label>
                <div className="control">{selectedValue}</div>
              </div>
            );
          },
        },
      };
    },
    TASK_EXPECTATIONS: `BidOrBoo Tasker will bring All purpose cleaning products to clean and shine the car exterior and whipe the rims.
The Tasker will vaccum the interoir, get rid of any trash, clean the dashboard, console and gear sections. The Tasker will touch up the seats and floor mats and get rid of any pet hair
However since this is not a car shop, shampooing or deep cleaning of the seats/floors is NOT to be expected.`,
  },
};

export default TASKS_DEFINITIONS;
