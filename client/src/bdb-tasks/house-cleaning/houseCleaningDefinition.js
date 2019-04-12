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
  requesterExpectations:
    `The Tasker will be bringing the common cleaning products to give your house a thourough cleaning.
However you are expected to provide larger equipment such as vaccum cleaner or specialty cleaning product for extra care items.`,
  taskerExpectations:
    'You must bring general cleaning equipment (All purpose cleaner, window cleane). However, large cleaning items like vaccum cleaner or any specialty products required will be provided by the requester',
};
