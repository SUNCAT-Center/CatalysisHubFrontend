import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

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
    let barrierValue;
    if (activationEnergy == null) {
      barrierHeight = reactionEnergy / plotHeight;
      barrierValue = reactionEnergy / 2.0 / plotHeight;
    } else {
      plotHeight = activationEnergy - Math.min(reactionEnergy, 0);
      barrierHeight = activationEnergy / plotHeight;
      barrierValue = barrierHeight;
    }
    const reactValue = reactionEnergy / plotHeight;
    const offset = 70 + (250 * Math.max(barrierHeight, 0));
    const data = [
      { x: 0, y: offset },
      { x: 120, y: offset },
      { x: 200, y: offset - (250 * barrierValue) },
      { x: 280, y: offset - (250 * reactValue) },
      { x: 400, y: offset - (250 * reactValue) },
    ];

    const labelBarrier = offset - ((250 * barrierValue) + 30);
    const labelReact = offset - ((250 * reactValue) - 40);

    if (activationEnergy == null) {
      return (
        <g className="xy-axis">
          <Axis {...xSettings} />
          <path stroke="black" fill="none" strokeWidth={8} className="line shadow" d={line(data)} />
          <line x1={0} x2={500} y1={200} y2={400} />
          <text x={120} y={360} fontFamily="sans-serif" fontSize="14px" fill="red">
            Reaction Energy {reactionEnergy.toFixed(2)} eV
          </text>
        </g>
      );
    }
    return (
      <g className="xy-axis">
        <Axis {...xSettings} />
        <path stroke="black" fill="none" strokeWidth={8} className="line shadow" d={line(data)} />
        <line x1={0} x2={500} y1={200} y2={400} />
        <text x={260} y={labelReact} fontFamily="sans-serif" fontSize="14px" fill="red">
          Reaction Energy {reactionEnergy.toFixed(2)} eV </text>
        <text x={120} y={labelBarrier} fontFamily="sans-serif" fontSize="14px" fill="red">
          Activation Energy {activationEnergy.toFixed(2)} eV
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
