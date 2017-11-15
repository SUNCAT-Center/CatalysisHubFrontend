import { createSelector } from 'reselect';

/**
 * Direct selector to the plotlyDemo state domain
 */
const selectPlotlyDemoDomain = () => (state) => state.get('plotlyDemo');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PlotlyDemo
 */

const makeSelectPlotlyDemo = () => createSelector(
  selectPlotlyDemoDomain(),
  (substate) => substate.toJS()
);

export default makeSelectPlotlyDemo;
export {
  selectPlotlyDemoDomain,
};
