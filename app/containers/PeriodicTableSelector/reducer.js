/*
 *
 * PeriodicTableSelector reducer
 *
 */

import {
  DEFAULT_ACTION,
  ELEMENT_CLICKED,
  CLEAR_SELECTION,
} from './constants';

const initialState = {
  selection: '',
};

function periodicTableSelectorReducer(state = initialState, action) {
  let newSelection;
  switch (action.type) {

    case CLEAR_SELECTION:

      return {
        ...state,
        selection: '',
      };
    case ELEMENT_CLICKED:
      if (state.selection.trim() === '') {
        newSelection = action.payload;
      } else if (typeof action.payload === 'undefined' || action.payload.trim() === '') {
        newSelection = state.selection;
      } else if (state.selection.split(' & ').indexOf(action.payload) < 0) {
        newSelection = [state.selection, action.payload].join(' & ');
      } else {
        newSelection = state.selection;
      }

      return {
        ...state,
        selection: newSelection,
      };
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default periodicTableSelectorReducer;
