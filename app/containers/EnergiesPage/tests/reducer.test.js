
import energiesPageReducer from '../reducer';
import * as constants from '../constants';

describe('energiesPageReducer', () => {
  it('returns the initial state', () => {
    expect(energiesPageReducer(undefined, {})).toEqual(({
      dbError: false,
      filter: {},
      loading: false,
      matchingReactions: [],
      publication: {},
      order: 'desc',
      orderBy: '',
      reactionSystems: [],
      resultSize: 0,
      search: {},
      searchParams: {},
      searchQuery: '',
      searchString: '',
      searchSubmitted: false,
      selectedReaction: {},
      simpleSearch: false,
      withGeometry: true,
    }
    ));
  });
  it('handles DEFAULT_ACTION ', () => {
    const defaultAction = { type: constants.DEFAULT_ACTION };
    expect(energiesPageReducer({}, defaultAction)).toEqual({});
  });
  it('handles RECEIVE_SYSTEMS', () => {
    const receiveSystems = { type: constants.RECEIVE_SYSTEMS };
    expect(energiesPageReducer({}, receiveSystems)).toEqual({});
  });
  it('handles RECEIVE_REACTIONS', () => {
    const receiveReactions = { type: constants.RECEIVE_REACTIONS };
    expect(energiesPageReducer({}, receiveReactions)).toEqual({ matchingReactions: undefined, publication: [], reactionSystems: [], selectedReaction: [] });
  });
  it('handles CLEAR_SYSTEMS', () => {
    const clearSystems = { type: constants.CLEAR_SYSTEMS };
    expect(energiesPageReducer({}, clearSystems)).toEqual({ reactionSystems: [], searchSubmitted: false });
  });
  it('handles SELECT_REACTION', () => {
    const selectReaction = { type: constants.SELECT_REACTION };
    expect(energiesPageReducer({}, selectReaction)).toEqual({ publication: [], reactionSystems: [], selectedReaction: undefined });
  });
  it('handles SAVE_SYSTEM', () => {
    const saveSystem = { type: constants.SAVE_SYSTEM, payload: 'System' };
    const rs = [{ mass: 1, volume: 1 }, { mass: 2, volume: 1 }, {}];
    expect(energiesPageReducer({ reactionSystems: rs }, saveSystem)).toEqual({ reactionSystems: [{}, 'System', { mass: 2, volume: 1 }, { mass: 1, volume: 1 }] });
  });
  it('handles SUBMIT_SEARCH', () => {
    const submitSearch = { type: constants.SUBMIT_SEARCH };
    expect(energiesPageReducer({}, submitSearch)).toEqual({ searchParams: {}, searchSubmitted: true });
  });
});

