/*
 *
 * BulkGenerator reducer
 *
 */

import * as constants from './constants';

const initialState = {
  spacegroup: 1,
  wyckoffList: [],
  wyckoffPoints: [],
  cellParameters: {},
  bulkStructure: '',
  activeStep: 0,
  permutations: [],
  name: '',
};

function bulkGeneratorReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SET_PERMUTATIONS:
      return {
        ...state,
        permutations: action.payload.permutations,
      };
    case constants.SET_NAME:
      return {
        ...state,
        name: action.payload.name,
      };
    case constants.RECEIVE_BULK_STRUCTURE:
      return {
        ...state,
        bulkStructure: action.payload.bulkStructure,
      };
    case constants.SET_CELL_PARAMETERS:
      return {
        ...state,
        cellParameters: action.payload.cellParameters,
      };
    case constants.SET_WYCKOFF_POINTS:
      return {
        ...state,
        wyckoffPoints: action.payload.wyckoffPoints,
      };
    case constants.RECEIVE_WYCKOFF_LIST:
      return {
        ...state,
        wyckoffList: action.payload.wyckoffList,
      };
    case constants.SET_SPACEGROUP:
      return {
        ...state,
        spacegroup: action.payload.spacegroup,
      };
    case constants.STEPPER_HANDLE_RESET: {
      return {
        ...state,
        activeStep: initialState.activeStep,
      };
    }
    case constants.STEPPER_HANDLE_NEXT: {
      return {
        ...state,
        activeStep: state.activeStep + 1,
      };
    }
    case constants.STEPPER_HANDLE_BACK: {
      return {
        ...state,
        activeStep: state.activeStep - 1,
      };
    }
    case constants.DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default bulkGeneratorReducer;
