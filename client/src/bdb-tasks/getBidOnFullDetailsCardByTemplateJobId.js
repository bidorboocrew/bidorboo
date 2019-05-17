import React from 'react';

import { BidOnHouseCleaningJobFullDetails, HOUSE_CLEANING_DEF } from './index';
// map id to definition object
const getBidOnFullDetailsCardByTemplateJobId = (job) => {
  if (!job || !job.fromTemplateId) {
    console.log('no job passed in');
    return;
  }

  const { fromTemplateId } = job;

  switch (fromTemplateId) {
    case `${HOUSE_CLEANING_DEF.ID}`:
      return <BidOnHouseCleaningJobFullDetails job={job} />;
    default:
      alert('unkown fromTemplateId ' + fromTemplateId);
  }
};

export default getBidOnFullDetailsCardByTemplateJobId;
