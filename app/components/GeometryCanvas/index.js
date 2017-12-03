/**
 *
 * GeometryCanvas
 *
 */

import React from 'react';
import styled from 'styled-components';

import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';

import PropTypes from 'prop-types';
import { download } from 'utils';

import { MdFileDownload } from 'react-icons/lib/md';

const MButton = styled(Button)`
  margin: 12px,
`;

const styles = (xtheme) => ({
  MuiButton: {
    margin: '12px',
    [xtheme.breakpoints.down('sm')]: {
      visibility: 'hidden',
    },
  },
});


class GeometryCanvas extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    let cifdata = this.props.cifdata;
    if (this.props.cifurl !== '') {
      axios.get(this.props.cifurl).then((res) => {
        cifdata = res.data.cifdata;
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
  let cif = ChemDoodle.readCIF(\`${cifdata}\`, 2, 2, 1);

  tfcanvas.specs.set3DRepresentation('Ball and Stick');
  tfcanvas.specs.backgroundColor = '${this.props.color}';
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
  });
});`;
        document.getElementById(`${this.props.id}_view`).appendChild(script);
      });
    } else {
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
  let cif = ChemDoodle.readCIF(\`${cifdata}\`, 1, 1, 1);

  tfcanvas.specs.set3DRepresentation('Ball and Stick');
  tfcanvas.specs.backgroundColor = '${this.props.color}';
  tfcanvas.specs.projectionPerspective_3D = true;
  tfcanvas.specs.atoms_displayLabels_3D = true;
  tfcanvas.specs.crystals_unitCellLineWidth = 5;
  tfcanvas.specs.shapes_color = 'black';
  tfcanvas.specs.shapes_lineWidth = 1;
  tfcanvas.loadContent([cif.molecule], [cif.unitCell]);
  });
});
    `;
      document.getElementById(`${this.props.id}_view`).appendChild(script);
    }
  }

  render() {
    return (
      <div>
        <p id={`${this.props.id}_script`} />
        <canvas
          id={`${this.props.id}_view`}
          height={this.props.height}
          width={this.props.width}
          style={{
            borderWidth: 1,
            borderColor: '#000000',
            borderStyle: 'solid',
          }}
        />
        <br />
        <MButton
          className={this.props.classes.MuiButton}
          raised
          onClick={() => { download(`structure_${this.props.id}.cif`, this.props.cifdata); }}
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

GeometryCanvas.defaultProps = {
  height: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  width: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  color: '#fff',
  cifdata: '',
  cifurl: '',
};

GeometryCanvas.propTypes = {
  id: PropTypes.string.isRequired,
  cifdata: PropTypes.string,
  cifurl: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  classes: PropTypes.object,
};

export default (withStyles(styles, { withTheme: true }))(GeometryCanvas);
