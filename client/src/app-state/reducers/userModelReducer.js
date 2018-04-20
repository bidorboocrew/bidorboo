import * as A from '../actionTypes';

const initialState = {
  userDetails: {
    userId: '',
    displayName: 'Join Us for Free',
    email: '',
    profileImgUrl:
      'https://cdn4.iconfinder.com/data/icons/forum-buttons-and-community-signs-1/794/profile-3-512.png'
  }
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.USER_MODEL_ACTIONS.UPDATE_USER_PROFILE: {
      debugger
      return { ...state, userDetails: payload };
    }
    default:
      return state;
  }
}
