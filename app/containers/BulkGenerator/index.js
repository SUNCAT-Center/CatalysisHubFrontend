/*
 *
 * BulkGenerator
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { createStructuredSelector } from 'reselect';
import makeSelectBulkGenerator from './selectors';

const styles = () => ({
});

export class BulkGenerator extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>Bulk Generator</h2>
        <div>Generate arbitrary structures starting from a space group.</div>
      </div>
    );
  }
}

BulkGenerator.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  BulkGenerator: makeSelectBulkGenerator(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(BulkGenerator));
