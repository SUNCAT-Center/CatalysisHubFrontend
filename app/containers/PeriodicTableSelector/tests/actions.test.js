
import * as actions from '../actions';
import * as constants from '../constants';

describe('PeriodicTableSelector actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: constants.DEFAULT_ACTION,
      };
      expect(actions.defaultAction()).toEqual(expected);
    });
  });

  describe('Element clicked', () => {
    it('has a type of ELEMENT_CLICKED', () => {
      expect(actions.clickElement('Rh')).toEqual({ payload: 'Rh', type: constants.ELEMENT_CLICKED });
    });
  });
  describe('Clear Selection', () => {
    it('has a type of CLEAR_SELECTION', () => {
      expect(actions.clearSelection()).toEqual({ type: constants.CLEAR_SELECTION });
    });
  });
});
