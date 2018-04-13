import { createSelector } from 'reselect';

/**
 * Direct selector to the upload state domain
 */
const selectUploadDomain = () => (state) => state.get('upload');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Upload
 */

const makeSelectUpload = () => createSelector(
  selectUploadDomain(),
  (substate) => substate.toJS()
);

export default makeSelectUpload;
export {
  selectUploadDomain,
};
