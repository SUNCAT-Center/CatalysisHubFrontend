/*
 *
 * ActivityMapsPage actions
 *
 */

import _ from 'lodash';

import * as constants from './constants';

export function saveReaction(reaction) {
  return {
    type: constants.SAVE_REACTION,
    payload: {
      reaction,
    },
  };
}

export function saveStructureQuery(structureQuery) {
  return {
    type: constants.SAVE_STRUCTURE_QUERY,
    payload: {
      structureQuery,
    },
  };
}

export function saveStructure(structure) {
  return {
    type: constants.SAVE_STRUCTURE,
    payload: {
      structure,
    },
  };
}

export function clearStructures() {
  return {
    type: constants.CLEAR_STRUCTURES,
  };
}


export function saveStructures(structures) {
  return {
    type: constants.SAVE_STRUCTURES,
    payload: {
      structures,
    },
  };
}

export function saveSystems(systems) {
  return {
    type: constants.SAVE_SYSTEMS,
    payload: {
      systems,
    },
  };
}

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}

export function clickDot(event) {
  if (_.isEmpty(event.points)) {
    return {
      type: constants.DEFAULT_ACTION,
    };
  }
  const pointEvent = event.points[0];
  const point = {
    x: pointEvent.x,
    y: pointEvent.y,
    text: pointEvent.text,
    uid: pointEvent.data.customdata.uid,
  };

  return {
    type: constants.CLICK_DOT,
    payload: {
      point,
    },
  };
}
