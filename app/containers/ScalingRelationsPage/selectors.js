import { createSelector } from 'reselect';

/**
 * Direct selector to the scalingRelationsPage state domain
 */
const selectScalingRelationsPageDomain = () => (state) => state.get('scalingRelationsPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ScalingRelationsPage
 */

const makeSelectScalingRelationsPage = () => createSelector(
  selectScalingRelationsPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectScalingRelationsPage;
export {
  selectScalingRelationsPageDomain,
};
