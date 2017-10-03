/*
 *
 * PeriodicTableSelector
 *
 */

/* import React, { PropTypes } from 'react'; */
import React from 'react';
import { connect } from 'react-redux';
/* import { createStructuredSelector } from 'reselect'; */
import PeriodicTable from 'components/PeriodicTable';

/* import makeSelectPeriodicTableSelector from './selectors'; */
import { clickElement } from './actions';

export class PeriodicTableSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <PeriodicTable {...this.props} />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  selection: state.get('periodicTableSelector').selection,
});

const mapDispatchToProps = (dispatch) => ({
  clickElement: (element) => {
    dispatch(clickElement(element));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodicTableSelector);
