
import generalSearchContainerReducer from '../reducer';
import * as constants from '../constants';

const reducer = generalSearchContainerReducer;

describe('generalSearchContainerReducer', () => {
  it('returns the initial state', () => {
    expect(generalSearchContainerReducer(undefined, {})).toEqual(({
      selectedUUID: '',
      searchResults: [],
      selectedSystem: {},
    }));
  });
  it('handles DEFAULT_ACTION', () => {
    expect(reducer({}, { type: constants.DEFAULT_ACTION })).toEqual({});
  });
  it('handles SELECT_UUID', () => {
    expect(reducer({}, { type: constants.SELECT_UUID })).toEqual({});
  });
  it('handles RECEIVE_RESULTS', () => {
    expect(reducer({}, { type: constants.RECEIVE_RESULTS })).toEqual({});
  });
  it('handles SAVE_SYSTEMS', () => {
    expect(reducer({}, { type: constants.SAVE_SYSTEMS })).toEqual({});
  });
});
