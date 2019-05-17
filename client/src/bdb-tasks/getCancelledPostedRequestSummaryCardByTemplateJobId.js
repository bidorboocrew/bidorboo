import React from 'react';

import { HOUSE_CLEANING_DEF } from './index';
import HouseCleaningCanceledPostedRequestSummary from './house-cleaning/HouseCleaningCanceledPostedRequestSummary';
// map id to definition object
const getCancelledPostedRequestSummaryCardByTemplateJobId = (job, otherProps) => {
  if (!job || !job.fromTemplateId) {
    console.log('no job passed in');
    return;
  }

  const { fromTemplateId } = job;

  switch (fromTemplateId) {
    case `${HOUSE_CLEANING_DEF.ID}`:
      return <HouseCleaningCanceledPostedRequestSummary job={job} {...otherProps} />;
    default:
      alert('unkown fromTemplateId ' + fromTemplateId);
  }
};

export default getCancelledPostedRequestSummaryCardByTemplateJobId;
