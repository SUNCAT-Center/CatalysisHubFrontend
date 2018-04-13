/*
 *
 * AppSnackBar actions
 *
 */

import * as constants from './constants';

export function open(message) {
  return {
    type: constants.OPEN_SNACKBAR,
    payload: {
      message,
    },
  };
}

export function close() {
  return {
    type: constants.CLOSE_SNACKBAR,
  };
}

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}
