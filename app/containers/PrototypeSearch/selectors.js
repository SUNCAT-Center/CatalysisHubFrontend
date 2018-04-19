import { createSelector } from 'reselect';

/**
 * Direct selector to the prototypeSearch state domain
 */
const selectPrototypeSearchDomain = () => (state) => state.get('prototypeSearch');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PrototypeSearch
 */

const makeSelectPrototypeSearch = () => createSelector(
  selectPrototypeSearchDomain(),
  (substate) => substate.toJS()
);

export default makeSelectPrototypeSearch;
export {
  selectPrototypeSearchDomain,
};
