/*
 *
 * ScalingRelationsPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import makeSelectScalingRelationsPage from './selectors';

export class ScalingRelationsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>Scaling Relations</h2>
        <div>
        Currently under construction.
        </div>
      </div>
    );
  }
}

ScalingRelationsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ScalingRelationsPage: makeSelectScalingRelationsPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScalingRelationsPage);
