exports.UserModelSchemaFields = {
  _postedJobsRef: 1,
  _postedBidsRef: 1,
  _asBidderReviewsRef: 1,
  _asProposerReviewsRef: 1,
  rating: 1,
  userId: 1,
  email: 1,
  displayName: 1,
  phoneNumber: 1,
  profileImage: 1,
  addressText: 1,
  personalParagraph: 1,
  membershipStatus: 1,
  userRole: 1,
  agreedToServiceTerms: 1,
  settings: 1,
  extras: 1,
  verificationIdImage: 1,
  canBid: 1,
  canPost: 1,
  extras: 1,
  createdAt:1,
  updatedAt:1,
};

exports.BidModelSchemaFields = {
  _bidderRef: 1,
  _jobRef: 1,
  isNewBid: 1,
  state: 1,
  bidAmount: 1,
  extras: 1,
  createdAt:1,
  updatedAt:1,
};

exports.ReviewModelSchemaFields = {
  jobId: 1,
  bidderId: 1,
  proposerId: 1,
  proposerReview: 1,
  bidderReview: 1,
  reveal: 1,
  extras: 1,
  createdAt:1,
  updatedAt:1,
};

exports.JobModelSchemaFields = {
  _ownerRef: 1,
  _bidsListRef: 1,
  _awardedBidRef: 1,
  _reviewRef: 1,
  title: 1,
  state: 1,
  hideForUserIds: 1,
  detailedDescription: 1,
  stats: 1,
  addressText: 1,
  startingDateAndTime: 1,
  durationOfJob: 1,
  fromTemplateId: 1,
  reportThisJob: 1,
  extras: 1,
  createdAt:1,
  updatedAt:1,
};

exports.populateUserRef = (pathName, populateChildDocsSchema, options) => ({
  path: pathName,
  select: exports.UserModelSchemaFields,
  ...populateChildDocsSchema,
  ...options,
});

exports.populateJobRef = (pathName, populateChildDocsSchema, options) => ({
  path: pathName,
  select: exports.JobModelSchemaFields,
  ...populateChildDocsSchema,
  ...options,
});

exports.populateBidRef = (pathName, populateChildDocsSchema, options) => ({
  path: pathName,
  select: exports.JobModelSchemaFields,
  ...populateChildDocsSchema,
  ...options,
});

exports.populateReviewRef = (pathName, populateChildDocsSchema, options) => ({
  path: pathName,
  select: exports.ReviewModelSchemaFields,
  ...populateChildDocsSchema,
  ...options,
});
