
import { fromJS } from 'immutable';
import energiesPageReducer from '../reducer';

describe('energiesPageReducer', () => {
  it('returns the initial state', () => {
    expect(energiesPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
