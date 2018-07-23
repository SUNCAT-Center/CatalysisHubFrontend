/**
 *
 * BarrierChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Flexbox from 'flexbox-react';
import GeometryCanvasUuid from 'components/GeometryCanvasUuid';

import ScatterPlot from './scatterPlot';

import { styles } from './styles';


class BarrierChart extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      reactantUUIDs: [],
      productUUIDs: [],
    };
    this.clickThumbnail = this.clickThumbnail.bind(this);
  }
  componentDidMount() {
    const products = (JSON.parse(this.props.selectedReaction.products).filter((x) => !x.endsWith('gas')));
    const reactants = (JSON.parse(this.props.selectedReaction.reactants).filter((x) => !x.endsWith('gas')));
    const aseIds = (JSON.parse(this.props.selectedReaction.aseIds));
    const reactantUUIDs = [];
    const productUUIDs = [];
    products.map((x) => productUUIDs.push(aseIds[x]));
    reactants.map((x) => reactantUUIDs.push(aseIds[x]));

    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      reactantUUIDs, // eslint-disable-line react/no-did-mount-set-state
      productUUIDs, // eslint-disable-line react/no-did-mount-set-state
    }); // eslint-disable-line react/no-did-mount-set-state
  }

  clickThumbnail = () => {
  }


  render() {
    return (
      <div>
        <Flexbox flexDirection="row" justifyContent="space-around">
          <Flexbox
            flexDirection="column"
            style={{ marginRight: '0vw' }}
            justifyContent="space-around"
            onClick={() => this.clickThumbnail('reactants')}
          >
            {this.state.reactantUUIDs.map((uuid, i) =>
              <GeometryCanvasUuid
                onClick={(uuidArg) => this.clickThumbnail(uuidArg)}
                key={`reactant_${i}`}
                id={`reactant_${i}`}
                uuid={uuid}
                width={this.props.thumbnailSize}
                height={this.props.thumbnailSize}
                showDownload={false}
                showCompass={false}
                showLabels={false}
                x={1}
                y={1}
                borderWidth={0.0}
              />
            )}
          </Flexbox>
          <ScatterPlot {...this.state} {...styles} {...this.props} />
          <Flexbox
            flexDirection="column"
            style={{ marginLeft: '0vw' }}
            justifyContent="space-around"
            onClick={() => this.clickThumbnail('products')}
          >
            {this.state.productUUIDs.map((uuid, i) =>
              <GeometryCanvasUuid
                uuid={uuid}
                key={`product_${i}`}
                id={`product_${i}`}
                width={this.props.thumbnailSize}
                height={this.props.thumbnailSize}
                showDownload={false}
                showCompass={false}
                showLabels={false}
                x={1}
                y={1}
                borderWidth={0.0}
                onClick={() => this.clickThumbnail(uuid)}
              />
            )}
          </Flexbox>
        </Flexbox>
      </div>
    );
  }
}

BarrierChart.propTypes = {
  selectedReaction: PropTypes.object,
// The number of data points for the chart.
  thumbnailSize: PropTypes.number,
};

BarrierChart.defaultProps = {
  thumbnailSize: 200,
};

export default BarrierChart;
