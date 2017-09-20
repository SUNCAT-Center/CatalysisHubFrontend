import { createSelector } from 'reselect';

/**
 * Direct selector to the pourbaixDiagramsPage state domain
 */
const selectPourbaixDiagramsPageDomain = () => (state) => state.get('pourbaixDiagramsPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PourbaixDiagramsPage
 */

const makeSelectPourbaixDiagramsPage = () => createSelector(
  selectPourbaixDiagramsPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectPourbaixDiagramsPage;
export {
  selectPourbaixDiagramsPageDomain,
};
