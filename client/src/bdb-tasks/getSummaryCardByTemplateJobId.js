import React from 'react';

import { HouseCleaningRequestSummary, HOUSE_CLEANING_DEF } from './index';
// map id to definition object
const getSummaryCardByTemplateJobId = (templateId, job, otherProps) => {
  switch (templateId) {
    case `${HOUSE_CLEANING_DEF.ID}`:
      return <HouseCleaningRequestSummary job={job} {...otherProps} />;
    default:
      alert('unkown templateId ' + templateId);
  }
};

export default getSummaryCardByTemplateJobId;
