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
      .interpolate('linear');

    // const margin = {top: 5, right: 50, bottom: 20, left: 50};
    // const transform ='translate(' + margin.left + ',' + margin.top + ')';
    const reactionEnergy = this.props.selectedReaction.reactionEnergy;
    const activationEnergy = this.props.selectedReaction.activationEnergy;
      console.log(this.props.selectedReaction.activationEnergy)
      console.log(activationEnergy)
      console.log(_.isEmpty(activationEnergy))
      
    /*if (_.isEmpty(activationEnergy)) {
      activationEnergy = reactionEnergy / 2.0;
    }*/
    
    const data = [
      { x: 0, y: 200 },
      { x: 120, y: 200 },
      { x: 200, y: 200 - (100 * activationEnergy) },
      { x: 280, y: 200 - (100 * reactionEnergy) },
      { x: 400, y: 200 - (100 * reactionEnergy) },
    ];
      

    return (<g className="xy-axis">
      <Axis {...xSettings} />
      <path stroke="black" fill="none" strokeWidth={8} className="line shadow" d={line(data)} />
      <line x1={0} x2={500} y1={200} y2={400} />
      <text x={120} y={340} fontFamily="sans-serif" fontSize="14px" fill="red">Reaction Energy {reactionEnergy.toFixed(2)} eV</text>
      {activationEnergy === activationEnergy / 2.0 ? null :
          null
      }
    </g>);
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
