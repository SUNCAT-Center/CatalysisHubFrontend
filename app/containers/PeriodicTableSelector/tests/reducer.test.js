
import periodicTableSelectorReducer from '../reducer';
import * as constants from '../constants';

const reducer = periodicTableSelectorReducer;

describe('periodicTableSelectorReducer', () => {
  it('returns the initial state', () => {
    expect(periodicTableSelectorReducer(undefined, {})).toEqual({ selection: '' });
  });
  it('handles DEFAULT_ACTION', () => {
    expect(reducer({ selection: '' }, { type: constants.DEFAULT_ACTION })).toEqual({ selection: '' });
  });
  it('handles ELEMENT_CLICKED', () => {
    expect(reducer({ selection: '' }, { type: constants.ELEMENT_CLICKED })).toEqual({});
  });
  it('handles CLEAR_SELECTION', () => {
    expect(reducer({}, { type: constants.CLEAR_SELECTION })).toEqual({ selection: '' });
  });
});
