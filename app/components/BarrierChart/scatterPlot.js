import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import XYAxis from './xyAxis';

/* const xMax = (data) => d3.max(data, (d) => d[0]); */
/* const yMax = (data) => d3.max(data, (d) => d[1]); */

const xScale = d3.scale
    .ordinal()
    .domain(['Reactants', 'TS', 'Products'])
    .rangePoints([50, 350]);

const yScale = (props) => (
  d3.scale.linear()
    .domain([0, 10])
    .range([props.height - props.padding, props.padding])
);


class ScatterPlot extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const scales = { xScale: xScale(this.props),
      yScale: yScale(this.props),
    };
    return (
      <svg width={this.props.width} height={this.props.height}>
        <XYAxis {...this.props} {...scales} />
      </svg>
    );
  }
}

ScatterPlot.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

ScatterPlot.defaultProps = {
};

export default ScatterPlot;
