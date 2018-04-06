
import bulkGeneratorReducer from '../reducer';

describe('bulkGeneratorReducer', () => {
  it('returns the initial state', () => {
    expect(bulkGeneratorReducer(undefined, {})).toEqual({
      activeStep: 0,
      bulkStructure: '',
      cellParameters: {},
      permutations: [],
      spacegroup: 1,
      synonyms: [],
      wyckoffList: [],
      wyckoffPoints: [],
    });
  });
});
