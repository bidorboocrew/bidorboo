import React from 'react';

import { HouseCleaningConcept } from './index';

export const GenerateAllTasksConceptCards = (props) => {

  const { showLoginDialog, isLoggedIn } = props;
  const bidorbooTaskConcepts = [
    <HouseCleaningConcept showLoginDialog={showLoginDialog} isLoggedIn={isLoggedIn} />,
  ];
  return bidorbooTaskConcepts;
};
