import carDetailing from './task-definitions-repo/carDetailing';
import houseCleaning from './task-definitions-repo/houseCleaning';
import petCare from './task-definitions-repo/petCare';

const TASKS_DEFINITIONS = {
  [`${carDetailing.ID}`]: { ...carDetailing },
  [`${houseCleaning.ID}`]: { ...houseCleaning },
  [`${petCare.ID}`]: { ...petCare },
};

export default TASKS_DEFINITIONS;
