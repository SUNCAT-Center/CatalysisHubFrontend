import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import _ from 'lodash';

import Axis from './axis';

export default class XYAxis extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const xSettings = {
      translate: `translate(0, ${this.props.height - this.props.padding})`,
      scale: this.props.xScale,
      orient: 'bottom',
    };
    // const ySettings = {
    //   translate: `translate(${this.props.padding}, 0)`,
    //   scale: this.props.yScale,
    //   orient: 'left',
    // };
    const line = d3.svg.line()
      .x((d) => d.x)
      .y((d) => d.y)
      .interpolate('monotone');

    // const margin = {top: 5, right: 50, bottom: 20, left: 50};
    // const transform ='translate(' + margin.left + ',' + margin.top + ')';
    const reactionEnergy = this.props.selectedReaction.reactionEnergy;
    const activationEnergy = this.props.selectedReaction.activationEnergy;
    let plotHeight = Math.abs(reactionEnergy);
    let barrierHeight;
    if (activationEnergy == null) {
      barrierHeight = reactionEnergy / 2.0 / plotHeight;
    } else {
      plotHeight = activationEnergy + Math.abs(reactionEnergy);
      barrierHeight = activationEnergy / plotHeight;
    }
    const reactHeight = reactionEnergy / plotHeight;
    const offset = 180 + 100 * Math.max(reactHeight, barrierHeight);
    const data = [
      { x: 0, y: offset },
      { x: 120, y: offset },
      { x: 200, y: offset - (250 * barrierHeight) },
      { x: 280, y: offset - (250 * reactHeight) },
      { x: 400, y: offset - (250 * reactHeight) },
    ];
    if (activationEnergy == null) {
      return (
        <g className="xy-axis">
          <Axis {...xSettings} />
          <path stroke="black" fill="none" strokeWidth={8} className="line shadow" d={line(data)} />
          <line x1={0} x2={500} y1={200} y2={400} />
          <text x={120} y={340} fontFamily="sans-serif" fontSize="14px" fill="red">
            {' '}
Reaction Energy
            {reactionEnergy.toFixed(2)}
            {' '}
eV
            {' '}
          </text>
        </g>
      );
    }
    const labelHeight = offset - (250 * barrierHeight) - 30;
    const labelReact = offset - (250 * reactHeight) + 40;
    return (
      <g className="xy-axis">
        <Axis {...xSettings} />
        <path stroke="black" fill="none" strokeWidth={8} className="line shadow" d={line(data)} />
        <line x1={0} x2={500} y1={200} y2={400} />
        <text x={260} y={labelReact} fontFamily="sans-serif" fontSize="14px" fill="red">
	  Reaction Energy
          {' '}
          {reactionEnergy.toFixed(2)}
          {' '}
eV
          {' '}
        </text>
        <text x={120} y={labelHeight} fontFamily="sans-serif" fontSize="14px" fill="red">
	  Activation Energy
          {' '}
          {activationEnergy.toFixed(2)}
          {' '}
eV
        </text>
      </g>
    );
  }
}

XYAxis.propTypes = {
  height: PropTypes.number,
  padding: PropTypes.number,
  selectedReaction: PropTypes.object,
  xScale: PropTypes.object,
};

XYAxis.defaultProps = {
};
