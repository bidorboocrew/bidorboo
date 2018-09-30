import React from 'react';
import PropTypes from 'prop-types';
import { Proptypes_jobModel } from '../../client-server-interfaces';
import JobDetailsView from '../JobDetailsView';

export default class PostedJobConfirmationCard extends React.Component {
  static propTypes = {
    // this is the job object structure from the server
    jobDetails: Proptypes_jobModel,
  };

  render() {
    const { jobDetails } = this.props;
    return (
      <JobDetailsView job={jobDetails}></JobDetailsView>
    );
  }
}
