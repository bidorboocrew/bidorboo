import * as A from '../actionTypes';

const initialState = {
  isSideBarOpen: true
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.SIDENAV_ACTIONS.CLOSE_SIDENAV: {
      return { ...state, isSideBarOpen: false };
    }
    case A.SIDENAV_ACTIONS.OPEN_SIDENAV: {
      return { ...state, isSideBarOpen: true };
    }

    default:
      return state;
  }
}
