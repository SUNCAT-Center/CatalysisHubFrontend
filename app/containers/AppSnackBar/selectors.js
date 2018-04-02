import { createSelector } from 'reselect';

/**
 * Direct selector to the appSnackBar state domain
 */
const selectAppSnackBarDomain = () => (state) => state.get('appSnackBar');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AppSnackBar
 */

const makeSelectAppSnackBar = () => createSelector(
  selectAppSnackBarDomain(),
  (substate) => substate.toJS()
);

export default makeSelectAppSnackBar;
export {
  selectAppSnackBarDomain,
};
