import { createSelector } from 'reselect';

/**
 * Direct selector to the energiesPage state domain
 */
const selectEnergiesPageDomain = () => (state) => state.get('energiesPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by EnergiesPage
 */

const makeSelectEnergiesPage = () => createSelector(
  selectEnergiesPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectEnergiesPage;
export {
  selectEnergiesPageDomain,
};
