import { createSelector } from 'reselect';

/**
 * Direct selector to the activityMapsPage state domain
 */
const selectActivityMapsPageDomain = () => (state) => state.get('activityMapsPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ActivityMapsPage
 */

const makeSelectActivityMapsPage = () => createSelector(
  selectActivityMapsPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectActivityMapsPage;
export {
  selectActivityMapsPageDomain,
};
