/**
 *
 * SingleStructureView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import ReactGA from 'react-ga';


import GeometryCanvasUuid from 'components/GeometryCanvasUuid';

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

    return (
      <div>
        {this.props.selectedUUID === '' ? null :
        <div>
          <h2>Structure {this.props.selectedSystem.Formula}</h2>
          <GeometryCanvasUuid {...this.props} uuid={this.props.selectedUUID} id={this.props.selectedUUID} />
          <ul>
            <li>Formula: {this.props.selectedSystem.Formula}</li>
            <li>Total Energy: {energy.toFixed(3)} eV</li>
            <li>DFT Code: {this.props.selectedSystem.DFTCode}</li>
            <li>DFT Functional: {this.props.selectedSystem.DFTFunctional}</li>
            <li>Title: {this.props.selectedSystem.PublicationTitle}</li>
            <li>Authors: {typeof this.props.selectedSystem.PublicationAuthors === 'undefined' ? null :
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
  selectedSystem: PropTypes.object,
};

export default SingleStructureView;
