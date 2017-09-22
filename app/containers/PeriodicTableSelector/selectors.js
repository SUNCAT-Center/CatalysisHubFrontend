import { createSelector } from 'reselect';

/**
 * Direct selector to the periodicTableSelector state domain
 */
const selectPeriodicTableSelectorDomain = () => (state) => state.get('periodicTableSelector');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PeriodicTableSelector
 */

const makeSelectPeriodicTableSelector = () => createSelector(
  selectPeriodicTableSelectorDomain(),
  (substate) => substate.toJS()
);

export default makeSelectPeriodicTableSelector;
export {
  selectPeriodicTableSelectorDomain,
};
