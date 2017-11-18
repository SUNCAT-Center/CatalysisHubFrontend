/**
 *
 * GeometryCanvasUuid
 *
 */

import React from 'react';
import styled from 'styled-components';

import Button from 'material-ui/Button';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

import PropTypes from 'prop-types';
import { download } from 'utils';

import { MdFileDownload } from 'react-icons/lib/md';

const MButton = styled(Button)`
  margin: 12px,
`;

class GeometryCanvasUuid extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidUpdate() {
    if (this.props.uuid !== '') {
      const query = {
        query: `query{systems(uniqueId: "${this.props.uuid}") {
  edges { node { Cifdata } } }}`,
      };
      axios.post(graphQLRoot, query)
      .then((res) => {
        const cifdata = res.data.data.systems.edges[0].node.Cifdata;
        this.cifdata = cifdata;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = `
function _load_lib(url, callback){
  id =  'load_' + url;
  var s = document.createElement('script');
  s.src = url;
  s.id = id;
  s.async = true;
  s.onreadystatechange = s.onload = callback;
  s.onerror = function(){console.warn("failed to load library " + url);};
  document.getElementsByTagName("head")[0].appendChild(s);

}
// Load Libraries
_load_lib("https://code.jquery.com/jquery-3.2.1.min.js", function(){
  _load_lib("https://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js", function(){

  var rotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

  //Code
  let tfcanvas = new ChemDoodle.TransformCanvas3D('${this.props.id}_view');
  let cif = ChemDoodle.readCIF(\`${cifdata}\`, ${this.props.x}, ${this.props.y}, ${this.props.z});

  tfcanvas.specs.set3DRepresentation('Ball and Stick');
  tfcanvas.specs.backgroundColor = '${this.props.color}';
  tfcanvas.specs.projectionPerspective_3D = true;
  tfcanvas.specs.atoms_displayLabels_3D = ${this.props.showLabels};
  tfcanvas.specs.crystals_unitCellLineWidth = 5;
  tfcanvas.specs.shapes_color = 'black';
  tfcanvas.specs.shapes_lineWidth = 1;
  tfcanvas.specs.fog_mode_3D = 0;
  tfcanvas.specs.shadow_3D = false;
  tfcanvas.specs.atoms_useJMOLColors = true;
  tfcanvas.specs.compass_display = ${this.props.showCompass};
  tfcanvas.loadContent([cif.molecule], [cif.unitCell]);
  });
});`;
        document.getElementById(`${this.props.id}_view`).appendChild(script);
      });
    }
  }

  render() {
    return (
      <div style={{ float: 'left', marginRight: 80 }}>
        { /*  this.state.loading ? <LinearProgress color="primary" /> : null */ }
        <p id={`${this.props.id}_script`} />
        <canvas
          id={`${this.props.id}_view`}
          height={this.props.height}
          width={this.props.width}
          style={{
            borderWidth: this.props.borderWidth,
            borderColor: '#000000',
            borderStyle: 'solid',
          }}
        />
        <br />
        {this.props.showDownload === false ? null :
        <MButton
          raised
          onClick={() => { download(`structure_${this.props.id}.cif`, this.cifdata); }}
          style={{
            margin: 12,
          }}
        >
          <MdFileDownload /> Download CIF
        </MButton>
        }
      </div>
    );
  }
}

console.log(window);
GeometryCanvasUuid.defaultProps = {
  height: Math.max(window.innerWidth * 0.5, 300),
  width: Math.max(window.innerWidth * 0.5, 300),
  color: '#fff',
  uuid: '',
  showDownload: true,
  showCompass: true,
  showLabels: true,
  x: 2,
  y: 2,
  z: 1,
  borderWidth: 0.1,
};

GeometryCanvasUuid.propTypes = {
  id: PropTypes.string.isRequired,
  uuid: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  showDownload: PropTypes.bool,
  showCompass: PropTypes.bool,
  showLabels: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  borderWidth: PropTypes.number,
};

export default GeometryCanvasUuid;
