//will host all UI global changes

import * as A from '../actionTypes';

const initialState = {
  isSideNavOpen: true
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.UI_ACTIONS.CLOSE_SIDENAV: {
      return { ...state, isSideNavOpen: false };
    }
    case A.UI_ACTIONS.OPEN_SIDENAV: {
      return { ...state, isSideNavOpen: true };
    }
    default:
      return state;
  }
}
