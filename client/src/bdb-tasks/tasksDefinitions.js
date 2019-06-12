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
        renderFormOptions: () => {},
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
    DESCRIPTION: `Does your car need cleaning and detailing inside out ? Tired and would like the interior of your car to look and smell better ?
Get one of our tasker to give your car a good cleaning and leave it fresh!`,
    SUGGESTION_TEXT: `*What Year Make and model is your car?

*Any particular stains or dirt that you want to make the tasker aware of ?

*Is there any pet stains or hair on the seats ?

`,
    IMG_URL: 'https://dingo.care2.com/pictures/greenliving/1409/1408468.large.jpg',
    extras: {
      carSize: {
        renderFormOptions: () => {
          // this is assumed to render in the context of a formik form
        },
        renderSelection: (size) => {
          let selectedValue = null;
          switch (size) {
            case 'mini':
              selectedValue = 'mini';
              break;
            case 'sedan':
              selectedValue = 'sedan';
              break;
            case 'suv':
              selectedValue = 'suv';
              break;
            case 'truck':
              selectedValue = 'truck';
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
        renderFormOptions: () => {
          // this is assumed to render in the context of a formik form
        },
        renderSelection: (interiorType) => {
          let selectedValue = null;
          switch (interiorType) {
            case 'leather':
              selectedValue = 'mini';
              break;
            case 'fabric':
              selectedValue = 'sedan';
              break;
            case 'other':
              selectedValue = 'suv';
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
        renderFormOptions: () => {
          // this is assumed to render in the context of a formik form
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
    },
    TASK_EXPECTATIONS: `BidOrBoo Tasker will bring All purpose cleaning products to clean and shine the car exterior and whipe the rims.
The Tasker will vaccum the interoir, get rid of any trash, clean the dashboard, console and gear sections. The Tasker will touch up the seats and floor mats and get rid of any pet hair
However since this is not a car shop, shampooing or deep cleaning of the seats/floors is NOT to be expected.`,
  },
};

export default TASKS_DEFINITIONS;
