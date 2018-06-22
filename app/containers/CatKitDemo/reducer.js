/*
 *
 * CatKitDemo reducer
 *
 */

import _ from 'lodash';
import * as constants from './constants';

const initialState = {
  activeStep: 0,
  adsorbateParams: {},
  adsorptionSites: [],
  altLabels: [],
  bulkCif: '',
  bulkInput: '',
  bulkParams: {},
  calculations: [],
  customBulkInput: false,
  customSlabInput: false,
  images: [],
  latticeConstant: 3.92,
  siteOccupations: {},
  slabInput: '',
  slabParams: {},
  unitCellSize: 2,
  fixed: 2,
  wyckoffBulkParams: {},
  openCalculation: -1,
};

function catKitDemoReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SET_OPEN_CALCULATION: {
      return {
        ...state,
        openCalculation: action.payload.n,
      };
    }
    case constants.SAVE_FIXED: {
      return {
        ...state,
        fixed: action.payload.fixed,
      };
    }
    case constants.SAVE_UNIT_CELL_SIZE: {
      return {
        ...state,
        unitCellSize: action.payload.unitCellSize,
      };
    }
    case constants.EDIT_CALCULATION: {
      const bulkParams = _.get(state, `calculations.[${action.payload.n}].bulkParams`, state.bulkParams);
      const slabParams = _.get(state, `calculations.[${action.payload.n}].slabParams`, state.slabParams);
      const adsorbateParams = _.get(state, `calculations.[${action.payload.n}].adsorbateParams`, state.adsorbateParams);
      return {
        ...state,
        openCalculation: action.payload.n,
        bulkParams,
        slabParams,
        adsorbateParams,
      };
    }
    case constants.SAVE_ADSORBATE_PARAMS: {
      return {
        ...state,
        adsorbateParams: action.payload.adsorbateParams,
      };
    }
    case constants.SAVE_WYCKOFF_BULK_PARAMS: {
      return {
        ...state,
        wyckoffBulkParams: action.payload.wyckoffBulkParams,
      };
    }
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
        customBulkInput: initialState.customBulkInput,
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
    case constants.COPY_CALCULATION: {
      const calculations = _.cloneDeep(state.calculations);
      calculations.splice(
        action.payload.n,
        0,
        _.cloneDeep(state.calculations[action.payload.n]));
      return {
        ...state,
        calculations,
      };
    }
    case constants.REMOVE_CALCULATION:
      return {
        ...state,
        calculations: state.calculations.filter((x, i) => i !== action.payload.n),
      };
    case constants.SAVE_CALCULATION: {
      let calculations;
      if (state.openCalculation >= 0 && state.openCalculation < state.calculations.length) {
        calculations = _.concat(
          state.calculations.slice(0, state.openCalculation),
          [action.payload.calculation],
          state.calculations.slice(state.openCalculation + 1));
      } else {
        calculations = _.concat(
          state.calculations,
          [action.payload.calculation],
        );
      }

      return {
        ...state,
        calculations,
        openCalculation: -1,
      };
    }
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
