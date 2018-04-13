
import { fromJS } from 'immutable';
import prototypeExplorerReducer from '../reducer';

describe('prototypeExplorerReducer', () => {
  it('returns the initial state', () => {
    expect(prototypeExplorerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
