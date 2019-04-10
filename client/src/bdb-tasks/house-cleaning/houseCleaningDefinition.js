export const HOUSE_CLEANING_DEF = {
  ID: 'bdbjob-house-cleaning',
  TITLE: 'House Cleaning',
  DESCRIPTION: `Does your place need a cleaning ? Tired and want to get someone to clean the bathrooms
  living room kitchen bedrooms and more ?`,
  SUGGESTION_TEXT: `*Any additional special instructions worth noting?

*Any heavy items obstructing the floors ?`,
  IMG_URL: 'https://dingo.care2.com/pictures/greenliving/1409/1408468.large.jpg',
  customAttributes: {
    CLEANING_SUPPLIES: {
      notProvided: 'Tasker must bring the cleaning supplies.',
      provided: 'Cleaning supplies will be provided on site.',
    },
    TIME_REQUIREMENT: {
      lessThanFourHours: '1 - 4',
      fourToEight: '4 - 8',
      moreThanEight: '8 - 12',
    },
  },
};
