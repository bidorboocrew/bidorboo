//will host all UI global changes

import * as A from '../actionTypes';

const initialState = {
  isSideNavOpen: false,
  isLoginRegistrationDialogOpen: false,
  loginClickSrc: ''
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case A.UI_ACTIONS.CLOSE_SIDENAV: {
      return { ...state, isSideNavOpen: false };
    }
    case A.UI_ACTIONS.OPEN_SIDENAV: {
      return { ...state, isSideNavOpen: true };
    }
    case A.UI_ACTIONS.OPEN_LOGIN_REGISTRATION_FORM: {
      return {
        ...state,
        isLoginRegistrationDialogOpen: true,
        loginClickSrc: payload.loginClickSrc
      };
    }
    case A.UI_ACTIONS.CLOSE_LOGIN_REGISTRATION_FORM: {
      return {
        ...state,
        isLoginRegistrationDialogOpen: false,
        loginClickSrc: ''
      };
    }

    default:
      return state;
  }
}
