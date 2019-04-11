import React from 'react';

import { HouseCleaningRequestSummary, HOUSE_CLEANING_DEF } from './index';
// map id to definition object
const getSummaryCardByTemplateJobId = (job, otherProps) => {
  if (!job || !job.fromTemplateId) {
    console.log('no job passed in');
    return;
  }

  const { fromTemplateId } = job;

  switch (fromTemplateId) {
    case `${HOUSE_CLEANING_DEF.ID}`:
      return <HouseCleaningRequestSummary job={job} {...otherProps} />;
    default:
      alert('unkown fromTemplateId ' + fromTemplateId);
  }
};

export default getSummaryCardByTemplateJobId;
