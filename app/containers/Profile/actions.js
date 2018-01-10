import * as constants from './constants';

export function receiveReactions(reactions) {
  return {
    type: constants.RECEIVE_REACTIONS,
    payload: reactions,
  };
}

export function saveSystem(system) {
  return {
    type: constants.SAVE_SYSTEM,
    payload: system,
  };
}

export function clearSystems() {
  return {
    type: constants.CLEAR_SYSTEMS,
  };
}

export function selectReaction(element) {
  return {
    type: constants.SELECT_REACTION,
    payload: element,
  };
}


export function clickAuthor(author) {
  return {
    type: constants.CLICK_AUTHOR,
    payload: author,
  };
}
