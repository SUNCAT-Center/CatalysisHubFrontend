
import { fromJS } from 'immutable';
import catKitDemoReducer from '../reducer';

describe('catKitDemoReducer', () => {
  it('returns the initial state', () => {
    expect(catKitDemoReducer(undefined, {})).toEqual(fromJS({}));
  });
});
