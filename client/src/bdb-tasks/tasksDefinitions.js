import carDetailing from './all-task-definitions-repo/carDetailing';
import houseCleaning from './all-task-definitions-repo/houseCleaning';

const TASKS_DEFINITIONS = {
  [`${carDetailing.ID}`]: { ...carDetailing },
  [`${houseCleaning.ID}`]: { ...houseCleaning },
};

export default TASKS_DEFINITIONS;
