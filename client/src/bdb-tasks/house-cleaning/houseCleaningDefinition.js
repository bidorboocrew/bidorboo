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
      small: '1 - 3',
      medium: '3 - 6',
      large: '6 - 8',
    },
  },
  requesterExpectations: `BidOrBoo Tasker will bring All purpose cleaning products to thouroughaly clean your house.
If you have any items that require specialty cleaning products please make sure to provide the. If you require vaccuming please make sure you have a vaccum cleaner available.`,
  taskerExpectations:
    'You must bring general cleaning equipment (All purpose cleaner, window cleane). However, large cleaning items like vaccum cleaner or any specialty products required will be provided by the requester',
};
