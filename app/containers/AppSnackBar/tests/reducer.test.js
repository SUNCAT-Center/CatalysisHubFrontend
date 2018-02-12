
import { fromJS } from 'immutable';
import appSnackBarReducer from '../reducer';

describe('appSnackBarReducer', () => {
  it('returns the initial state', () => {
    expect(appSnackBarReducer(undefined, {})).toEqual(fromJS({}));
  });
});
