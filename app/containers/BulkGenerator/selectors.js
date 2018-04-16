import { createSelector } from 'reselect';

/**
 * Direct selector to the bulkGenerator state domain
 */
const selectBulkGeneratorDomain = () => (state) => state.get('bulkGenerator');

/**
 * Other specific selectors
 */


/**
 * Default selector used by BulkGenerator
 */

const makeSelectBulkGenerator = () => createSelector(
  selectBulkGeneratorDomain(),
  (substate) => substate.toJS()
);

export default makeSelectBulkGenerator;
export {
  selectBulkGeneratorDomain,
};
