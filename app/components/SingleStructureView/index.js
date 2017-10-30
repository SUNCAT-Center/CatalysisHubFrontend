/**
 *
 * SingleStructureView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';


import GeometryCanvasFromUuid from 'components/GeometryCanvasFromUuid';

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
          <GeometryCanvasFromUuid {...this.props} />
          <ul>
            <li>Formula: {this.props.selectedSystem.Formula}</li>
            <li>Energy: {energy.toFixed(3)} eV</li>
            <li>Title: {this.props.selectedSystem.PublicationTitle}</li>
            <li>Authors: {this.props.selectedSystem.PublicationAuthors}</li>
            <li>Year: {this.props.selectedSystem.PublicationYear}</li>
            {this.state.PublicationDoi === '' ? null :
            <div>
              <li>Publication DOI: {this.props.selectedSystem.PublicationDoi}</li>
              <li>Citation: {this.props.selectedSystem.PublicationJournal}, {this.props.selectedSystem.PublicationVolume}, {this.props.selectedSystem.PublicationVolume}</li>
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
