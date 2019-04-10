import React from 'react';

import { HouseCleaningRequestDetails, HOUSE_CLEANING_DEF } from './index';
// map id to definition object
const getFullDetailsCardByTemplateJobId = (templateId, job) => {
  switch (templateId) {
    case `${HOUSE_CLEANING_DEF.ID}`:
      return <HouseCleaningRequestDetails job={job} />;
  }
};

export default getFullDetailsCardByTemplateJobId;
