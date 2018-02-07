import * as A from '../actionTypes';

export const a_toggleSideNav = (isopen) =>
   {
    type: !isopen
      ? A.UI_ACTIONS.OPEN_SIDENAV
      : A.UI_ACTIONS.CLOSE_SIDENAV,
    payload: {
      isSideBarOpen: !isopen
    }
  }


