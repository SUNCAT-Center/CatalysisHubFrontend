
import catKitDemoReducer from '../reducer';

describe('catKitDemoReducer', () => {
  it('returns the initial state', () => {
    expect(catKitDemoReducer(undefined, {})).toEqual({
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
      fixed: 2,
      images: [],
      latticeConstant: 3.92,
      openCalculation: -1,
      siteOccupations: {},
      slabInput: '',
      slabParams: {},
      unitCellSize: 2,
      wyckoffBulkParams: {},
    });
  });
});
