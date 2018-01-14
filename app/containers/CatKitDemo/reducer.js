/*
 *
 * CatKitDemo reducer
 *
 */

import _ from 'lodash';
import * as constants from './constants';

const initialState = {
  bulkCif: '',
  images: [],
  latticeConstant: 3.92,
  bulkParams: {},
  slabParams: {},
  calculations: [],
};

function catKitDemoReducer(state = initialState, action) {
  switch (action.type) {
    case constants.CLEAR_CALCULATIONS:
      return {
        ...state,
        calculations: [],
      };
    case constants.REMOVE_CALCULATION:
      return {
        ...state,
        calculations: state.calculations.filter((x, i) => i !== action.payload.n),
      };
    case constants.SAVE_CALCULATION:
      return {
        ...state,
        calculations: _.union(state.calculations, [action.payload.calculation]),
      };
    case constants.CLEAR_SLAB_PARAMS:
      return {
        ...state,
        slabParams: {},
      };
    case constants.CLEAR_BULK_PARAMS:
      return {
        ...state,
        bulkParams: {},
      };
    case constants.SAVE_SLAB_PARAMS:
      return {
        ...state,
        slabParams: action.payload,
      };
    case constants.SAVE_BULK_PARAMS:
      return {
        ...state,
        bulkParams: action.payload,
      };
    case constants.RECEIVE_SLAB_CIFS:
      return {
        ...state,
        images: action.payload,
      };
    case constants.CLEAR_SLAB_CIFS:
      return {
        ...state,
        images: [],
      };

    case constants.RECEIVE_BULK_CIF:
      return {
        ...state,
        bulkCif: action.payload,
      };
    case constants.CLEAR_BULK_CIF:
      return {
        ...state,
        bulkCif: initialState.bulkCif,
      };
    case constants.SAVE_LATTICE_CONSTANT:
      return {
        ...state,
        latticeConstant: action.latticeConstant,
      };
    case constants.DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default catKitDemoReducer;
