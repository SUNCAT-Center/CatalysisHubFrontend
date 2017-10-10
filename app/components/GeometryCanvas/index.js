/**
 *
 * GeometryCanvas
 *
 */

import React from 'react';
// import styled from 'styled-components';

import PropTypes from 'prop-types';

class GeometryCanvas extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
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
  _load_lib("http://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js", function(){

  var rotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

  //Code
  let tfcanvas = new ChemDoodle.TransformCanvas3D('${this.props.id}_view');
  let cif = ChemDoodle.readCIF(\`${this.props.cifdata}\`, 1, 1, 1);

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

  render() {
    return (
      <div>
        <p id={`${this.props.id}_script`} />
        <canvas id={`${this.props.id}_view`} height={this.props.height} width={this.props.width} />
      </div>
    );
  }
}

GeometryCanvas.defaultProps = {
  height: 450,
  width: 450,
  color: '#fff',
};

GeometryCanvas.propTypes = {
  id: PropTypes.string.isRequired,
  cifdata: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

export default GeometryCanvas;
