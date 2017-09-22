/*
 *
 * PeriodicTableSelector
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectPeriodicTableSelector from './selectors';
import messages from './messages';
import PeriodicTable from 'components/PeriodicTable'

export class PeriodicTableSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
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
    clickElement : (element) => {
      dispatch(actions.clickElement(element))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodicTableSelector);
