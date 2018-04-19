
import prototypeSearchReducer from '../reducer';

describe('prototypeSearchReducer', () => {
  it('returns the initial state', () => {
    expect(prototypeSearchReducer(undefined, {})).toEqual(({
      facetFilters: [],
      ptype: '',
      repoPrototypes: {},
      searchLimit: 50,
      searchResults: {},
      searchTerms: '',
    }));
  });
});
