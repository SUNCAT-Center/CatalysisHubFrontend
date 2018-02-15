/*
 *
 * BulkGenerator actions
 *
 */

import * as constants from './constants';

export function setSynonyms(synonyms) {
  return {
    type: constants.SET_SYNONYMS,
    payload: {
      synonyms,
    },
  };
}

export function setPermutations(permutations) {
  return {
    type: constants.SET_PERMUTATIONS,
    payload: {
      permutations,
    },
  };
}
export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}

export function setSpacegroup(spacegroup) {
  return {
    type: constants.SET_SPACEGROUP,
    payload: {
      spacegroup,
    },
  };
}

export function receiveWyckoffList(wyckoffList) {
  return {
    type: constants.RECEIVE_WYCKOFF_LIST,
    payload: {
      wyckoffList,
    },
  };
}

export function setWyckoffPoints(wyckoffPoints) {
  return {
    type: constants.SET_WYCKOFF_POINTS,
    payload: {
      wyckoffPoints,
    },
  };
}

export function setCellParameters(cellParameters) {
  return {
    type: constants.SET_CELL_PARAMETERS,
    payload: {
      cellParameters,
    },
  };
}

export function receiveBulkStructure(bulkStructure) {
  return {
    type: constants.RECEIVE_BULK_STRUCTURE,
    payload: {
      bulkStructure,
    },
  };
}

export function stepperHandleReset() {
  return {
    type: constants.STEPPER_HANDLE_RESET,
  };
}

export function stepperHandleBack() {
  return {
    type: constants.STEPPER_HANDLE_BACK,
  };
}

export function stepperHandleNext() {
  return {
    type: constants.STEPPER_HANDLE_NEXT,
  };
}

export function updateFilter(field, value) {
  return {
    type: constants.UPDATE_FILTER,
    payload: {
      field,
      value,
    },
  };
}

