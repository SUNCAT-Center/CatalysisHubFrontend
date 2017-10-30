/**
 *
 * GeometryCanvasFromUuid
 *
 */

import React from 'react';
import Script from 'react-load-script';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'material-ui/Button';
import { MdFileDownload } from 'react-icons/lib/md';

import { download } from 'utils';

global.ChemDoodle = undefined;

const MButton = styled(Button)`
  margin: 12px,
`;


class GeometryCanvasFromUuid extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      cifdata: '',
      formula: '',
    };
    this.draw = this.draw.bind(this);
  }
  componentWillMount() {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
    jquery.async = false;
    document.head.appendChild(jquery);
  }

  componentDidUpdate() {
    this.redraw();
  }

  draw() {
    if (typeof window.tfcanvas === 'undefined') {
      window.tfcanvas = {};
      const tfcanvas = new ChemDoodle.TransformCanvas3D('chemdoodle_view'); // eslint-disable-line no-undef
      const cif = ChemDoodle.readCIF(this.props.selectedSystem.Cifdata, 2, 2, 1); // eslint-disable-line no-undef

      tfcanvas.specs.set3DRepresentation('Ball and Stick');
      tfcanvas.specs.backgroundColor = this.props.bg_color;
      tfcanvas.specs.projectionPerspective_3D = true;
      tfcanvas.specs.atoms_displayLabels_3D = true;
      tfcanvas.specs.crystals_unitCellLineWidth = 5;
      tfcanvas.specs.shapes_color = 'black';
      tfcanvas.specs.shapes_lineWidth = 1;
      tfcanvas.specs.fog_mode_3D = 0;
      tfcanvas.specs.shadow_3D = false;
      tfcanvas.specs.atoms_useJMOLColors = true;
      tfcanvas.specs.compass_display = true;
      tfcanvas.loadContent([cif.molecule], [cif.unitCell]);
      window.tfcanvas = tfcanvas;
    }
  }
  redraw() {
    /* eslint-disable */
    if (typeof ChemDoodle !== 'undefined' && typeof window.tfcanvas !== 'undefined' && typeof window.tfcanvas.loadContent !== 'undefined') {
      const cif = new ChemDoodle.readCIF(this.props.selectedSystem.Cifdata, 2, 2, 1);
      window.tfcanvas.loadContent([cif.molecule], [cif.unitCell]);
    }
    /* eslint-enable */
  }

  render() {
    return (
      <div>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="http://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js" onLoad={this.draw} />
        <p id={`${this.props.selectedUUID}_script`} />
        <div id={`${this.props.selectedUUID}_div`}></div>
        <canvas
          id="chemdoodle_view"
          height={this.props.height}
          width={this.props.width}
          style={{
            borderWidth: 1,
            borderColor: '#000000',
            borderStyle: 'solid',
          }}
        >
        </canvas>
        <br />
        <MButton
          raised
          onClick={() => { download(`structure_${this.props.selectedSystem.Formula}.cif`, this.props.selectedSystem.Cifdata); }}
          style={{
            margin: 12,
          }}
        >
          <MdFileDownload /> Download CIF
        </MButton>
      </div>
    );
  }
}

GeometryCanvasFromUuid.propTypes = {
  selectedUUID: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  bg_color: PropTypes.string,
  selectedSystem: PropTypes.object,
};

GeometryCanvasFromUuid.defaultProps = {
  height: 550,
  width: 550,
  bg_color: '#fff',
};


export default GeometryCanvasFromUuid;
