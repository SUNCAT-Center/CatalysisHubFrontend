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
        <Plot
          {...plotlydata}
          layout={{
            hovermode: 'closest',
            height: Math.max(Math.min(window.innerHeight * 0.8, Number.POSITIVE_INFINITY), 300),
            width: Math.max(Math.min(window.innerWidth * 0.8, Number.POSITIVE_INFINITY), 300),
            margin: { l: 20, r: 20, b: 10, t: 10 },
          }}
          onClick={(event) => { this.props.clickDot(event); }}
        />
      </div>
    );
  }
}


ActivityMapOer.propTypes = {
  clickDot: PropTypes.func,
};

export default ActivityMapOer;
