import carDetailing from './task-definitions-repo/carDetailing';
import houseCleaning from './task-definitions-repo/houseCleaning';
import petCare from './task-definitions-repo/petCare';
import moving from './task-definitions-repo/moving';

const TASKS_DEFINITIONS = {
  [`${houseCleaning.ID}`]: { ...houseCleaning },
  [`${petCare.ID}`]: { ...petCare },
  [`${moving.ID}`]: { ...moving },
  [`${carDetailing.ID}`]: { ...carDetailing },
};

export default TASKS_DEFINITIONS;
