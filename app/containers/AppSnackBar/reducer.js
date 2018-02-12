/*
 *
 * AppSnackBar reducer
 *
 */

import * as constants from './constants';

const initialState = {
  message: '',
  isOpen: false,
};

function appSnackBarReducer(state = initialState, action) {
  switch (action.type) {
    case constants.CLOSE_SNACKBAR:
      return {
        ...state,
        isOpen: false,
      };
    case constants.OPEN_SNACKBAR:
      return {
        ...state,
        message: action.payload.message,
        isOpen: true,
      };
    case constants.DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default appSnackBarReducer;
