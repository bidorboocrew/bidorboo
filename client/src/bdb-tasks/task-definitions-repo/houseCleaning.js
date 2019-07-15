import React from 'react';

export default {
  ID: 'bdbHouseCleaning',
  TITLE: 'House Cleaning',
  ICON: 'fas fa-home',
  DESCRIPTION: `Does your place need a cleaning ? Let our Taskers clean your space.`,
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
              <div className="group">
                <div className="select">
                  <select
                    value={values.effort}
                    onChange={(event) => setFieldValue('effort', event.target.value, true)}
                  >
                    <option value="small">{`Small (1-3 hours)`}</option>
                    <option value="medium">{`Medium (3-6 hours)`}</option>
                    <option value="large">{`Large (6-8 hours)`}</option>
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
  TASK_EXPECTATIONS: `BidOrBoo Tasker will bring All purpose cleaning products and equipments required to clean your house thouroughally.`,
};
