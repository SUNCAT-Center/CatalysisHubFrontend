
import * as actions from '../actions';
import * as constants from '../constants';

describe('EnergiesPage actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: constants.DEFAULT_ACTION,
      };
      expect(actions.defaultAction()).toEqual(expected);
    });
  });
  describe('Receive Systems', () => {
    it('has a type of RECEIVE_SYSTEMS', () => {
      const expected = {
        type: constants.RECEIVE_SYSTEMS,
      };
      expect(actions.receiveSystems()).toEqual(expected);
    });
  });

  describe(' submitSearch ', () => {
    it('has type SUBMIT_SEARCH', () => {
      expect(actions.submitSearch()).toEqual({ type: constants.SUBMIT_SEARCH });
    });
  });

  describe('selectReaction', () => {
    it('has type SELECT_REACTION', () => {
      expect(actions.selectReaction()).toEqual({ type: constants.SELECT_REACTION });
    });
  });

  describe('receiveReactions', () => {
    it('has type RECEIVE_REACTIONS', () => {
      expect(actions.receiveReactions()).toEqual({ type: constants.RECEIVE_REACTIONS });
    });
  });

  describe('clearSystems', () => {
    it('has type CLEAR_SYSTEMS', () => {
      expect(actions.clearSystems()).toEqual({ type: constants.CLEAR_SYSTEMS });
    });
  });

  describe('saveSystem', () => {
    it('has type SAVE_SYSTEM', () => {
      expect(actions.saveSystem()).toEqual({ type: constants.SAVE_SYSTEM });
    });
  });
});
