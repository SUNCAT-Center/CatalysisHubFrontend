/**
 *
 * ActivityMapOer
 *
 */

import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import plotlydata from './plot_data/OER.json';
// import styled from 'styled-components';

class ActivityMapOer extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div ref={(el) => { this.instance = el; }}>
        <h2 style={{ marginTop: '100px' }}>Activity Map</h2>
        <p>Data generously provided by M. Bajdich, unpublished, 2017.</p>
        <Plot {...plotlydata} onClick={(event) => { this.props.clickDot(event); }} />
      </div>
    );
  }
}


ActivityMapOer.propTypes = {
  clickDot: PropTypes.func,
};

export default ActivityMapOer;
