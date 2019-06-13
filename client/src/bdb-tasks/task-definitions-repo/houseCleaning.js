import React from 'react';

export default {
  ID: 'bdbHouseCleaning',
  TITLE: 'House Cleaning',
  ICON: 'fas fa-home',
  DESCRIPTION: `Does your place need a cleaning ? Tired and want to get someone to clean the bathrooms
living room kitchen bedrooms and more ?`,
  SUGGESTION_TEXT: `*What Areas would you like the Tasker to focus on (living room , bathrooms, bedrooms) ?

*Do you have pets living in the house , if so what kind of pet (cats-dogs-hamster) ?

*Will the tasker be required to move heavy items (couch-beds-fridge) ?
`,

  defaultExtrasValues: {
    effort: 'small',
  },
  extrasValidation: function() {
    const { values } = this.props;
    if (!values.effort) {
      alert('please specify the effort');
      return false;
    }
    return true;
  },
  extras: function() {
    return {
      effort: {
        renderFormOptions: ({ values, setFieldValue }) => {
          return (
            <React.Fragment key={'extras-effort'}>
              <input
                id="effort"
                className="input is-invisible"
                type="hidden"
                value={values.effort}
              />
              <div className="field">
                <label className="label">How long would you like to book?</label>
                <div className="buttons">
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('effort', 'small', true)}
                    className={`button is-info ${values.effort === 'small' ? '' : 'is-outlined'}`}
                  >
                    {`Small (1-3 hours)`}
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('effort', 'medium', true)}
                    className={`button is-info ${values.effort === 'medium' ? '' : 'is-outlined'}`}
                  >
                    {`Medium (3-6 hours)`}
                  </span>
                  <span
                    style={{ width: 160 }}
                    onClick={() => setFieldValue('effort', 'sulargev', true)}
                    className={`button is-info ${values.effort === 'large' ? '' : 'is-outlined'}`}
                  >
                    {`Large (6-8 hours)`}
                  </span>
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
            <div key={'extras-effort'} className="field">
              <label className="label">Task Effort</label>
              <div className="control">{selectedValue}</div>
            </div>
          );
        },
      },
    };
  },
  TASK_EXPECTATIONS: `BidOrBoo Tasker will bring All purpose cleaning products and equipments required to clean your house.
Based on your reqest the Tasker may vaccume or mop the floors, dust the furniture, clean the washrooms, kitchen, bathrooms, living room and other areas.
However the tasker will not clean things that require special treatment or the intside of the closets/kitchen cabinets.`,
};
