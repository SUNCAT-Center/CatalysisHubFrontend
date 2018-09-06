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
          <ul>
            <li>Formula: {this.props.selectedSystem.Formula}</li>
            <li>Total Energy: {energy.toFixed(2)} eV</li>
            <li>DFT Code: {this.props.selectedSystem.DFTCode}</li>
            <li>DFT Functional: {this.props.selectedSystem.DFTFunctional}</li>
            <li>{prettyPrintReference(this.props.selectedSystem.publication[0])}</li>
            {_.isEmpty(this.props.selectedSystem.publication[0].doi) ? null :
            <div>
              <li>
                          Source&nbsp;
                          <ReactGA.OutboundLink
                            eventLabel={`http://dx.doi.org/${this.props.selectedSystem.publication[0].doi}`}
                            to={`http://dx.doi.org/${this.props.selectedSystem.publication[0].doi}`}
                            target="_blank"
                          >
                            DOI: {this.props.selectedSystem.publication[0].doi} <FaExternalLink />
                          </ReactGA.OutboundLink>
              </li>
            </div>
                  }
            <li>Reactions <a href={`/publications/${this.props.selectedSystem.publication[0].pubId}`}>
                Dataset
                </a>
            </li>
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
