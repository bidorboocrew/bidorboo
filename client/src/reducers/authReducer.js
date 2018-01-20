import * as A from "../actions/actionTypes";

const initialState = {
  isLoggedIn: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
