import carDetailing from './task-definitions-repo/carDetailing';
import houseCleaning from './task-definitions-repo/houseCleaning';

const TASKS_DEFINITIONS = {
  [`${carDetailing.ID}`]: { ...carDetailing },
  [`${houseCleaning.ID}`]: { ...houseCleaning },
};

export default TASKS_DEFINITIONS;
