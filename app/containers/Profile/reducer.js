/*
 *
 *
 * Profile reducer
 *
 *
 */

import * as constants from './constants';

const initialState = {
  selectedReaction: {},
  reactions: [],
  reactionSystems: [],
};

function profileReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SELECT_REACTION:
      return {
        ...state,
        selectedReaction: action.payload,

      };
    case constants.DEFAULT_ACTION:
      return state;
    case constants.RECEIVE_REACTIONS:
      return {
        ...state,
        reactions: action.payload,
      };
    case constants.SAVE_SYSTEM: {
      let reactionSystems = state.reactionSystems;
      reactionSystems = reactionSystems.concat(action.payload);

      const negativeDensity = (system) => {
        if (typeof system.mass !== 'undefined' && typeof system.volume !== 'undefined') {
          return system.mass / system.volume;
        }
        return 0.0;
      };

      reactionSystems.sort(negativeDensity);
      return {
        ...state,
        reactionSystems,
      };
    }

    case constants.CLEAR_SYSTEMS:
      return {
        ...state,
        reactionSystems: [],
      };
    default:
      return state;
  }
}


export default profileReducer;
