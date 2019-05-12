import React from 'react';

import JobSummaryForAwarded from './JobSummaryForAwarded';

class MyAwardedJobsTab extends React.Component {
  render() {
    const { jobsList } = this.props;
    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? <AwardedRequests {...this.props} /> : null;
  }
}

export default MyAwardedJobsTab;

const AwardedRequests = (props) => {
  const { jobsList } = props;
  const myAwardedJobs = jobsList.map((job) => {
    return (
      <div key={job._id} className="column">
        <JobSummaryForAwarded showBidCount={false} job={job} />
      </div>
    );
  });
  return myAwardedJobs;
};
