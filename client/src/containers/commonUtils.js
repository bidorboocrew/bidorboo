export const getUserExistingBid = (request, currentUserId) => {
  if (!request._bidsListRef || !request._bidsListRef.length > 0) {
    return false;
  }

  let userExistingBid = null;
  let userAlreadyBid = request._bidsListRef.some((bid) => {
    userExistingBid = bid;
    return bid._taskerRef === currentUserId;
  });
  return { userAlreadyBid, userExistingBid };
};

export const didUserAlreadyView = (request, currentUserId) => {
  if (!request.viewedBy || !request.viewedBy.length > 0) {
    return false;
  }

  let didUserAlreadyView = request.viewedBy.some((usrId) => {
    return usrId === currentUserId;
  });
  return didUserAlreadyView;
};
