import * as A from '../actionTypes';

export const A_toggleSideBar = (isopen) => {
  debugger;
  return {
    type: !isopen
      ? A.SIDENAV_ACTIONS.OPEN_SIDENAV
      : A.SIDENAV_ACTIONS.CLOSE_SIDENAV,
    payload: {
      isSideBarOpen: !isopen
    }
  };
};

export default {A_toggleSideBar};
