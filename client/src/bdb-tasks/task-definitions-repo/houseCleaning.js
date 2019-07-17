import React from 'react';
import taskImage from '../../assets/images/houesCleaning.png';
// import watermarker from '../../assets/images/android-chrome-192x192.png';

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
  renderSummaryCard: function({ withDetails = true }) {
    return (
      <div style={{ padding: '1rem' }}>
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <div className="watermark">
                <img
                  src={taskImage}
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
                  House Cleaning
                </h1>
                {withDetails && (
                  <p style={{ color: '#6a748a', paddingBottom: '1.25rem' }}>
                    Does your place need a cleaning ? Let our Taskers clean your space.
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
                <label className="withPlaceholder hasSelectedValue">{'Approximate Duration'}</label>
                <div>
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
            <div key={'extras-effort'} className="group saidTest">
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
