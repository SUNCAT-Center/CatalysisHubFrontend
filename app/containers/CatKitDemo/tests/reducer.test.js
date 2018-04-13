
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
      images: [],
      latticeConstant: 3.92,
      siteOccupations: {},
      slabInput: '',
      slabParams: {},
      wyckoffBulkParams: {},
    });
  });
});
