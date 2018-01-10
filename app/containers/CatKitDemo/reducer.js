/*
 *
 * CatKitDemo reducer
 *
 */

import * as constants from './constants';

const initialState = {
  bulkCif: '',
  images: [],
  latticeConstant: 3.92,
};

function catKitDemoReducer(state = initialState, action) {
  switch (action.type) {
    case constants.RECEIVE_SLAB_CIFS:
      return {
        ...state,
        images: action.payload,
      };
    case constants.RECEIVE_BULK_CIF:
      return {
        ...state,
        bulkCif: action.payload,
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
