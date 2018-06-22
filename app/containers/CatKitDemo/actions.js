/*
 *
 * CatKitDemo actions
 *
 */

import _ from 'lodash';
import * as constants from './constants';

export function saveFixed(unitFixed) {
  return {
    type: constants.SAVE_FIXED,
    payload: {
      unitFixed,
    },
  };
}

export function saveUnitCellSize(unitCellSize) {
  return {
    type: constants.SAVE_UNIT_CELL_SIZE,
    payload: {
      unitCellSize,
    },
  };
}

export function saveAdsorbateParams(adsorbateParams) {
  return {
    type: constants.SAVE_ADSORBATE_PARAMS,
    payload: {
      adsorbateParams,
    },
  };
}

export function saveWyckoffBulkParms(wyckoffBulkParams) {
  return {
    type: constants.SAVE_WYCKOFF_BULK_PARAMS,
    payload: {
      wyckoffBulkParams,
    },
  };
}

export function forgetCustomBulk() {
  return {
    type: constants.FORGET_CUSTOM_BULK,
  };
}

export function forgetCustomSlab() {
  return {
    type: constants.FORGET_CUSTOM_SLAB,
  };
}

export function dropSlabInput(file) {
  return {
    type: constants.DROP_SLAB_INPUT,
    payload: {
      file,
    },
  };
}

export function dropBulkInput(file) {
  return {
    type: constants.DROP_BULK_INPUT,
    payload: {
      file,
    },
  };
}

export function saveAltLabels(altLabels) {
  return {
    type: constants.SAVE_ALT_LABELS,
    payload: {
      altLabels,
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

export function clearSiteOccupations() {
  return {
    type: constants.CLEAR_SITE_OCCUPATIONS,
  };
}

export function appendSiteOccupation(siteOccupation) {
  return {
    type: constants.APPEND_SITE_OCCUPATIONS,
    payload: {
      siteOccupation,
    },
  };
}

export function saveSiteOccupations(siteOccupations) {
  return {
    type: constants.SAVE_SITE_OCCUPATIONS,
    payload: {
      siteOccupations,
    },
  };
}

export function clearAdsorptionSites() {
  return {
    type: constants.CLEAR_ADSORPTION_SITES,
  };
}

export function saveAdsorptionSites(adsorptionSites) {
  return {
    type: constants.SAVE_ADSORPTION_SITES,
    payload: {
      adsorptionSites,
    },
  };
}

export function setOpenCalculation(n) {
  return {
    type: constants.SET_OPEN_CALCULATION,
    payload: {
      n,
    },
  };
}

export function editCalculation(n) {
  return {
    type: constants.EDIT_CALCULATION,
    payload: {
      n,
    },
  };
}

export function copyCalculation(n) {
  return {
    type: constants.COPY_CALCULATION,
    payload: {
      n,
    },
  };
}
export function removeCalculation(n) {
  return {
    type: constants.REMOVE_CALCULATION,
    payload: {
      n,
    },
  };
}

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
    payload: {
      bulkParams,
    },
  };
}

export function saveSlabParams(slabParams) {
  return {
    type: constants.SAVE_SLAB_PARAMS,
    payload: {
      ..._.mapValues(slabParams, parseInt),
      cif: slabParams.cif,
      format: slabParams.format,
      input: slabParams.input,
    },
  };
}
