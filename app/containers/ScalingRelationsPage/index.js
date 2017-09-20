/*
 *
 * ScalingRelationsPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectScalingRelationsPage from './selectors';
import messages from './messages';
import Iframe from 'react-iframe'

export class ScalingRelationsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Iframe url="https://web.stanford.edu/~ctsai89/cgi-bin/apps/catapp/plot" />
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
