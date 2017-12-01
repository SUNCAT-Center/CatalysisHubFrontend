
import energiesPageReducer from '../reducer';
import * as actions from '../constants';

describe('energiesPageReducer', () => {
  it('returns the initial state', () => {
    expect(energiesPageReducer(undefined, {})).toEqual(({
      selectedReaction: {},
      matchingReactions: [],
      searchSubmitted: false,
      reactionSystems: [],
    }));
  });
  it('handles DEFAULT_ACTION ', () => {
    const defaultAction = { type: actions.DEFAULT_ACTION };
    expect(energiesPageReducer({}, defaultAction)).toEqual({});
  });
  it('handles RECEIVE_SYSTEMS', () => {
    const receiveSystems = { type: actions.RECEIVE_SYSTEMS };
    expect(energiesPageReducer({}, receiveSystems)).toEqual({});
  });
  it('handles RECEIVE_REACTIONS', () => {
    const receiveReactions = { type: actions.RECEIVE_REACTIONS };
    expect(energiesPageReducer({}, receiveReactions)).toEqual({});
  });
  it('handles CLEAR_SYSTEMS', () => {
    const clearSystems = { type: actions.CLEAR_SYSTEMS };
    expect(energiesPageReducer({}, clearSystems)).toEqual({ reactionSystems: [] });
  });
  it('handles SELECT_REACTION', () => {
    const selectReaction = { type: actions.SELECT_REACTION };
    expect(energiesPageReducer({}, selectReaction)).toEqual({});
  });
  it('handles SAVE_SYSTEM', () => {
    const saveSystem = { type: actions.SAVE_SYSTEM, payload: 'System' };
    const rs = [{ mass: 1, volume: 1 }, { mass: 2, volume: 1 }, {}];
    expect(energiesPageReducer({ reactionSystems: rs }, saveSystem)).toEqual({ reactionSystems: [{}, 'System', { mass: 2, volume: 1 }, { mass: 1, volume: 1 }] });
  });
  it('handles SUBMIT_SEARCH', () => {
    const submitSearch = { type: actions.SUBMIT_SEARCH };
    expect(energiesPageReducer({}, submitSearch)).toEqual({ searchSubmitted: true });
  });
});

