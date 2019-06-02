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
  render() {
    const { lastKnownSearch } = this.props;
    return (
      <nav className="level">
        <div className="level-item has-text-centered">
          <div>
            <JobsLocationFilterAddress lastKnownSearch={lastKnownSearch} />
          </div>
        </div>
        <div className="level-item has-text-centered">
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
        </div>
      </nav>
    );
  }
}
