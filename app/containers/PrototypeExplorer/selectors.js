import { createSelector } from 'reselect';

/**
 * Direct selector to the prototypeExplorer state domain
 */
const selectPrototypeExplorerDomain = () => (state) => state.get('prototypeExplorer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PrototypeExplorer
 */

const makeSelectPrototypeExplorer = () => createSelector(
  selectPrototypeExplorerDomain(),
  (substate) => substate.toJS()
);

export default makeSelectPrototypeExplorer;
export {
  selectPrototypeExplorerDomain,
};
