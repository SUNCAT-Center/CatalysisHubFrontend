/**
 *
 * SingleStructureView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import ReactGA from 'react-ga';


import GeometryCanvasCifdata from 'components/GeometryCanvasCifdata';

const initialState = {
  Formula: '',
  energy: 0,
  PublicationYear: 0,
  PublicationDoi: '',
  PublicationAuthors: '',
  PublicationTitle: '',
  PublicationVolume: '',
  PublicationUrl: '',
  PublicationNumber: '',
  PublicationJournal: '',
  PublicationPages: '',
  DftCode: '',
  DftFunctional: '',
};

class SingleStructureView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  render() {
    const energy = this.props.selectedSystem.energy || this.state.energy || 0.0;

    let x;
    let y;
    let z;
    if (Object.prototype.hasOwnProperty.call(this.props.selectedSystem, 'full_key') && this.props.selectedSystem.full_key.startsWith('Molec')) {
      [x, y, z] = [1, 1, 1];
    } else {
      [x, y, z] = [2, 2, 1];
    }

    return (
      <div>
        {this.props.selectedUUID === '' ? null :
        <div>
          <h2>{this.props.selectedSystem.full_key}</h2>
          <GeometryCanvasCifdata
            uniqueId={this.props.selectedUUID}
            id={this.props.selectedUUID}
            x={x} y={y} z={z}
            cifdata={this.props.selectedSystem.Cifdata}
          />
          <ul>
            <li>Formula: {this.props.selectedSystem.Formula}</li>
            <li>Total Energy: {energy.toFixed(2)} eV</li>
            <li>DFT Code: {this.props.selectedSystem.DFTCode}</li>
            <li>DFT Functional: {this.props.selectedSystem.DFTFunctional}</li>
            <li>{`Title: "${this.props.selectedSystem.PublicationTitle}"`}</li>
            <li>Authors: {typeof this.props.selectedSystem.PublicationAuthors === 'undefined' || this.props.selectedSystem.PublicationAuthors === '' ? null :
                JSON.parse(this.props.selectedSystem.PublicationAuthors).join('; ').replace('\\o', 'ø')}</li>
            <li>Year: {this.props.selectedSystem.PublicationYear}</li>
            {this.props.selectedSystem.PublicationDoi === '' ? null :
            <div>
              <li>
                Source&nbsp;
                <ReactGA.OutboundLink
                  eventLabel={`http://dx.doi.org/${this.props.selectedSystem.PublicationDoi}`}
                  to={`http://dx.doi.org/${this.props.selectedSystem.PublicationDoi}`}
                  target="_blank"
                >
                DOI: {this.props.selectedSystem.PublicationDoi}
                </ReactGA.OutboundLink>
              </li>
            </div>
            }
          </ul>
        </div>
        }
      </div>
    );
  }
}

SingleStructureView.propTypes = {
  selectedUUID: PropTypes.string.isRequired,
  selectedSystem: PropTypes.object.isRequired,
};

export default SingleStructureView;
