import * as A from '../actionTypes';

export const action_toggleSideBar = (isopen) => {
  return {
    type: !isopen
      ? A.SIDENAV_ACTIONS.OPEN_SIDENAV
      : A.SIDENAV_ACTIONS.CLOSE_SIDENAV,
    payload: {
      isSideBarOpen: !isopen
    }
  };
};

export default {action_toggleSideBar};
