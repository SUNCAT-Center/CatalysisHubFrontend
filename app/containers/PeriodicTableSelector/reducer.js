/*
 *
 * PeriodicTableSelector reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  ELEMENT_CLICKED,
} from './constants';

const initialState = fromJS({
  selection: '',
});

function periodicTableSelectorReducer(state = initialState, action) {
  switch (action.type) {
    case ELEMENT_CLICKED:
      return {
        ...state,
        selection: (selection.trim() == '') ? action.payload.element.label : [selection, action.payload.element.label].join(' & ')
      }
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default periodicTableSelectorReducer;
