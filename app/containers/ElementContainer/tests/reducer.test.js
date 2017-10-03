
import { fromJS } from 'immutable';
import elementContainerReducer from '../reducer';

describe('elementContainerReducer', () => {
  it('returns the initial state', () => {
    expect(elementContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
