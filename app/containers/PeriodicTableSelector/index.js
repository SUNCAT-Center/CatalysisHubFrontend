/*
 *
 * PeriodicTableSelector
 *
 */

/* import React, { PropTypes } from 'react'; */
import React from 'react';
import { connect } from 'react-redux';
/* import { createStructuredSelector } from 'reselect'; */
import PeriodicTable from './PeriodicTable';

import { clickElement, clearSelection } from './actions';

export class PeriodicTableSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <PeriodicTable {...this.props} />
      </div>
    );
  }
}


export const mapStateToProps = (state) => ({
  selection: state.get('periodicTableSelector').selection,
});

export const mapDispatchToProps = (dispatch) => ({
  clickElement: (element) => {
    dispatch(clickElement(element));
  },
  clearSelection: (selection) => {
    dispatch(clearSelection(selection));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodicTableSelector);
