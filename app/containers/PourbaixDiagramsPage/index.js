/*
 *
 * PourbaixDiagramsPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectPourbaixDiagramsPage from './selectors';
import messages from './messages';
import PeriodicTable from 'components/PeriodicTable';
import PeriodicTableSelector from 'containers/PeriodicTableSelector'
import PourbaixDiagramView from 'components/PourbaixDiagramView';
import Flexbox from 'flexbox-react';

export class PourbaixDiagramsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
        <Flexbox flexDirection="column" minHeight="100vh">
        <h2>Periodic Table of Elements</h2>
        <PeriodicTable />
        <PourbaixDiagramView />
        </Flexbox>
    );
  }
}

PourbaixDiagramsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  PourbaixDiagramsPage: makeSelectPourbaixDiagramsPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PourbaixDiagramsPage);
