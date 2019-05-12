import React from 'react';

import getPostedSummaryCardByTemplateJobId from '../../../bdb-tasks/getPostedSummaryCardByTemplateJobId';
class MyRequestsTab extends React.Component {
  render() {
    const { jobsList } = this.props;

    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? <MyRequests {...this.props} /> : null;
  }
}

export default MyRequestsTab;

const MyRequests = (props) => {
  const { jobsList } = props;

  const jobCards = jobsList.map((job) => {
    return (
      <div key={job._id} className="column">
        {getPostedSummaryCardByTemplateJobId(job, props)}
      </div>
    );
  });
  return jobCards;
};
