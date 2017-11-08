
import generalSearchContainerReducer from '../reducer';

describe('generalSearchContainerReducer', () => {
  it('returns the initial state', () => {
    expect(generalSearchContainerReducer(undefined, {})).toEqual(({
      selectedUUID: '',
      searchResults: [],
      selectedSystem: {},
    }));
  });
});
