
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
  it('handles ELEMENT_CLICKED with nothing preselected and something clicked', () => {
    expect(reducer({ selection: '' }, { payload: 'Rh', type: constants.ELEMENT_CLICKED })).toEqual({ selection: 'Rh' });
  });
  it('handles ELEMENT_CLICKED with nothing preselected and nothing clicked', () => {
    expect(reducer({ selection: '' }, { type: constants.ELEMENT_CLICKED })).toEqual({});
  });
  it('handles ELEMENT_CLICKED with something preselected and nothing clicked', () => {
    expect(reducer({ selection: 'Rh' }, { type: constants.ELEMENT_CLICKED })).toEqual({ selection: 'Rh' });
  });
  it('handles ELEMENT_CLICKED with something preselected and something clicked', () => {
    expect(reducer({ selection: 'Rh' }, { type: constants.ELEMENT_CLICKED, payload: 'Pt' })).toEqual({ selection: 'Rh & Pt' });
  });
  it('handles CLEAR_SELECTION', () => {
    expect(reducer({}, { type: constants.CLEAR_SELECTION })).toEqual({ selection: '' });
  });
});
