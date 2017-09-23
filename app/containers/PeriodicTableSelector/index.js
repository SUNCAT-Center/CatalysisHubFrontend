/*
 *
 * PeriodicTableSelector
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PeriodicTable from 'components/PeriodicTable';

import makeSelectPeriodicTableSelector from './selectors';
import { clickElement } from './actions';

export class PeriodicTableSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <PeriodicTable />
      </div>
    );
  }
}

PeriodicTableSelector.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  PeriodicTableSelector: makeSelectPeriodicTableSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    clickElement: (element) => {
      dispatch(clickElement(element));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodicTableSelector);
