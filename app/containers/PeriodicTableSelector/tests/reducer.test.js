
import periodicTableSelectorReducer from '../reducer';

describe('periodicTableSelectorReducer', () => {
  it('returns the initial state', () => {
    expect(periodicTableSelectorReducer(undefined, {})).toEqual({ selection: '' });
  });
});
