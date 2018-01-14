/*
 *
 * CatKitDemo actions
 *
 */

import * as constants from './constants';

export function clearCalculations() {
  return {
    type: constants.CLEAR_CALCULATIONS,
  };
}

export function clearSlabParams() {
  return {
    type: constants.CLEAR_SLAB_PARAMS,
  };
}

export function clearBulkParams() {
  return {
    type: constants.CLEAR_BULK_PARAMS,
  };
}

export function saveCalculation(params) {
  return {
    type: constants.SAVE_CALCULATION,
    payload: {
      calculation: params,
    },
  };
}

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}

export function receiveBulkCif(cif) {
  return {
    type: constants.RECEIVE_BULK_CIF,
    payload: cif,
  };
}

export function clearBulkCif() {
  return {
    type: constants.CLEAR_BULK_CIF,
  };
}

export function receiveSlabCifs(cifs) {
  return {
    type: constants.RECEIVE_SLAB_CIFS,
    payload: cifs,
  };
}

export function clearSlabCifs() {
  return {
    type: constants.CLEAR_SLAB_CIFS,
  };
}

export function saveLatticeConstant(latticeConstant) {
  return {
    type: constants.SAVE_LATTICE_CONSTANT,
    payload: latticeConstant,
  };
}

export function saveBulkParams(bulkParams) {
  return {
    type: constants.SAVE_BULK_PARAMS,
    payload: bulkParams,
  };
}

export function saveSlabParams(slabParams) {
  return {
    type: constants.SAVE_SLAB_PARAMS,
    payload: slabParams,
  };
}
