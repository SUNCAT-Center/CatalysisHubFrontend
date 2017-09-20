
import { fromJS } from 'immutable';
import pourbaixDiagramsPageReducer from '../reducer';

describe('pourbaixDiagramsPageReducer', () => {
  it('returns the initial state', () => {
    expect(pourbaixDiagramsPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
