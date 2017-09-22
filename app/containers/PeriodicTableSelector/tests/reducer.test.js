
import { fromJS } from 'immutable';
import periodicTableSelectorReducer from '../reducer';

describe('periodicTableSelectorReducer', () => {
  it('returns the initial state', () => {
    expect(periodicTableSelectorReducer(undefined, {})).toEqual(fromJS({}));
  });
});
