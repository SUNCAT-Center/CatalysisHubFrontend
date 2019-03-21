/**
 *
 * SingleStructureView
 *
 */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import Grid from 'material-ui/Grid';
import {
  FaExternalLink,
} from 'react-icons/lib/fa';
import {
  prettyPrintReference,
} from 'utils/functions';

import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import GraphQlbutton from 'components/GraphQlbutton';

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
  PublicationPubId: '',
  DftCode: '',
  DftFunctional: '',
};

class SingleStructureView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.printquery = `query{systems( uniqueId: "${this.props.selectedSystem.aseId}" ) {
  edges {
    node {
      Formula
      energy
      numbers
      initialMagmoms
      magmoms
      magmom
      charges
      momenta
      calculator
      keyValuePairs
      calculatorParameters
      publication {
        title
        authors
        doi
      }
    }
  }
}}`;
  }
  render() {
    const energy = this.props.selectedSystem.energy || this.state.energy || 0.0;
    let x;
    let y;
    let z;
    if (Object.prototype.hasOwnProperty.call(this.props.selectedSystem, 'full_key') && this.props.selectedSystem.full_key.startsWith('Gas')) {
      [x, y, z] = [1, 1, 1];
    } else if (Object.prototype.hasOwnProperty.call(this.props.selectedSystem, 'full_key') && this.props.selectedSystem.full_key.startsWith('Bulk')) {
      [x, y, z] = [2, 2, 2];
    } else {
      [x, y, z] = [2, 2, 1];
    }

    return (
      <div>
        {this.props.selectedUUID === '' ? null :
        <div>
          <h2 style={{ textAlign: 'center' }}>{this.props.selectedSystem.full_key}</h2>
          <Grid container direction="row" justify="space-around">
            <Grid item>
              <GeometryCanvasWithOptions
                uniqueId={this.props.selectedUUID}
                id={this.props.selectedUUID}
                x={x} y={y} z={z}
                cifdata={this.props.selectedSystem.Cifdata}
              />
            </Grid>
          </Grid>
          <ul style={{ width: '50%' }}>
            <li>Formula: {this.props.selectedSystem.Formula}</li>
            <li>DFT Total Energy: {energy.toFixed(2)} eV</li>
            {this.props.selectedSystem.energyCorrection !== 0 &&
              <li> Energy correction: {this.props.selectedSystem.energyCorrection}</li>
            }
            <li>DFT Code: {this.props.selectedSystem.DFTCode}</li>
            <li>DFT Functional: {this.props.selectedSystem.DFTFunctional}</li>
            <li>Publication: {prettyPrintReference(this.props.selectedPublication)}</li>
            <div>
              {_.isEmpty(this.props.selectedPublication.doi) ? null :
              <div>
                <li>
                          Source&nbsp;
                          <ReactGA.OutboundLink
                            eventLabel={`http://dx.doi.org/${this.props.selectedPublication.doi}`}
                            to={`http://dx.doi.org/${this.props.selectedPublication.doi}`}
                            target="_blank"
                          >
                            DOI: {this.props.selectedPublication.doi} <FaExternalLink />
                          </ReactGA.OutboundLink>
                </li>
              </div>
              }
            </div>
            <li> <a href={`/publications/${this.props.selectedPublication.pubId}`}>
                View all reactions in dataset
                </a>
            </li>
            <li>
               Open <GraphQlbutton query={this.state.printquery} newSchema /> to view calculational details.
            </li>
          </ul>
        </div>
        }
      </div>
    );
  }
}

SingleStructureView.propTypes = {
  selectedPublication: PropTypes.string.isRequired,
  selectedUUID: PropTypes.string.isRequired,
  selectedSystem: PropTypes.object.isRequired,
};

export default SingleStructureView;
