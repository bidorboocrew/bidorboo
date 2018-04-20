//will host all UI global changes
import * as A from '../actionTypes';

const initialState = {
  // isSideNavOpen: false,
  shouldShowLoginDialog: false
  // applicationMode: C.APP_MODE.BIDDER
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    // case A.UI_ACTIONS.OPEN_SIDENAV: {
    //   return { ...state, isSideNavOpen: true };
    // }
    case A.UI_ACTIONS.OPEN_LOGIN_DIALOG:
      return {
        ...state,
        shouldShowLoginDialog: true
        // loginClickSrc: payload.loginClickSrc
      };

    case A.UI_ACTIONS.CLOSE_LOGIN_DIALOG:
      return {
        ...state,
        shouldShowLoginDialog: false
      };

    default:
      return state;
  }
}
