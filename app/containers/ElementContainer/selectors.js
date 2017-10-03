import { createSelector } from 'reselect';

/**
 * Direct selector to the elementContainer state domain
 */
const selectElementContainerDomain = () => (state) => state.get('elementContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ElementContainer
 */

const makeSelectElementContainer = () => createSelector(
  selectElementContainerDomain(),
  (substate) => substate.toJS()
);

export default makeSelectElementContainer;
export {
  selectElementContainerDomain,
};
