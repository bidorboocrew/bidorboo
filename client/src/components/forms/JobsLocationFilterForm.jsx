/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';
import JobsLocationFilterAddress from './JobsLocationFilterAddress';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

export default class JobsLocationFilterForm extends React.Component {
  submitSearchLocationParams = (searchParams) => {
    this.props.onSubmit();
  };

  render() {
    const { lastKnownSearch } = this.props;
    return (
      <div style={{ border: '1px solid lightgrey ', padding: '1rem', background: '#eeeeee' }}>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Edit Search Criteria</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <JobsLocationFilterAddress
                  submitSearchLocationParams={this.submitSearchLocationParams}
                  lastKnownSearch={lastKnownSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      // <div className="is-inline">
      //   <div className="is-inline button is-text">Edit Active Filters</div>
      //   <div className="is-inline">
      //     <JobsLocationFilterAddress
      //       submitSearchLocationParams={this.submitSearchLocationParams}
      //       lastKnownSearch={lastKnownSearch}
      //     />
      //   </div>
      /* <div className="level-item has-text-centered">
          <div>
            <p className="heading">Following</p>
            <p className="title">123</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Followers</p>
            <p className="title">456K</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Likes</p>
            <p className="title">789</p>
          </div>
        </div> */
      // </div>
    );
  }
}
