import { handleActions } from 'redux-actions';

import * as A from '../actionTypes';

const initialState = {
  userDetails: {
    userId: '',
    displayName: 'Join Us for Free',
    email: '',
    profileImage: {
      url: ''
    }
  }
};
const updateUserProfile = (state = initialState, { payload }) => ({
  ...state,
  userDetails: payload
});

export default handleActions(
  {
    [`${A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE}`]: updateUserProfile
  },
  initialState
);
