import { createSelector } from 'reselect';

/**
 * Direct selector to the generalSearchContainer state domain
 */
const selectGeneralSearchContainerDomain = () => (state) => state.get('generalSearchContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by GeneralSearchContainer
 */

const makeSelectGeneralSearchContainer = () => createSelector(
  selectGeneralSearchContainerDomain(),
  (substate) => substate.toJS()
);

export default makeSelectGeneralSearchContainer;
export {
  selectGeneralSearchContainerDomain,
};
