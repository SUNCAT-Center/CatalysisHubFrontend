
import { fromJS } from 'immutable';
import bulkGeneratorReducer from '../reducer';

describe('bulkGeneratorReducer', () => {
  it('returns the initial state', () => {
    expect(bulkGeneratorReducer(undefined, {})).toEqual(fromJS({}));
  });
});
