import * as A from '../actionTypes';

const initialState = {
  isLoggedIn: false,
  userDetails: {
    userId: '',
    displayName: 'Join Us for Free',
    email: '',
    profileImage: {
      url:
        'https://cdn4.iconfinder.com/data/icons/forum-buttons-and-community-signs-1/794/profile-3-512.png'
    }
  }
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.AUTH_ACTIONS.USER_IS_LOGGED_IN: {
      return { ...state, isLoggedIn: true, userDetails: payload };
    }
    case A.AUTH_ACTIONS.USER_IS_LOGGED_OUT: {
      return { ...state, ...initialState };
    }
    default:
      return state;
  }
}
