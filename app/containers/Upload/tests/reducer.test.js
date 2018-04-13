
import { fromJS } from 'immutable';
import uploadReducer from '../reducer';

describe('uploadReducer', () => {
  it('returns the initial state', () => {
    expect(uploadReducer(undefined, {})).toEqual(fromJS({}));
  });
});
