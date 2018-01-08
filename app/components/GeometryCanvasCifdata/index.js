/**
 *
 * GeometryCanvasCifdata
 *
 */

import React, { PropTypes } from 'react';
import { withStyles } from 'material-ui/styles';
import { isMobile } from 'react-device-detect';

var jQuery = require('jquery');
window.jQuery = jQuery;
var { ChemDoodle } = require('utils/ChemDoodleWeb');

const styles = () => ({
});

const initialState = {
};

class GeometryCanvasCifdata extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'test orientation',
    };
  }
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
  var rotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.3]
  rotationMatrix = ChemDoodle.lib.mat4.rotate(rotationMatrix, -.8, [1,0,0]);
  rotationMatrix = ChemDoodle.lib.mat4.rotate(rotationMatrix, +.1, [0,0,1]);

  if(typeof cif_${this.props.selectedSystem.uniqueId} === 'undefined' ) {
   let cif_${this.props.selectedSystem.uniqueId} 
  }
  if(typeof tfcanvas_${this.props.selectedSystem.uniqueId} === 'undefined' ) {
   let tfcanvas_${this.props.selectedSystem.uniqueId} 
  }
  //Code
  tfcanvas_${this.props.selectedSystem.uniqueId} = new ChemDoodle.TransformCanvas3D('${this.props.id}_view');
  cif_${this.props.selectedSystem.uniqueId} = ChemDoodle.readCIF(\`${this.props.selectedSystem.Cifdata}\`,  ${this.props.x}, ${this.props.y}, ${this.props.z});
  if (typeof alpha_${this.props.selectedSystem.uniqueId} === 'undefined') {
  let alpha_${this.props.selectedSystem.uniqueId} = 0.; 
  }
  if (typeof beta_${this.props.selectedSystem.uniqueId} === 'undefined') {
  let beta_${this.props.selectedSystem.uniqueId} = 0.; 
  }
  if (typeof gamma_${this.props.selectedSystem.uniqueId} === 'undefined') {
  let gamma_${this.props.selectedSystem.uniqueId} = 0.;
  }

  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.set3DRepresentation('Ball and Stick');
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.backgroundColor = '${this.props.color}';
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.projectionPerspective_3D = true;
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.compass_display = true;
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.compass_size_3D = 50;
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.atoms_displayLabels_3D = true;
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.crystals_unitCellLineWidth = 5;
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.shapes_color = 'black';
  tfcanvas_${this.props.selectedSystem.uniqueId}.specs.shapes_lineWidth = 1;
  tfcanvas_${this.props.selectedSystem.uniqueId}.loadContent([cif_${this.props.selectedSystem.uniqueId}.molecule], [cif_${this.props.selectedSystem.uniqueId}.unitCell]);
  console.log(tfcanvas_${this.props.selectedSystem.uniqueId})
  /*tf.rotationMatrix = ChemDoodle.lib.mat4.rotate(tf.rotationMatrix,.1, [0,1,0]); tf.updateScene()*/
  tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix = rotationMatrix; tfcanvas_${this.props.selectedSystem.uniqueId}.updateScene()
  window.addEventListener('deviceorientation', (e) => {
  /*tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix = ChemDoodle.lib.mat4.rotate(tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix,(e.alpha -  alpha_${this.props.selectedSystem.uniqueId}) * 0.15, tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix.slice(0, 3));*/
  if(typeof beta_${this.props.selectedSystem.uniqueId} !== 'undefined') {
  tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix = ChemDoodle.lib.mat4.rotate(tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix,(e.beta -  beta_${this.props.selectedSystem.uniqueId}) * 0.15,  tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix.slice(8, 11));
  }
  if (typeof gamma_${this.props.selectedSystem.uniqueId} !== 'undefined') {
  tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix = ChemDoodle.lib.mat4.rotate(tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix,(e.gamma -  gamma_${this.props.selectedSystem.uniqueId}) * 0.15,  tfcanvas_${this.props.selectedSystem.uniqueId}.rotationMatrix.slice(4, 7));
  }
  alpha_${this.props.selectedSystem.uniqueId} = e.alpha;
  beta_${this.props.selectedSystem.uniqueId} = e.beta;
  gamma_${this.props.selectedSystem.uniqueId} = e.gamma;
   tfcanvas_${this.props.selectedSystem.uniqueId}.updateScene()

  }, true);
    `;
    const item = document.getElementById(`${this.props.id}_view`);

    item.appendChild(script);
  }
  render() {
    return (
      <div>
        {isMobile === false ? null : <p> Experimental: touch geometry and rotate mobile device.</p> }
        <p id={`${this.props.id}_script`} >
          <canvas
            id={`${this.props.id}_view`}
            height={this.props.height}
            width={this.props.width}
            style={{
              borderWidth: 0,
              borderColor: '#000000',
              borderStyle: 'solid',
            }}
          />
        </p>
      </div>
    );
  }
}
GeometryCanvasCifdata.defaultProps = {
  height: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  width: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  color: '#fff',
  cifdata: '',
  cifurl: '',
  x: 2,
  y: 2,
  z: 1,
};

GeometryCanvasCifdata.propTypes = {
  selectedSystem: PropTypes.object,
  system: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  classes: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
};


export default withStyles(styles, { withTheme: true })(GeometryCanvasCifdata);
