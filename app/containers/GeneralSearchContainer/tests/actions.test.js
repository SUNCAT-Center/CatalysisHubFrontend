
import * as actions from '../actions';
import * as constants from '../constants';

describe('GeneralSearchContainer actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: constants.DEFAULT_ACTION,
      };
      expect(actions.defaultAction()).toEqual(expected);
    });
  });
  describe('selectUuid', () => {
    it('has a type of SELECT_UUID', () => {
      expect(actions.selectUUID()).toEqual({ type: constants.SELECT_UUID });
    });
  });

  describe('receiveResults', () => {
    it('has a type of RECEIVE_RESULTS', () => {
      expect(actions.receiveResults()).toEqual({ type: constants.RECEIVE_RESULTS });
    });
  });

  describe('saveSystem', () => {
    it('has a type of SAVE_SYSTEM', () => {
      expect(actions.saveSystem()).toEqual({ type: constants.SAVE_SYSTEM });
    });
  });
});
