/*
 *
 * ActivityMapsPage reducer
 *
 */

import _ from 'lodash';
import * as constants from './constants';

const initialState = {
  selectedSystem: '',
  systems: [],
  structures: [],
  structureQuery: '',
};

function activityMapsPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SAVE_STRUCTURE_QUERY:
      return {
        ...state,
        structureQuery: action.payload.structureQuery,
      };
    case constants.SAVE_STRUCTURE:
      return {
        ...state,
        structures:
        _.sortBy(
          _.uniqBy(
            _.concat(state.structures,
              action.payload.structure), (x) => typeof x === 'undefined' ? '' : x.Formula).filter((x) => !_.isEmpty(x))
          , (x) => x.energy),

      };

    case constants.CLEAR_STRUCTURES:
      return {
        ...state,
        structures: initialState.structures,
      };

    case constants.SAVE_STRUCTURES:
      return {
        ...state,
        structures: action.payload.structures,
      };

    case constants.SAVE_SYSTEMS:
      return {
        ...state,
        systems: action.payload.systems,
      };

    case constants.CLICK_DOT:
      return {
        ...state,
        selectedDot: action.payload.point.system,
        structures: action.payload.structures,
      };
    case constants.DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default activityMapsPageReducer;
