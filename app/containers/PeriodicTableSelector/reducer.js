/*
 *
 * PeriodicTableSelector reducer
 *
 */

import {
  DEFAULT_ACTION,
  ELEMENT_CLICKED,
} from './constants';

const initialState = {
  selection: '',
};

function periodicTableSelectorReducer(state = initialState, action) {
  var new_selection;
  switch (action.type) {
    case ELEMENT_CLICKED:
      if(state.selection.trim() === ''){
        new_selection = action.payload;
      } else {
        if(action.payload.trim() === ''){
          new_selection = state.selection
        } else{
          new_selection = [state.selection, action.payload].join(' & ')
        }
      }

      return {
        ...state,
        selection: new_selection, 
      };
      break;
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default periodicTableSelectorReducer;
