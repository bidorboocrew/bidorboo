import React from 'react';

import { HouseCleaningPostedRequestDetails, HOUSE_CLEANING_DEF } from './index';
// map id to definition object
const getFullDetailsCardByTemplateJobId = (job) => {
  if (!job || !job.fromTemplateId) {
    console.log('no job passed in');
    return;
  }

  const { fromTemplateId } = job;

  switch (fromTemplateId) {
    case `${HOUSE_CLEANING_DEF.ID}`:
      return <HouseCleaningPostedRequestDetails job={job} />;
    default:
      alert('unkown fromTemplateId ' + fromTemplateId);
  }
};

export default getFullDetailsCardByTemplateJobId;
