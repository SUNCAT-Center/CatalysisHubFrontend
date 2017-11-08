
import energiesPageReducer from '../reducer';

describe('energiesPageReducer', () => {
  it('returns the initial state', () => {
    expect(energiesPageReducer(undefined, {})).toEqual(({
      selectedReaction: {},
      matchingReactions: [],
      reactionSystems: [],
    }));
  });
});
