
import { fromJS } from 'immutable';
import scalingRelationsPageReducer from '../reducer';

describe('scalingRelationsPageReducer', () => {
  it('returns the initial state', () => {
    expect(scalingRelationsPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
