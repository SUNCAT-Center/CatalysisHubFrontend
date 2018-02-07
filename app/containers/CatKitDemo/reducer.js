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
  adsorptionSites: [],
  siteOccupations: [],
  activeStep: 0,
  altLabels: [],
  bulkInput: '',
  customBulkInput: false,
  slabInput: '',
  customSlabInput: false,
};

function catKitDemoReducer(state = initialState, action) {
  switch (action.type) {

    case constants.DROP_SLAB_INPUT: {
      return {
        ...state,
        customSlabInput: true,
      };
    }
    case constants.DROP_BULK_INPUT: {
      return {
        ...state,
        customBulkInput: true,
      };
    }
    case constants.FORGET_CUSTOM_SLAB: {
      return {
        ...state,
        customSlabInput: initialState.customSlabInput,
      };
    }
    case constants.FORGET_CUSTOM_BULK: {
      return {
        ...state,
        customBulkInput: initialState.customBulkInput,
      };
    }
    case constants.SAVE_ALT_LABELS: {
      return {
        ...state,
        altLabels: action.payload.altLabels,
      };
    }
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
    case constants.APPEND_SITE_OCCUPATIONS: {
      return {
        ...state,
        siteOccupations: _.concat(state.siteOccupations, action.payload.siteOccupation),
      };
    }
    case constants.CLEAR_SITE_OCCUPATIONS: {
      return {
        ...state,
        siteOccupations: initialState.siteOccupations,
      };
    }
    case constants.SAVE_SITE_OCCUPATIONS: {
      return {
        ...state,
        siteOccupations: action.payload.siteOccupations,
      };
    }
    case constants.CLEAR_ADSORPTION_SITES:
      return {
        ...state,
        adsorptionSites: initialState.adsorptionSites,
      };
    case constants.SAVE_ADSORPTION_SITES:
      return {
        ...state,
        adsorptionSites: action.payload.adsorptionSites,
      };
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
        bulkParams: action.payload.bulkParams,
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
