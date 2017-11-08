
import scalingRelationsPageReducer from '../reducer';
import * as actions from '../constants';

describe('scalingRelationsPageReducer', () => {
  it('returns the initial state', () => {
    expect(scalingRelationsPageReducer(undefined, {})).toEqual({});
  });
  it('default action return initial state', () => {
    expect(scalingRelationsPageReducer(undefined, { type: actions.DEFAULT_ACTION })).toEqual({});
  });
});
